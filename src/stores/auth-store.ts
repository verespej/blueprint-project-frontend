import { StatusCodes } from 'http-status-codes';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { HEADER_NAMES, HTTP_METHODS, MIME_TYPES } from './constants';

export const USER_TYPES = {
  PATIENT: 'patient',
  PROVIDER: 'provider',
} as const;

export interface User {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  type: 'patient' | 'provider';
}

export interface AuthState {
  user: User | null;

  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      user: null,

      login: async (email, password) => {
        const loginUrl = `${import.meta.env.VITE_API_BASE_URL}/session`;
        const res = await fetch(loginUrl, {
          method: HTTP_METHODS.POST,
          headers: { [HEADER_NAMES.CONTENT_TYPE]: MIME_TYPES.APP_JSON },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          if (res.status === StatusCodes.NOT_FOUND || res.status === StatusCodes.UNAUTHORIZED) {
            throw new Error('Unknown user or incorrect password');
          }
          throw new Error('System error: Please try again. If this error persists, please contact support at support@blooprint.demo.');
        }

        const payload = await res.json();
        const user: User = payload.data.user;

        set({ user });

        return user;
      },

      logout: async () => {
        const logoutUrl = `${import.meta.env.VITE_API_BASE_URL}/session`;
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
