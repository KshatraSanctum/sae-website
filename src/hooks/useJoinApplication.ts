import { useCallback, useState } from 'react';
import { submitJoinApplication, type JoinApplicationInput } from '../services/api';

export type JoinApplicationFormData = JoinApplicationInput;

export interface UseJoinApplicationOptions {
  readonly isAuthenticated: boolean;
}

export const EMPTY_JOIN_APPLICATION: JoinApplicationFormData = {
  name: '',
  roll: '',
  branch: '',
  year: '',
  phone: '',
  crew: '',
  subdomain: '',
  skills: '',
  availability: '',
  motivation: '',
  whatsappConsent: false,
};

const formatSubmissionTime = (submittedAt?: string): string =>
  new Date(submittedAt ?? Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export interface JoinApplicationState {
  formData: JoinApplicationFormData;
  submitted: boolean;
  submissionTime: string;
  isSubmitting: boolean;
  submissionError: string | null;
  updateField: <Field extends keyof JoinApplicationFormData>(
    field: Field,
    value: JoinApplicationFormData[Field],
  ) => void;
  selectCrew: (crew: string, subdomain?: string) => void;
  submit: () => Promise<void>;
  reset: () => void;
}

/**
 * Owns the recruitment form state and lifecycle without coupling it to the
 * page's presentation. A future API submission can replace `submit` without
 * rewriting the form markup.
 */
export function useJoinApplication({ isAuthenticated }: UseJoinApplicationOptions): JoinApplicationState {
  const [formData, setFormData] = useState<JoinApplicationFormData>(EMPTY_JOIN_APPLICATION);
  const [submitted, setSubmitted] = useState(false);
  const [submissionTime, setSubmissionTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const updateField = useCallback(
    <Field extends keyof JoinApplicationFormData>(
      field: Field,
      value: JoinApplicationFormData[Field],
    ): void => {
      setFormData((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const selectCrew = useCallback((crew: string, subdomain = ''): void => {
    setFormData((current) => ({
      ...current,
      crew,
      subdomain: subdomain || current.subdomain,
    }));
  }, []);

  const submit = useCallback(async (): Promise<void> => {
    setSubmissionError(null);
    if (!isAuthenticated) {
      setSubmissionError('Sign in with Google before submitting your society application.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitJoinApplication(formData);
      setSubmissionTime(formatSubmissionTime(response.submittedAt));
      setSubmitted(true);
    } catch (submissionErrorValue) {
      setSubmissionError(
        submissionErrorValue instanceof Error && submissionErrorValue.message.trim()
          ? submissionErrorValue.message
          : 'Your application could not be submitted. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isAuthenticated]);

  const reset = useCallback((): void => {
    setFormData(EMPTY_JOIN_APPLICATION);
    setSubmissionTime('');
    setSubmitted(false);
    setSubmissionError(null);
  }, []);

  return {
    formData,
    submitted,
    submissionTime,
    isSubmitting,
    submissionError,
    updateField,
    selectCrew,
    submit,
    reset,
  };
}
