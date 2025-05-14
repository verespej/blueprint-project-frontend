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
  type TypAssessmentResponse,
  type TypAssessmentSummary,
  type TypErrorResponse,
  type TypFetchStatus,
} from './types';

export function getFetchKeyForLoadAssignments(
  providerId: string,
  patientId: string,
): string {
  return `${providerId}_${patientId}`;
}

export function getFetchKeyForLoadResponses(
  patientId: string,
  assignmentId: string,
): string {
  return `${patientId}_${assignmentId}`;
}

export interface AssessmentsState {
  errorMessageForLoadAssessmentSummaries: string | null;
  fetchStatusForLoadAssessmentSummaries: TypFetchStatus;
  assessmentSummariesByAssessmentId: Record<string, TypAssessmentSummary>;

  errorMessagesByIdForLoadFullAssessment: Record<string, string | null>;
  fetchStatusesByIdForLoadFullAssessment: Record<string, TypFetchStatus>;
  fullAssessmentsById: Record<string, TypAssessment>;

  errorMessageByFetchKeyForLoadAssignments: Record<string, string | null>;
  fetchStatusByFetchKeyForLoadAssignments: Record<string, TypFetchStatus>;
  assessmentAssignmentsById: Record<string, TypAssessmentAssignment>;

  errorMessageByIdForLoadAllAssignmentsForPatient: Record<string, string | null>;
  fetchStatusByIdForLoadAllAssignmentsForPatient: Record<string, TypFetchStatus>;
  // Note: Updates assessmentAssignmentsById

  errorMessageForAssignAssessment: string | null;
  fetchStatusForAssignAssessment: TypFetchStatus;
  // Note: Updates assessmentAssignmentsById

  errorMessageByFetchKeyForLoadResponses: Record<string, string | null>;
  fetchStatusByFetchKeyForLoadResponses: Record<string, TypFetchStatus>;
  assessmentResponsesById: Record<string, TypAssessmentResponse>;

  errorMessageForRecordAssessmentResponse: string | null;
  fetchStatusForRecordAssessmentResponse: TypFetchStatus;
  // Note: Updates assessmentResponsesById

  errorMessageForMarkAssignmentComplete: string | null;
  fetchStatusForMarkAssignmentComplete: TypFetchStatus;
  // Note: Updates assessmentAssignmentsById

  loadAssessmentSummaries: (forceReload?: boolean) => Promise<void>;
  loadFullAssessment: (assessmentId: string) => Promise<void>;
  loadAssignments: (providerId: string, patientId: string, forceReload?: boolean) => Promise<void>;
  loadAllAssignmentsForPatient: (patientId: string, forceReload?: boolean) => Promise<void>;
  assignAssessment: (providerId: string, patientId: string, assessmentId: string) => Promise<boolean>;
  loadResponses: (patientId: string, assignmentId: string, forceReload?: boolean) => Promise<void>;
  recordAssessmentResponse: (
    patientId: string,
    assignmentId: string,
    questionId: string,
    answerId: string,
  ) => Promise<boolean>;
  markAssignmentComplete: (patientId: string, assignmentId: string) => Promise<boolean>;
}

