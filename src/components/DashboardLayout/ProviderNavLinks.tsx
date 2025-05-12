import { Link } from 'react-router';

export function ProviderNavLinks() {
  return (
    <nav className="flex-1 space-y-2">
      <Link className="block" to="/my-patients">My patients</Link>
      <Link className="block" to="/provider-education">Education</Link>
    </nav>
  );
}
