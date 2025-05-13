import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { AssignAssessmentDialog } from '#src/components/AssignAssessmentDialog';
import { useAuthStore } from '#src/stores/auth-store';
import { FETCH_STATUSES } from '#src/stores/constants';
import { usePatientsStore } from '#src/stores/patients-store';

export function PatientManager() {
  const { patientId } = useParams<{ patientId: string }>();

  const providerId = useAuthStore((s) => s.user?.id);
  const {
    errorMessage,
    fetchStatus,
    loadPatients,
    patientsById,
  } = usePatientsStore();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
    if (providerId) {
      loadPatients(providerId);
    }
  }, [loadPatients, providerId]);

  const onClickAssignAssessment = () => setIsAssignDialogOpen(true);
  const onCloseAssignDialog = () => setIsAssignDialogOpen(false);

  const patient = patientId ? patientsById[patientId] : undefined;

  if (fetchStatus === FETCH_STATUSES.PENDING) {
    return (
      <div className="p-6 text-center">
        Loading...
      </div>
    );
  }
  if (errorMessage) {
    return (
      <div className="p-6 text-red-600">
        Error loading: {errorMessage}
      </div>
    );
  }
  if (!patient) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Patient not found</h2>
      </div>
    );
  }

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
        <h2 className="text-2xl font-semibold mb-3">Assessments</h2>
        COMING SOON!
      </section>
    </div>
  );
}
