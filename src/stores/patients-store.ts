import { StatusCodes } from 'http-status-codes';
import { keyBy } from 'lodash';
import { create } from 'zustand';

import {
  API_BASE_URL,
  FETCH_STATUSES,
  GENERIC_NETWORK_ERR_MSG,
  GENERIC_SYSTEM_ERR_MSG,
} from './constants';
import { type TypFetchStatus, type TypPatient } from './types';

export interface PatientsState {
  errorMessage: string | null;
  fetchStatus: TypFetchStatus;
  patientsById: Record<string, TypPatient>;

  loadPatients: (providerId: string, forceReload?: boolean) => Promise<void>;
}

export const usePatientsStore = create<PatientsState>()(
  (set, get) => ({
    errorMessage: null,
    fetchStatus: FETCH_STATUSES.INITIAL,
    patientsById: {},

    loadPatients: async (providerId, forceReload = false) => {
      const { fetchStatus } = get();

      if (fetchStatus === FETCH_STATUSES.PENDING) {
        return;
      }
      if (fetchStatus === FETCH_STATUSES.COMPLETE && !forceReload) {
        return;
      }

      set({ fetchStatus: FETCH_STATUSES.PENDING });
      let res;
      try {
        const url = `${API_BASE_URL}/v1/providers/${providerId}/patients`;
        res = await fetch(url);
      } catch (error) {
        set({
          errorMessage: GENERIC_NETWORK_ERR_MSG,
          fetchStatus: FETCH_STATUSES.ERROR,
        });
        throw error;
      }

      if (!res.ok) {
        let errorMessage = GENERIC_SYSTEM_ERR_MSG;
        if (res.status === StatusCodes.NOT_FOUND) {
          errorMessage = 'Unknown provider';
        }
        set({ errorMessage, fetchStatus: FETCH_STATUSES.ERROR });
        throw new Error(errorMessage);
      }

      const payload = await res.json();
      const patients: TypPatient[] = payload.data.patients;
      set({
        errorMessage: null,
        fetchStatus: FETCH_STATUSES.COMPLETE,
        patientsById: keyBy(patients, 'id'),
      });
    },
  }),
);
