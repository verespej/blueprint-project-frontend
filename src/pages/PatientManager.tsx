import { useEffect } from 'react';
import { useParams } from 'react-router';

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

  useEffect(() => {
    if (providerId) {
      loadPatients(providerId);
    }
  }, [loadPatients, providerId]);

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
      <h1 className="text-3xl font-bold">
        Patient: {patient.givenName} {patient.familyName}
      </h1>

      <p>Email: {patient.email}</p>

      <section>
        <h2 className="text-2xl font-semibold">Actions</h2>
        <ul className="list-disc list-inside">
          <li>Assign assessment</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Assessments</h2>
        <ul className="list-disc list-inside">
          <li>...</li>
        </ul>
      </section>
    </div>
  );
}