export const useAssessmentsStore = create<AssessmentsState>()(
  (set, get) => ({
    errorMessageForLoadAssessmentSummaries: null,
    fetchStatusForLoadAssessmentSummaries: FETCH_STATUSES.INITIAL,
    assessmentSummariesByAssessmentId: {},

    errorMessagesByIdForLoadFullAssessment: {},
    fetchStatusesByIdForLoadFullAssessment: {},
    fullAssessmentsById: {},

    errorMessageByFetchKeyForLoadAssignments: {},
    fetchStatusByFetchKeyForLoadAssignments: {},
    assessmentAssignmentsById: {},

    errorMessageByIdForLoadAllAssignmentsForPatient: {},
    fetchStatusByIdForLoadAllAssignmentsForPatient: {},
    // Note: Updates assessmentAssignmentsById

    errorMessageForAssignAssessment: null,
    fetchStatusForAssignAssessment: FETCH_STATUSES.INITIAL,
    // Note: Updates assessmentAssignmentsById

    errorMessageByFetchKeyForLoadResponses: {},
    fetchStatusByFetchKeyForLoadResponses: {},
    assessmentResponsesById: {},

    errorMessageForRecordAssessmentResponse: null,
    fetchStatusForRecordAssessmentResponse: FETCH_STATUSES.INITIAL,
    // Note: Updates assessmentResponsesById

    errorMessageForMarkAssignmentComplete: null,
    fetchStatusForMarkAssignmentComplete: FETCH_STATUSES.INITIAL,
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

    loadAssignments: async (providerId, patientId, forceReload = false) => {
      const fetchKey = getFetchKeyForLoadAssignments(providerId, patientId);

      const status = get().fetchStatusByFetchKeyForLoadAssignments[fetchKey];
      if (status === FETCH_STATUSES.PENDING) {
        return;
      }
      if (status === FETCH_STATUSES.COMPLETE && !forceReload) {
        return;
      }

      const setAssessmentAssignments = (additionalAssessmentAssignments: TypAssessmentAssignment[]) => set({
        assessmentAssignmentsById: {
          ...get().assessmentAssignmentsById,
          ...keyBy(additionalAssessmentAssignments, 'id'),
        },
      });
      const setError = (newErrorMsg: string | null) => set({
        errorMessageByFetchKeyForLoadAssignments: {
          ...get().errorMessageByFetchKeyForLoadAssignments,
          [fetchKey]: newErrorMsg,
        },
      });
      const setStatus = (newStatus: TypFetchStatus) => set({
        fetchStatusByFetchKeyForLoadAssignments: {
          ...get().fetchStatusByFetchKeyForLoadAssignments,
          [fetchKey]: newStatus,
        },
      });

      setStatus(FETCH_STATUSES.PENDING);
      const url = `${API_BASE_URL}/v1/providers/${providerId}/patients/${patientId}/assessments`;
      const res = await fetch(url);

      if (!res.ok) {
        let errorMessage = res.status === StatusCodes.NOT_FOUND || res.status === StatusCodes.FORBIDDEN
          ? "The requested action isn't permitted"
          : GENERIC_SYSTEM_ERR_MSG;
        setError(errorMessage);
        setStatus(FETCH_STATUSES.ERROR);
        throw new Error(errorMessage);
      }

      const payload = await res.json();
      const assignments: TypAssessmentAssignment[] = payload.data.assessmentInstances;
      setAssessmentAssignments(assignments);
      setError(null);
      setStatus(FETCH_STATUSES.COMPLETE);
    },

    loadAllAssignmentsForPatient: async (patientId, forceReload = false) => {
      const status = get().fetchStatusByIdForLoadAllAssignmentsForPatient[patientId];
      if (status === FETCH_STATUSES.PENDING) {
        return;
      }
      if (status === FETCH_STATUSES.COMPLETE && !forceReload) {
        return;
      }

      const setAssessmentAssignments = (additionalAssessmentAssignments: TypAssessmentAssignment[]) => set({
        assessmentAssignmentsById: {
          ...get().assessmentAssignmentsById,
          ...keyBy(additionalAssessmentAssignments, 'id'),
        },
      });
      const setError = (newErrorMsg: string | null) => set({
        errorMessageByIdForLoadAllAssignmentsForPatient: {
          ...get().errorMessageByIdForLoadAllAssignmentsForPatient,
          [patientId]: newErrorMsg,
        },
      });
      const setStatus = (newStatus: TypFetchStatus) => set({
        fetchStatusByIdForLoadAllAssignmentsForPatient: {
          ...get().fetchStatusByIdForLoadAllAssignmentsForPatient,
          [patientId]: newStatus,
        },
      });

      setStatus(FETCH_STATUSES.PENDING);
      const url = `${API_BASE_URL}/v1/patients/${patientId}/assessments`;
      const res = await fetch(url);

      if (!res.ok) {
        let errorMessage = res.status === StatusCodes.NOT_FOUND
          ? "The requested action isn't permitted"
          : GENERIC_SYSTEM_ERR_MSG;
        setError(errorMessage);
        setStatus(FETCH_STATUSES.ERROR);
        throw new Error(errorMessage);
      }

      const payload = await res.json();
      const assignments: TypAssessmentAssignment[] = payload.data.assessmentInstances;
      setAssessmentAssignments(assignments);
      setError(null);
      setStatus(FETCH_STATUSES.COMPLETE);
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

    loadResponses: async (patientId, assignmentId, forceReload = false) => {
      const fetchKey = getFetchKeyForLoadResponses(patientId, assignmentId);

      const status = get().fetchStatusByFetchKeyForLoadResponses[fetchKey];
      if (status === FETCH_STATUSES.PENDING) {
        return;
      }
      if (status === FETCH_STATUSES.COMPLETE && !forceReload) {
        return;
      }

      const setAssessmentAssignments = (additionalAssessmentResponses: TypAssessmentResponse[]) => set({
        assessmentResponsesById: {
          ...get().assessmentResponsesById,
          ...keyBy(additionalAssessmentResponses, 'id'),
        },
      });
      const setError = (newErrorMsg: string | null) => set({
        errorMessageByFetchKeyForLoadResponses: {
          ...get().errorMessageByFetchKeyForLoadResponses,
          [fetchKey]: newErrorMsg,
        },
      });
      const setStatus = (newStatus: TypFetchStatus) => set({
        fetchStatusByFetchKeyForLoadResponses: {
          ...get().fetchStatusByFetchKeyForLoadResponses,
          [fetchKey]: newStatus,
        },
      });

      setStatus(FETCH_STATUSES.PENDING);
      const url = `${API_BASE_URL}/v1/patients/${patientId}/assessments/${assignmentId}/responses`;
      const res = await fetch(url);

      if (!res.ok) {
        let errorMessage = res.status === StatusCodes.NOT_FOUND || res.status === StatusCodes.UNPROCESSABLE_ENTITY
          ? "The requested action isn't permitted"
          : GENERIC_SYSTEM_ERR_MSG;
        setError(errorMessage);
        setStatus(FETCH_STATUSES.ERROR);
        throw new Error(errorMessage);
      }

      const payload = await res.json();
      const responses: TypAssessmentResponse[] = payload.data.assessmentResponses;
      setAssessmentAssignments(responses);
      setError(null);
      setStatus(FETCH_STATUSES.COMPLETE);
    },

    recordAssessmentResponse: async (
      patientId,
      assignmentId,
      questionId,
      answerId,
    ) => {
      // Even though it's reasonable to want to make multiple simultaneous
      // requests, we prevent it to keep things simple. Allowing multiple
      // requests creates a lot of edge cases related to request status.
      if (get().fetchStatusForRecordAssessmentResponse === FETCH_STATUSES.PENDING) {
        return false;
      }

      set({ fetchStatusForRecordAssessmentResponse: FETCH_STATUSES.PENDING });
      const url = `${API_BASE_URL}/v1/patients/${patientId}/assessments/${assignmentId}/responses`;
      const res = await fetch(url, {
        method: HTTP_METHODS.POST,
        headers: { [HEADER_NAMES.CONTENT_TYPE]: MIME_TYPES.APP_JSON },
        body: JSON.stringify({ answerId, questionId }),
      });

      if (!res.ok) {
        let errorMessage = GENERIC_SYSTEM_ERR_MSG;
        if (res.status === StatusCodes.NOT_FOUND) {
          errorMessage = "The requested action isn't permitted";
        }
        if (res.status === StatusCodes.UNPROCESSABLE_ENTITY) {
          const payload: TypErrorResponse = await res.json();
          errorMessage = payload.errorMessage
        }
        set({
          errorMessageForRecordAssessmentResponse: errorMessage,
          fetchStatusForRecordAssessmentResponse: FETCH_STATUSES.ERROR,
        });
        throw new Error(errorMessage);
      }

      const payload = await res.json();
      const assessmentResponse: TypAssessmentResponse = payload.data.assessmentResponse;
      set({
        errorMessageForRecordAssessmentResponse: null,
        fetchStatusForRecordAssessmentResponse: FETCH_STATUSES.COMPLETE,
        assessmentResponsesById: {
          ...get().assessmentResponsesById,
          [assessmentResponse.id]: assessmentResponse,
        },
      });

      return true;
    },

    markAssignmentComplete: async (patientId, assignmentId) => {
      // Even though it's reasonable to want to make multiple simultaneous
      // requests, we prevent it to keep things simple. Allowing multiple
      // requests creates a lot of edge cases related to request status.
      if (get().fetchStatusForMarkAssignmentComplete === FETCH_STATUSES.PENDING) {
        return false;
      }

      set({ fetchStatusForMarkAssignmentComplete: FETCH_STATUSES.PENDING });
      const url = `${API_BASE_URL}/v1/patients/${patientId}/assessments/${assignmentId}/submissions`;
      const res = await fetch(url, { method: HTTP_METHODS.POST });

      if (!res.ok) {
        let errorMessage = GENERIC_SYSTEM_ERR_MSG;
        if (res.status === StatusCodes.NOT_FOUND) {
          errorMessage = "The requested action isn't permitted";
        }
        if (res.status === StatusCodes.UNPROCESSABLE_ENTITY) {
          const payload: TypErrorResponse = await res.json();
          errorMessage = payload.errorMessage
        }
        set({
          errorMessageForMarkAssignmentComplete: errorMessage,
          fetchStatusForMarkAssignmentComplete: FETCH_STATUSES.ERROR,
        });
        throw new Error(errorMessage);
      }

      const payload = await res.json();
      const assessmentAssignment: TypAssessmentAssignment = payload.data.assessmentInstance;
      set({
        errorMessageForMarkAssignmentComplete: null,
        fetchStatusForMarkAssignmentComplete: FETCH_STATUSES.COMPLETE,
        assessmentAssignmentsById: {
          ...get().assessmentAssignmentsById,
          [assessmentAssignment.id]: assessmentAssignment,
        },
      });

      return true;
    }
  }),
);
