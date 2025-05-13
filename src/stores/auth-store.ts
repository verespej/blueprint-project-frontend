import { StatusCodes } from 'http-status-codes';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  API_BASE_URL,
  GENERIC_SYSTEM_ERR_MSG,
  HEADER_NAMES,
  HTTP_METHODS,
  MIME_TYPES,
} from './constants';
import { type TypUser } from './types';

export interface AuthState {
  user: TypUser | null;

  login: (email: string, password: string) => Promise<TypUser>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      user: null,

      login: async (email, password) => {
        const loginUrl = `${API_BASE_URL}/v1/sessions`;
        const res = await fetch(loginUrl, {
          method: HTTP_METHODS.POST,
          headers: { [HEADER_NAMES.CONTENT_TYPE]: MIME_TYPES.APP_JSON },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          if (res.status === StatusCodes.NOT_FOUND || res.status === StatusCodes.UNAUTHORIZED) {
            throw new Error('Unknown user or incorrect password');
          }
          throw new Error(GENERIC_SYSTEM_ERR_MSG);
        }

        const payload = await res.json();
        const user: TypUser = payload.data.user;

        set({ user });

        return user;
      },

      logout: async () => {
        const logoutUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/sessions`;
        const res = await fetch(logoutUrl, { method: HTTP_METHODS.DELETE });

        if (!res.ok) {
          throw new Error('Logout failed');
        }

        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
