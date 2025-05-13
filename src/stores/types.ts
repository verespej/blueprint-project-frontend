import {
  FETCH_STATUSES,
  USER_TYPES,
} from './constants';

export type TypErrorResponse = {
  errorMessage: string;
}

export type TypFetchStatus = typeof FETCH_STATUSES[
  keyof typeof FETCH_STATUSES
];

export type TypUserType = typeof USER_TYPES[
  keyof typeof USER_TYPES
];

export interface TypUser {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  type: TypUserType;
}

export interface TypPatient {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  offboardedAt: string;
  onboardedAt: string;
}

export interface TypAssessmentSummary {
  displayName: string;
  disorderDisplayName: string;
  fullName: string;
  id: string;
  name: string;
}

export interface TypAssessment {
  disorder: string;
  id: string;
  name: string;
  fullName: string;
  content: {
    displayName: string;
    sections: {
      title: string;
      type: string;
      answers: {
        answerId: string;
        displayOrder: number;
        title: string;
        value: string;
      }[];
      questions: {
        displayOrder: number;
        questionId: string;
        title: string;
      }[];
    },
  },
}

export interface TypAssessmentAssignment {
  assessmentId: string;
  id: string;
  patientId: string;
  providerId: string;
  sentAt: string;
  slug: string;
}
