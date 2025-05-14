import { useEffect, useState } from 'react';

import { AssignmentCompletionDialog } from '#src/components/AssignmentCompletionDialog';
import { PatientAssignmentsTable } from '#src/components/PatientAssignmentsTable';
import { useAssessmentsStore } from '#src/stores/assessments-store';
import { useAuthStore } from '#src/stores/auth-store';
import { FETCH_STATUSES } from '#src/stores/constants';
import { type TypAssessmentAssignment } from '#src/stores/types';

export function MyAssignments() {
  const patientId = useAuthStore((s) => s.user!.id);

  const {
    assessmentAssignmentsById,
    errorMessageByIdForLoadAllAssignmentsForPatient,
    fetchStatusByIdForLoadAllAssignmentsForPatient,
    loadAllAssignmentsForPatient,
  } = useAssessmentsStore();
  const [
    assignmentInProgress,
    setAssignmentInProgress,
  ] = useState<TypAssessmentAssignment | null>(null);

  useEffect(() => {
    if (patientId) {
      loadAllAssignmentsForPatient(patientId);
    }
  }, [loadAllAssignmentsForPatient, patientId]);

  const onClickAssignmentAction = (assignment: TypAssessmentAssignment) => {
    setAssignmentInProgress(assignment);
  }
  const onCloseAssessmentDialog = () => {
    setAssignmentInProgress(null);
  }

  const errorMessage = errorMessageByIdForLoadAllAssignmentsForPatient[patientId];
  const fetchStatus = fetchStatusByIdForLoadAllAssignmentsForPatient[patientId];
  const assignments: TypAssessmentAssignment[] = Object.values(assessmentAssignmentsById).filter(
    (assignment: TypAssessmentAssignment) => assignment.patientId === patientId,
  );

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">
        My assignments
      </h1>

      <section className="mb-8 space-y-4">
        <p>
          Below, you can review assignments from your provider(s).
        </p>
        <p>
          Take action to complete any assignments that aren't yet complete.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Assignments</h2>
        {fetchStatus === FETCH_STATUSES.PENDING && 'Loading...'}
        {errorMessage && (
          <div className="space-y-4 text-error mb-4">
            <p className="font-semibold">Error loading assignments:</p>
            <p>{errorMessage}</p>
          </div>
        )}
        {!errorMessage && assignments.length < 1 && 'No assignments yet'}
        {assignments.length > 0 &&
          <PatientAssignmentsTable
            assignments={assignments}
            onClickActionButton={onClickAssignmentAction} />
        }
        {assignmentInProgress && (
          <AssignmentCompletionDialog
            assignment={assignmentInProgress}
            isOpen={Boolean(assignmentInProgress)}
            onClose={onCloseAssessmentDialog}
            patientId={patientId}
          />
        )}
      </section>
    </div>
  );
}
