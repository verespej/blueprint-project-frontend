import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { useAssessmentsStore } from '#src/stores/assessments-store';
import { FETCH_STATUSES } from '#src/stores/constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  providerId: string;
}

export function AssignAssessmentDialog({
  isOpen,
  onClose,
  patientId,
  providerId,
}: Props) {
  const {
    assessmentSummariesByAssessmentId,
    assignAssessment,
    errorMessageForAssignAssessment,
    errorMessageForLoadAssessmentSummaries,
    fetchStatusForAssignAssessment,
    fetchStatusForLoadAssessmentSummaries,
    loadAssessmentSummaries,
  } = useAssessmentsStore();

  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadAssessmentSummaries();
    }
  }, [isOpen, loadAssessmentSummaries]);

  const onSelectAssessment = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(e.target.value);
  }
  const onClickAssign = async () => {
    try {
      const requested = await assignAssessment(
        providerId,
        patientId,
        selectedId,
      );
      if (requested) {
        toast.success('Assessment assigned!');
        onClose();
      }
    } catch {
      toast.error('Error assigning assessment');
    }
  }

  if (!isOpen) {
    return null;
  }

  const loadPending = fetchStatusForLoadAssessmentSummaries === FETCH_STATUSES.PENDING;
  const loadComplete = fetchStatusForLoadAssessmentSummaries === FETCH_STATUSES.COMPLETE;
  const assignPending = fetchStatusForAssignAssessment === FETCH_STATUSES.PENDING;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-2xl leading-none"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Assign an assessment
        </h2>

        {loadPending && (
          <p>Loading assessments...</p>
        )}
        {errorMessageForLoadAssessmentSummaries && (
          <div className="text-error">
            <p className="font-semibold">An error occurred while loading assessments:</p>
            <p className="mb-4">{errorMessageForLoadAssessmentSummaries}</p>
          </div>
        )}
        {loadComplete && (
          <select className="select select-bordered w-full mb-4"
            onChange={onSelectAssessment}
            value={selectedId}
          >
            <option value="" disabled>
              -- Choose an assessment --
            </option>
            {Object.values(assessmentSummariesByAssessmentId).map((a) => (
              <option key={a.id} value={a.id}>
                {a.displayName} ({a.fullName})
              </option>
            ))}
          </select>
        )}

        <div className="flex justify-end space-x-2">
          <button className="btn btn-ghost"
            onClick={onClose}
            disabled={loadPending || assignPending}
          >
            Cancel
          </button>
          <button className="btn btn-primary"
            disabled={!selectedId || loadPending || assignPending}
            onClick={onClickAssign}
          >
            {assignPending ? 'Assigning...' : 'Assign assessment'}
          </button>
        </div>

        {errorMessageForAssignAssessment && (
          <div>
            Error assigning assessment:
            <p className="text-red-600 mb-3">{errorMessageForAssignAssessment}</p>
          </div>
        )}
      </div>
    </div>
  )
}
