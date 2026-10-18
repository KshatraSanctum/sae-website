import { useCallback, useState } from 'react';

export interface JoinApplicationFormData {
  name: string;
  roll: string;
  branch: string;
  year: string;
  email: string;
  phone: string;
  crew: string;
  subdomain: string;
  motivation: string;
}

export const EMPTY_JOIN_APPLICATION: JoinApplicationFormData = {
  name: '',
  roll: '',
  branch: '',
  year: '',
  email: '',
  phone: '',
  crew: '',
  subdomain: '',
  motivation: '',
};

const formatSubmissionTime = (): string =>
  new Date().toLocaleDateString('en-IN', {
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
  updateField: <Field extends keyof JoinApplicationFormData>(
    field: Field,
    value: JoinApplicationFormData[Field],
  ) => void;
  selectCrew: (crew: string, subdomain?: string) => void;
  submit: () => void;
  reset: () => void;
}

/**
 * Owns the recruitment form state and lifecycle without coupling it to the
 * page's presentation. A future API submission can replace `submit` without
 * rewriting the form markup.
 */
export function useJoinApplication(): JoinApplicationState {
  const [formData, setFormData] = useState<JoinApplicationFormData>(EMPTY_JOIN_APPLICATION);
  const [submitted, setSubmitted] = useState(false);
  const [submissionTime, setSubmissionTime] = useState('');

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

  const submit = useCallback((): void => {
    setSubmissionTime(formatSubmissionTime());
    setSubmitted(true);
  }, []);

  const reset = useCallback((): void => {
    setFormData(EMPTY_JOIN_APPLICATION);
    setSubmissionTime('');
    setSubmitted(false);
  }, []);

  return { formData, submitted, submissionTime, updateField, selectCrew, submit, reset };
}
