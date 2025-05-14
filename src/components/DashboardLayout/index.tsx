import { Link, Outlet } from 'react-router';

import logo from '#src/assets/logo.png'
import { useAuthStore } from '#src/stores/auth-store';
import { USER_TYPES } from '#src/stores/constants';

import { PatientNavLinks } from './PatientNavLinks';
import { ProviderNavLinks } from './ProviderNavLinks';

export function DashboardLayout() {
  const { logout, user } = useAuthStore();
  const userType = user!.type;

  const homeUrl = userType === USER_TYPES.PROVIDER
    ? '/provider'
    : '/patient';

  return (
    <div className="flex h-screen">
      <aside className="w-60 bg-base-200 p-4 flex flex-col">
        <Link className="mb-6" to={homeUrl}>
          <img src={logo} alt="App Logo" className="h-10 w-10 mb-1" />
          <h2 className="text-xl font-bold">
            My Blooprint
          </h2>
        </Link>
        { user!.type === USER_TYPES.PATIENT && <PatientNavLinks /> }
        { user!.type === USER_TYPES.PROVIDER && <ProviderNavLinks /> }
        <button className="mt-auto btn btn-primary" onClick={logout}>
          Sign out
        </button>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
