import { useEffect, useState } from 'react';

import { PatientAssignmentsTable } from '#src/components/PatientAssignmentsTable';
import { useAssessmentsStore } from '#src/stores/assessments-store';
import { useAuthStore } from '#src/stores/auth-store';
import { FETCH_STATUSES } from '#src/stores/constants';
import { type TypAssessmentAssignment } from '#src/stores/types';

export function MyAssignments() {
  const patientId = useAuthStore((s) => s.user!.id);

  const {
    assessmentAssignmentsById,
    errorMessageByIdForLoadAllAssignmentsForPatient,
    fetchStatusByIdForLoadAllAssignmentsForPatient,
    loadAllAssignmentsForPatient,
  } = useAssessmentsStore();
  const [_isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);

  useEffect(() => {
    if (patientId) {
      loadAllAssignmentsForPatient(patientId);
    }
  }, [loadAllAssignmentsForPatient, patientId]);

  const onClickAssignmentAction = (assignment: TypAssessmentAssignment) => {
    alert(`Clicked assignment ${assignment.id}: ${assignment.assessmentFullName}`);
    setIsAssessmentDialogOpen(true);
  }
  // const onCloseAssessmentDialog = () => setIsAssessmentDialogOpen(false);

  const errorMessage = errorMessageByIdForLoadAllAssignmentsForPatient[patientId];
  const fetchStatus = fetchStatusByIdForLoadAllAssignmentsForPatient[patientId];
  const assignments: TypAssessmentAssignment[] = Object.values(assessmentAssignmentsById).filter(
    (assignment: TypAssessmentAssignment) => assignment.patientId === patientId,
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-4xl font-bold">
        My assignments
      </h1>

      <section className="mb-8 space-y-4">
        <p>
          Below, you can review assignments from your provider(s).
        </p>
        <p>
          Take action to complete any that aren't yet complete.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Assignments</h2>
        {fetchStatus === FETCH_STATUSES.PENDING && 'Loading...'}
        {errorMessage && (
          <div className="space-y-4 text-error">
            <p className="font-semibold">Error loading assignments:</p>
            <p>{errorMessage}</p>
          </div>
        )}
        <PatientAssignmentsTable
          assignments={assignments}
          onClickActionButton={onClickAssignmentAction} />
      </section>
    </div>
  );
}
