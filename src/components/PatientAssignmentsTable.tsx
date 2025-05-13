import { type TypAssessmentAssignment } from '#src/stores/types';
import { formatFriendlyDate } from '#src/utils';

interface Props {
  assignments: TypAssessmentAssignment[];
  onClickActionButton?: (assignment: TypAssessmentAssignment) => void;
}

export function PatientAssignmentsTable({ assignments, onClickActionButton }: Props) {
  const onClickActionButton_ = (assignment: TypAssessmentAssignment) => () => {
    if (onClickActionButton) {
      onClickActionButton(assignment);
    }
  }

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/10 px-4">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Task</th>
            <th className="px-4 py-2 text-left">Assigned by</th>
            <th className="px-4 py-2 text-left">Date assigned</th>
            <th className="px-4 py-2 text-left">Date completed</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td className="border-t px-4 py-2">
                Complete questionairre
              </td>
              <td className="border-t px-4 py-2">
                {assignment.providerGivenName} {assignment.providerFamilyName}
              </td>
              <td className="border-t px-4 py-2">
                {
                  assignment.sentAt
                  ? formatFriendlyDate(assignment.sentAt)
                  : 'Unknown'
                }
              </td>
              <td className="border-t px-4 py-2">
                { assignment.submittedAt && formatFriendlyDate(assignment.submittedAt) }
                { !assignment.submittedAt && (
                  <button className="btn btn-primary"
                    onClick={onClickActionButton_(assignment)}
                  >
                    Do assignment
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
