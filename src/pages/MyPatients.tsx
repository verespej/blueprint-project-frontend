import { useEffect } from 'react';

import { useAuthStore } from '#src/stores/auth-store';
import { usePatientsStore } from '#src/stores/patients-store';

import { PatientsTable } from '#src/components/PatientsTable';

export function MyPatients() {
  const providerUserId = useAuthStore(s => s.user!.id);
  const {
    // errorMessage,
    // fetchStatus,
    loadPatients,
    patientsById,
  } = usePatientsStore();

  useEffect(() => {
    loadPatients(providerUserId);
  }, [loadPatients, providerUserId]);

  const patients = Object.values(patientsById);

  // TODO: Spinner when loading, error message on error
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        My case load
      </h1>

      <PatientsTable patients={patients} />
    </div>
  );
}
