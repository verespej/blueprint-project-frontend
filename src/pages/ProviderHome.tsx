import { useAuthStore } from '#src/stores/auth-store';

export function ProviderHome() {
  const user = useAuthStore(s => s.user);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {user!.givenName}!
      </h1>

      <p className="mb-6">
        Use the menu on the left to navigate your dashboard.
      </p>

      <p className="mb-3">
        Here're a few things you can do:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>View and manage your patient case load</li>
        <li>Brush up on topics of interest using educational materials</li>
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
