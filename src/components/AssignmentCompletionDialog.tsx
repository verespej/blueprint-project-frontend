import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { FETCH_STATUSES } from '#src/stores/constants';
import {
  getFetchKeyForLoadResponses,
  useAssessmentsStore,
} from '#src/stores/assessments-store';
import {
  type TypAssessment,
  type TypAssessmentAnswer,
  type TypAssessmentAssignment,
} from '#src/stores/types';

interface Props {
  assignment: TypAssessmentAssignment;
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

export function AssignmentCompletionDialog({
  assignment,
  isOpen,
  onClose,
  patientId,
}: Props) {
  const {
    // For retrieving assessment
    loadFullAssessment,
    fetchStatusesByIdForLoadFullAssessment,
    errorMessagesByIdForLoadFullAssessment,
    fullAssessmentsById,

    // For retrieving existing responses
    loadResponses,
    fetchStatusByFetchKeyForLoadResponses,
    errorMessageByFetchKeyForLoadResponses,
    assessmentResponsesById,

    // For recording responses
    recordAssessmentResponse,
    fetchStatusForRecordAssessmentResponse,
    errorMessageForRecordAssessmentResponse,

    // For submitting the assignment
    markAssignmentComplete,
    fetchStatusForMarkAssignmentComplete,
    errorMessageForMarkAssignmentComplete,

    // For reloading assignments
    loadAllAssignmentsForPatient,
  } = useAssessmentsStore();

  const { assessmentId, id: assignmentId } = assignment;

  const statusForLoadAssessment = fetchStatusesByIdForLoadFullAssessment[assessmentId];
  const errorForLoadAssessment = errorMessagesByIdForLoadFullAssessment[assessmentId];

  const fetchKeyForLoadResponses = getFetchKeyForLoadResponses(patientId, assignmentId);
  const statusForLoadResponses = fetchStatusByFetchKeyForLoadResponses[fetchKeyForLoadResponses];
  const errorForLoadResponses = errorMessageByFetchKeyForLoadResponses[fetchKeyForLoadResponses];

  const assessment: TypAssessment = fullAssessmentsById[assessmentId];

  const isAssignmentComplete = Boolean(assignment.submittedAt);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    loadFullAssessment(assessmentId);
    loadResponses(patientId, assignmentId);
  }, [
    assessmentId,
    assignmentId,
    isOpen,
    loadFullAssessment,
    loadResponses,
    patientId,
  ]);

  const existingResponses = useMemo(
    () => Object.values(assessmentResponsesById).filter(
      (r) => r.assessmentInstanceId === assignmentId,
    ),
    [assessmentResponsesById, assignmentId]
  )

  const questions = useMemo(() => {
    if (!assessment) {
      return [];
    }
    // TODO: Sections should have display order, like questions and answers
    return assessment.content.sections.flatMap((section) => {
      const sectionAnswers: TypAssessmentAnswer[] = [...section.answers];
      sectionAnswers.sort((l, r) => l.displayOrder - r.displayOrder);

      return section.questions.map((question) => ({
        answers: section.answers,
        displayOrder: question.displayOrder,
        id: question.id,
        questionText: question.title,
        sectionTitle: section.title,
      })).sort((l, r) => l.displayOrder - r.displayOrder);
    });
  }, [assessment]);

  const onClickAnswer = (answerId: string) => async () => {
    await recordAssessmentResponse(
      patientId,
      assignmentId,
      currentQuestion.id,
      answerId,
    );
  }

  const onClickSubmit = async () => {
    const submitted = await markAssignmentComplete(patientId, assignmentId);
    if (submitted) {
      toast.success('Assignment completed!');
      onClose();
      // Force reload all assignments since the submission could've
      // triggered additional assignments.
      // 1. We intentionally don't call with await - let it run async
      // 2. We're not worried if it fails - it's not critical for the user
      //    to see new assignments immediately
      loadAllAssignmentsForPatient(patientId, true);
    }
  }

  // Note: This is below useMemo because we need to avoid calls to useMemo
  // being conditional.
  if (!isOpen) {
    return null;
  }

  const unansweredQuestions = questions.filter((question) => {
    const existingResponseForQuestion = existingResponses.find(
      (response) => response.questionId === question.id
    );
    return !existingResponseForQuestion;
  });
  const currentQuestion = unansweredQuestions[0];

  const totalQuestionsCount = questions.length;
  const answeredQuestionsCount = questions.length - unansweredQuestions.length;

  const isDoingInitialLoading =
    statusForLoadAssessment === FETCH_STATUSES.PENDING ||
    statusForLoadResponses === FETCH_STATUSES.PENDING;
  const showQuestions =
    statusForLoadAssessment === FETCH_STATUSES.COMPLETE &&
    statusForLoadResponses === FETCH_STATUSES.COMPLETE;

  const isMarkCompletePending = fetchStatusForMarkAssignmentComplete === FETCH_STATUSES.PENDING;

  let submitDialogText = '👇 Submit your responses to complete the assignment.';
  let submitButtonText = 'Submit responses';
  let submitButtonDisabled = false;
  if (isMarkCompletePending) {
    submitButtonText = 'Submitting...';
    submitButtonDisabled = true;
  }
  if (isAssignmentComplete) {
    submitDialogText = "You've submitted your responses. You can close this dialog.";
    submitButtonText = 'Already submitted';
    submitButtonDisabled = true;
  }

  let assessmentDisplayName = assessment?.content?.displayName;
  if (assessmentDisplayName && !assessmentDisplayName.toUpperCase().endsWith('QUESTIONNAIRE')) {
    assessmentDisplayName += ' questionnaire';
  }

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-lg relative">
        <button className="absolute top-2 right-4 opacity-50 text-2xl leading-none cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>

        {isDoingInitialLoading && (
          <p className="my-4">Loading...</p>
        )}

        {showQuestions && answeredQuestionsCount < totalQuestionsCount && (
          <>
            <div className="mb-2 font-semibold mr-4">
              {assessmentDisplayName}:
              Question {answeredQuestionsCount + 1} of {totalQuestionsCount}
            </div>
            <progress className="progress progress-primary mb-4"
              max={totalQuestionsCount}
              value={answeredQuestionsCount}>
            </progress>
          </>
        )}

        {showQuestions && currentQuestion && (
          <>
            <p className="mb-4 text-lg">{currentQuestion.sectionTitle}</p>
            <hr className="mb-4" />
            <p className="mb-4 text-lg">{currentQuestion.questionText}</p>
            <div className="space-y-2 mb-4">
              {currentQuestion.answers.map((answer) => (
                <button className="btn btn-outline w-full text-left"
                  disabled={fetchStatusForRecordAssessmentResponse === FETCH_STATUSES.PENDING}
                  key={answer.id}
                  onClick={onClickAnswer(answer.id)}
                >
                  {answer.title}
                </button>
              ))}
            </div>
          </>
        )}
        {showQuestions && !currentQuestion && (
          <>
            <p className="mb-4 text-xl">All questions answered!</p>
            <p className="mb-6">{submitDialogText}</p>
            <button className="btn btn-primary w-full"
              disabled={submitButtonDisabled}
              onClick={onClickSubmit}
            >
              {submitButtonText}
            </button>
          </>
        )}

        {errorForLoadAssessment && (
          <p className="text-error mb-4">
            {errorForLoadAssessment}
          </p>
        )}
        {errorForLoadResponses && (
          <p className="text-error mb-4">
            {errorForLoadResponses}
          </p>
        )}
        {errorMessageForRecordAssessmentResponse && (
          <p className="text-error mb-4">
            {errorMessageForRecordAssessmentResponse}
          </p>
        )}
        {errorMessageForMarkAssignmentComplete && (
          <p className="text-error mt-4">
            {errorMessageForMarkAssignmentComplete}
          </p>
        )}
      </div>
    </div>
  )
}
