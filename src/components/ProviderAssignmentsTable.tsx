import { type TypAssessmentAssignment } from '#src/stores/types';
import { formatFriendlyDate } from '#src/utils';

interface Props {
  assignments: TypAssessmentAssignment[];
}

export function ProviderAssignmentsTable({ assignments }: Props) {
  const onClickAssignment = (_assignmentId: string) => () => {
    alert('Assignment review coming soon!');
  }

  const createQuickLink = (assignment: TypAssessmentAssignment): string => {
    return new URL(
      `/quick-access/${assignment.slug}`,
      window.location.href,
    ).toString();
  }

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/10 px-4">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Assessment</th>
            <th className="px-4 py-2 text-left">Date assigned</th>
            <th className="px-4 py-2 text-left">Date completed</th>
            <th className="px-4 py-2 text-left">Quick link for patient</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr className="cursor-pointer hover:bg-primary"
              key={assignment.id}
              onClick={onClickAssignment(assignment.id)}
            >
              <td className="border-t px-4 py-2">
                {assignment.assessmentDisplayName} ({assignment.assessmentFullName})
              </td>
              <td className="border-t px-4 py-2">
                {
                  assignment.sentAt
                  ? formatFriendlyDate(assignment.sentAt)
                  : 'Not assigned'
                }
              </td>
              <td className="border-t px-4 py-2">
                {
                  assignment.submittedAt
                  ? formatFriendlyDate(assignment.submittedAt)
                  : 'Not completed'
                }
              </td>
              <td className="border-t px-4 py-2">
                {createQuickLink(assignment)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
