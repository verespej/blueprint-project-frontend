import { StatusCodes } from 'http-status-codes';
import { keyBy } from 'lodash';
import { create } from 'zustand';

import {
  API_BASE_URL,
  FETCH_STATUSES,
  GENERIC_SYSTEM_ERR_MSG,
  HEADER_NAMES,
  HTTP_METHODS,
  MIME_TYPES,
} from './constants';
import {
  type TypAssessment,
  type TypAssessmentAssignment,
  type TypAssessmentSummary,
  type TypErrorResponse,
  type TypFetchStatus,
} from './types';

export interface AssessmentsState {
  errorMessageForLoadAssessmentSummaries: string | null;
  fetchStatusForLoadAssessmentSummaries: TypFetchStatus;
  assessmentSummariesByAssessmentId: Record<string, TypAssessmentSummary>;

  errorMessagesByIdForLoadFullAssessment: Record<string, string | null>;
  fetchStatusesByIdForLoadFullAssessment: Record<string, TypFetchStatus>;
  fullAssessmentsById: Record<string, TypAssessment>;

  errorMessageForLoadAssessmentAssignments: string | null;
  fetchStatusForLoadAssessmentAssignments: TypFetchStatus;
  assessmentAssignmentsById: Record<string, TypAssessmentAssignment>;

  errorMessageForAssignAssessment: string | null;
  fetchStatusForAssignAssessment: TypFetchStatus;
  // Note: Updates assessmentAssignmentsById

  loadAssessmentSummaries: (forceReload?: boolean) => Promise<void>;
  loadFullAssessment: (assessmentId: string) => Promise<void>;
  loadAssessmentAssignments: (providerId: string, patientId: string, forceReload?: boolean) => Promise<void>;
  assignAssessment: (providerId: string, patientId: string, assessmentId: string) => Promise<boolean>;
}

