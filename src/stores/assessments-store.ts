import { keyBy } from 'lodash';
import { create } from 'zustand';

import {
  API_BASE_URL,
  FETCH_STATUSES,
  GENERIC_SYSTEM_ERR_MSG,
} from './constants';
import {
  type TypAssessment,
  type TypAssessmentAssignment,
  type TypAssessmentSummary,
  type TypFetchStatus,
} from './types';

export interface AssessmentsState {
  errorMessageForLoadAssessmentSummaries: string | null;
  fetchStatusForLoadAssessmentSummaries: TypFetchStatus;
  assessmentSummariesByAssessmentId: Record<string, TypAssessmentSummary>;

  errorMessageForLoadFullAssessment: string | null;
  fetchStatusForLoadFullAssessment: TypFetchStatus;
  fullAssessmentsById: Record<string, TypAssessment>;

  errorMessageForLoadAssessmentAssignments: string | null;
  fetchStatusForLoadAssessmentAssignments: TypFetchStatus;
  assessmentAssignmentsById: Record<string, TypAssessmentAssignment>;

  errorMessageForAssignAssessment: string | null;
  fetchStatusForAssignAssessment: TypFetchStatus;
  // Note: Updates assessmentAssignmentsById

  loadAssessmentSummaries: (forceReload?: boolean) => Promise<void>;
  loadFullAssessment: (assessmentId: string) => Promise<void>;
  loadAssessmentAssignments: (providerId: string, patientId: string) => Promise<void>;
  assignAssessment: (providerId: string, patientId: string, assessmentId: string) => Promise<void>;
}

export const useAssessmentsStore = create<AssessmentsState>()(
  (set, get) => ({
    errorMessageForLoadAssessmentSummaries: null,
    fetchStatusForLoadAssessmentSummaries: FETCH_STATUSES.INITIAL,
    assessmentSummariesByAssessmentId: {},

    errorMessageForLoadFullAssessment: null,
    fetchStatusForLoadFullAssessment: FETCH_STATUSES.INITIAL,
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

    loadFullAssessment: async (_assessmentId) => {
      // GET /assessments/:assessmentId
    },

    loadAssessmentAssignments: async (_providerId, _patientId) => {
      // GET /providers/:providerId/patients/:patientId/assessments
    },

    assignAssessment: async (_providerId, _patientId, _assessmentId) => {
      // POST /providers/:providerId/patients/:patientId/assessments assessmentId
    }
  }),
);
