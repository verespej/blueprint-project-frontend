import { Link } from 'react-router';

export function PatientNavLinks() {
  return (
    <nav className="flex-1 space-y-2">
      <Link className="block" to="/my-providers">My providers</Link>
      <Link className="block" to="/my-assignments">Assignments</Link>
      <Link className="block" to="/patient-education">Education</Link>
    </nav>
  );
}