export const useAssessmentsStore = create<AssessmentsState>()(
  (set, get) => ({
    errorMessageForLoadAssessmentSummaries: null,
    fetchStatusForLoadAssessmentSummaries: FETCH_STATUSES.INITIAL,
    assessmentSummariesByAssessmentId: {},

    errorMessagesByIdForLoadFullAssessment: {},
    fetchStatusesByIdForLoadFullAssessment: {},
    fullAssessmentsById: {},

    errorMessageForLoadAssessmentAssignments: null,
    fetchStatusForLoadAssessmentAssignments: FETCH_STATUSES.INITIAL,
    assessmentAssignmentsById: {},

    errorMessageForAssignAssessment: null,
    fetchStatusForAssignAssessment: FETCH_STATUSES.INITIAL,
    // Note: Updates assessmentAssignmentsById

    loadAssessmentSummaries: async (forceReload = false) => {
      const { fetchStatusForLoadAssessmentSummaries } = get();
      if (fetchStatusForLoadAssessmentSummaries === FETCH_STATUSES.PENDING) {
        return;
      }
      if (fetchStatusForLoadAssessmentSummaries === FETCH_STATUSES.COMPLETE && !forceReload) {
        return;
      }
 
      set({ fetchStatusForLoadAssessmentSummaries: FETCH_STATUSES.PENDING });
      const url = `${API_BASE_URL}/v1/assessments`;
      const res = await fetch(url);

      if (!res.ok) {
        set({
          errorMessageForLoadAssessmentSummaries: GENERIC_SYSTEM_ERR_MSG,
          fetchStatusForLoadAssessmentSummaries: FETCH_STATUSES.ERROR,
        });
        throw new Error(GENERIC_SYSTEM_ERR_MSG);
      }

      const payload = await res.json();
      const assessments: TypAssessmentSummary[] = payload.data.assessments;
      set({
        errorMessageForLoadAssessmentSummaries: null,
        fetchStatusForLoadAssessmentSummaries: FETCH_STATUSES.COMPLETE,
        assessmentSummariesByAssessmentId: keyBy(assessments, 'id'),
      });
    },

    loadFullAssessment: async (assessmentId) => {
      const status = get().fetchStatusesByIdForLoadFullAssessment[assessmentId];
      if (status === FETCH_STATUSES.PENDING || status === FETCH_STATUSES.COMPLETE) {
        return;
      }

      const setAssessment = (assessment: TypAssessment) => set({
        fullAssessmentsById: {
          ...get().fullAssessmentsById,
          [assessmentId]: assessment,
        },
      });
      const setError = (newErrorMsg: string | null) => set({
        errorMessagesByIdForLoadFullAssessment: {
          ...get().errorMessagesByIdForLoadFullAssessment,
          [assessmentId]: newErrorMsg,
        },
      });
      const setStatus = (newStatus: TypFetchStatus) => set({
        fetchStatusesByIdForLoadFullAssessment: {
          ...get().fetchStatusesByIdForLoadFullAssessment,
          [assessmentId]: newStatus,
        },
      });

      setStatus(FETCH_STATUSES.PENDING);
      const url = `${API_BASE_URL}/v1/assessments/${assessmentId}`;
      const res = await fetch(url);

      if (!res.ok) {
        let errorMessage = res.status === StatusCodes.NOT_FOUND
          ? 'Unknown assessment'
          : GENERIC_SYSTEM_ERR_MSG;
        setError(errorMessage);
        setStatus(FETCH_STATUSES.ERROR);
        throw new Error(errorMessage);
      }

      const payload = await res.json();
      const assessment: TypAssessment = payload.data.assessment;
      setAssessment(assessment);
      setError(null);
      setStatus(FETCH_STATUSES.COMPLETE);
    },

    loadAssessmentAssignments: async (providerId, patientId, forceReload = false) => {
      const { fetchStatusForLoadAssessmentAssignments } = get();
      if (fetchStatusForLoadAssessmentAssignments === FETCH_STATUSES.PENDING) {
        return;
      }
      if (fetchStatusForLoadAssessmentAssignments === FETCH_STATUSES.COMPLETE && !forceReload) {
        return;
      }

      set({ fetchStatusForLoadAssessmentAssignments: FETCH_STATUSES.PENDING });
      const url = `${API_BASE_URL}/v1/providers/${providerId}/patients/${patientId}/assessments`;
      const res = await fetch(url);

      if (!res.ok) {
        let errorMessage = res.status === StatusCodes.NOT_FOUND || res.status === StatusCodes.FORBIDDEN
          ? "The requested action isn't permitted"
          : GENERIC_SYSTEM_ERR_MSG;
        set({
          errorMessageForLoadAssessmentAssignments: errorMessage,
          fetchStatusForLoadAssessmentAssignments: FETCH_STATUSES.ERROR,
        });
        throw new Error(errorMessage);
      }

      const payload = await res.json();
      const assignments: TypAssessmentAssignment[] = payload.data.assessmentInstances;
      set({
        errorMessageForLoadAssessmentAssignments: null,
        fetchStatusForLoadAssessmentAssignments: FETCH_STATUSES.COMPLETE,
        assessmentAssignmentsById: keyBy(assignments, 'id'),
      });
    },

    assignAssessment: async (providerId, patientId, assessmentId) => {
      // Even though it's reasonable to want to make multiple simultaneous
      // requests, we prevent it to keep things simple. Allowing multiple
      // requests creates a lot of edge cases related to request status.
      if (get().fetchStatusForAssignAssessment === FETCH_STATUSES.PENDING) {
        return false;
      }

      set({ fetchStatusForAssignAssessment: FETCH_STATUSES.PENDING });
      const url = `${API_BASE_URL}/v1/providers/${providerId}/patients/${patientId}/assessments`;
      const res = await fetch(url, {
        method: HTTP_METHODS.POST,
        headers: { [HEADER_NAMES.CONTENT_TYPE]: MIME_TYPES.APP_JSON },
        body: JSON.stringify({ assessmentId }),
      });

      if (!res.ok) {
        let errorMessage = GENERIC_SYSTEM_ERR_MSG;
        if (res.status === StatusCodes.NOT_FOUND || res.status === StatusCodes.FORBIDDEN) {
          errorMessage = "The requested action isn't permitted";
        }
        if (res.status === StatusCodes.UNPROCESSABLE_ENTITY) {
          const payload: TypErrorResponse = await res.json();
          errorMessage = payload.errorMessage
        }
        set({
          errorMessageForAssignAssessment: errorMessage,
          fetchStatusForAssignAssessment: FETCH_STATUSES.ERROR,
        });
        throw new Error(errorMessage);
      }

      const payload = await res.json();
      const assignment: TypAssessmentAssignment = payload.data.assessmentInstance;
      set({
        errorMessageForAssignAssessment: null,
        fetchStatusForAssignAssessment: FETCH_STATUSES.COMPLETE,
        assessmentAssignmentsById: {
          ...get().assessmentAssignmentsById,
          [assignment.id]: assignment,
        },
      });

      return true;
    },
  }),
);
