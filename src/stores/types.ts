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
};

export type TypPatient = {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  offboardedAt: string;
  onboardedAt: string;
};

export type TypAssessmentSummary = {
  displayName: string;
  disorderDisplayName: string;
  fullName: string;
  id: string;
  name: string;
};

export type TypAssessmentQuestion = {
  displayOrder: number;
  id: string;
  title: string;
};

export type TypAssessmentAnswer = {
  displayOrder: number;
  id: string;
  title: string;
  value: string;
};

export type TypAssessmentSection = {
  answers: TypAssessmentAnswer[];
  questions: TypAssessmentQuestion[];
  title: string;
  type: string;
};

export type TypAssessment = {
  disorder: string;
  fullName: string;
  id: string;
  name: string;
  content: {
    displayName: string;
    sections: TypAssessmentSection[],
  },
};

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
};

export type TypAssessmentResponse = {
  answerId: string;
  assessmentInstanceId: string;
  id: string;
  questionId: string;
};
