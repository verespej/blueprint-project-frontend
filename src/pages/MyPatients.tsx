import { useEffect } from 'react';

import { useAuthStore } from '#src/stores/auth-store';
import { FETCH_STATUSES } from '#src/stores/constants';
import { usePatientsStore } from '#src/stores/patients-store';

import { PatientsTable } from '#src/components/PatientsTable';

export function MyPatients() {
  const providerUserId = useAuthStore(s => s.user!.id);
  const {
    errorMessage,
    fetchStatus,
    loadPatients,
    patientsById,
  } = usePatientsStore();

  useEffect(() => {
    loadPatients(providerUserId);
  }, [loadPatients, providerUserId]);

  const patients = Object.values(patientsById);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        My case load
      </h1>

      <section className="mb-8 space-y-4">
        <p>
          Select a patient from the table below to view their details.
        </p>
      </section>

      <section>
        {fetchStatus === FETCH_STATUSES.PENDING && 'Loading...'}
        {errorMessage && (
          <div className="space-y-4 text-error mb-4">
            <p className="font-semibold">Error loading patients:</p>
            <p>{errorMessage}</p>
          </div>
        )}
        {!errorMessage && patients.length < 1 && 'No patients yet'}
        {patients.length > 0 && (
          <PatientsTable patients={patients} />
        )}
      </section>
    </div>
  );
}
