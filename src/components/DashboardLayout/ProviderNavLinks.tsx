import { Link } from 'react-router';

export function ProviderNavLinks() {
  return (
    <nav className="flex-1 space-y-2">
      <Link className="block link-primary font-medium text-md" to="/my-patients">My patients</Link>
      <Link className="block link-primary font-medium text-md" to="/provider-education">Education</Link>
    </nav>
  );
}
