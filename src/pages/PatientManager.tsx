import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { AssignAssessmentDialog } from '#src/components/AssignAssessmentDialog';
import { ProviderAssignmentsTable } from '#src/components/ProviderAssignmentsTable';
import {
  getFetchKeyForLoadAssignments,
  useAssessmentsStore,
} from '#src/stores/assessments-store';
import { useAuthStore } from '#src/stores/auth-store';
import { FETCH_STATUSES } from '#src/stores/constants';
import { type TypAssessmentAssignment } from '#src/stores/types';
import { usePatientsStore } from '#src/stores/patients-store';

export function PatientManager() {
  const { patientId } = useParams<{ patientId: string }>();

  const providerId = useAuthStore((s) => s.user!.id);

  const {
    assessmentAssignmentsById,
    errorMessageByFetchKeyForLoadAssignments,
    fetchStatusByFetchKeyForLoadAssignments,
    loadAssignments,
  } = useAssessmentsStore();
  const {
    errorMessage: errorMessageForLoadPatients,
    fetchStatus: statusForLoadPatients,
    loadPatients,
    patientsById,
  } = usePatientsStore();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
    if (providerId) {
      loadPatients(providerId);
    }
  }, [loadPatients, providerId]);

  useEffect(() => {
    if (providerId && patientId) {
      loadAssignments(providerId, patientId);
    }
  }, [loadAssignments, patientId, providerId]);

  const patient = patientId ? patientsById[patientId] : undefined;

  if (statusForLoadPatients === FETCH_STATUSES.PENDING) {
    return (
      <div className="p-6 space-y-4 text-center">
        Loading...
      </div>
    );
  }
  if (errorMessageForLoadPatients) {
    return (
      <div className="p-6 space-y-4 text-error">
        <p className="font-semibold">Error loading patient info:</p>
        <p>{errorMessageForLoadPatients}</p>
      </div>
    );
  }
  if (!patientId || !patient) {
    return (
      <div className="p-6 space-y-4 text-error">
        <h1 className="text-4xl font-bold">Patient not found</h1>
      </div>
    );
  }

  const onClickAssignAssessment = () => setIsAssignDialogOpen(true);
  const onCloseAssignDialog = () => setIsAssignDialogOpen(false);

  const assignmentsFetchKey = getFetchKeyForLoadAssignments(providerId, patientId);
  const errorMessageForLoadAssignments = errorMessageByFetchKeyForLoadAssignments[assignmentsFetchKey];
  const statusForLoadAssignments = fetchStatusByFetchKeyForLoadAssignments[assignmentsFetchKey];
  const assignments: TypAssessmentAssignment[] = Object.values(assessmentAssignmentsById).filter(
    (assignment: TypAssessmentAssignment) => {
      return assignment.providerId === providerId && assignment.patientId === patientId;
    },
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-4xl font-bold">
        Patient: {patient.givenName} {patient.familyName}
      </h1>

      <section className="mb-8">
        <div>
          <span className="mr-2 font-semibold">Email:</span>
          <a href={`mailto:${patient.email}`} className="link-primary">
            {patient.email}
          </a>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Actions</h2>
        <button className="mt-auto btn btn-secondary"
          onClick={onClickAssignAssessment}
        >
          Assign assessment
        </button>
        {patientId && providerId && (
          <AssignAssessmentDialog
            isOpen={isAssignDialogOpen}
            onClose={onCloseAssignDialog}
            patientId={patientId}
            providerId={providerId}
          />
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Patient assignments</h2>
        {statusForLoadAssignments === FETCH_STATUSES.PENDING && 'Loading...'}
        {errorMessageForLoadAssignments && (
          <div className="space-y-4 text-error">
            <p className="font-semibold">Error loading patient assignments:</p>
            <p>{errorMessageForLoadPatients}</p>
          </div>
        )}
        {assignments.length < 1 && 'No assignments yet'}
        {assignments.length > 0 && (
          <ProviderAssignmentsTable assignments={assignments} />
        )}
      </section>
    </div>
  );
}
