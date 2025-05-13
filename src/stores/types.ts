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

export type TypUser = {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  type: TypUserType;
}

export type TypPatient = {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  offboardedAt: string;
  onboardedAt: string;
}

export type TypAssessmentSummary = {
  displayName: string;
  disorderDisplayName: string;
  fullName: string;
  id: string;
  name: string;
}

export type TypAssessment = {
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

export type TypAssessmentAssignment = {
  assessmentDisplayName: string;
  assessmentFullName: string;
  assessmentId: string;
  id: string;
  patientId: string;
  providerFamilyName: string;
  providerGivenName: string;
  providerId: string;
  sentAt: string | null;
  slug: string;
  submittedAt: string | null;
}
