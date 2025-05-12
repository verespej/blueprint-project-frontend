import { Link, Outlet } from 'react-router';

import logo from '#src/assets/logo.png'
import {
  type AuthState,
  useAuthStore,
  USER_TYPES,
} from '#src/stores/auth-store';

import { PatientNavLinks } from './PatientNavLinks';
import { ProviderNavLinks } from './ProviderNavLinks';

export function DashboardLayout() {
  const { logout, user } = useAuthStore();

  return (
    <div className="flex h-screen">
      <aside className="w-60 bg-base-200 p-4 flex flex-col">
        <img src={logo} alt="App Logo" className="h-10 w-10 mb-1" />
        <h2 className="text-xl font-bold mb-6">
          My Blooprint
        </h2>
        { user.type === USER_TYPES.PATIENT && <PatientNavLinks /> }
        { user.type === USER_TYPES.PROVIDER && <ProviderNavLinks /> }
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
