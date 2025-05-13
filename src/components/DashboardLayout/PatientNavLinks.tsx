import { Link } from 'react-router';

export function PatientNavLinks() {
  return (
    <nav className="flex-1 space-y-2">
      <Link className="block link-primary font-medium text-md" to="/my-providers">My providers</Link>
      <Link className="block link-primary font-medium text-md" to="/my-assignments">Assignments</Link>
      <Link className="block link-primary font-medium text-md" to="/patient-education">Education</Link>
    </nav>
  );
}
