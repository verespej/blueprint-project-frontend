import { useEffect } from 'react';
import { useNavigate } from 'react-router';

//
// The intent here is to be able to quickly jump to a particular page
// using a special link (specifically, the slug in the link).
//
// For now, this is only used to jump patients to their assignments.
// Since they have to be logged in to access this page, we can just
// direct them to the assignments route.
//
// One idea for the future is to not require login when completing
// certain assignments. This could potentially fit in more provider
// and patient workflows and raise compliance. However, we'd have to
// think through privacy and security risks.
//

export function QuickAccess() {
  // const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/my-assignments');
  }, [navigate]);

  return (
    <div>
      Navigating to page...
    </div>
  );
}
