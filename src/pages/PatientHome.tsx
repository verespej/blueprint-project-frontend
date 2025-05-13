import { useAuthStore } from '#src/stores/auth-store';

export function PatientHome() {
  const givenName = useAuthStore(s => s.user!.givenName);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {givenName}!
      </h1>

      <p className="mb-6">
        Use the menu on the left to navigate your dashboard.
      </p>

      <p className="mb-3">
        Here're a few things you can do:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>View your provider(s)</li>
        <li>Review and complete tasks assigned to you by your provider(s)</li>
        <li>Learn about topics of interest using educational materials</li>
      </ul>

      <p className="mb-3">
        COMING SOON:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Manage your account</li>
      </ul>
    </div>
  );
}
