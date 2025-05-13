export const HTTP_METHODS = {
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
} as const;

export const HEADER_NAMES = {
  CONTENT_TYPE: 'Content-Type',
} as const;

export const MIME_TYPES = {
  APP_JSON: 'application/json',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const USER_TYPES = {
  PATIENT: 'patient',
  PROVIDER: 'provider',
} as const;

export const GENERIC_SYSTEM_ERR_MSG = 'An unexpected error occurred. Please try the last action again. If this error continues to occur, please contact support at support@blooprint.demo.';

export const FETCH_STATUSES = {
  INITIAL: 'initial',
  PENDING: 'pending',
  COMPLETE: 'complete',
  ERROR: 'error',
} as const;
