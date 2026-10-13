'use client';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { readStudentForm, validateStudent, type CreateStudentState, type StudentErrors } from '../lib/validateStudent';

interface Props {
  // Server Action that saves the user; returns errors, or redirects on success
  action: (state: CreateStudentState, formData: FormData) => Promise<CreateStudentState>;
  cancelHref: string;
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

const Field = ({ label, error, children }: FieldProps) => (
  <label className="block">
    <span className="text-sm font-bold">{label}</span>
    {children}
    {error && <span className="block text-sm text-red-600">{error}</span>}
  </label>
);

const inputClass = 'mt-1 w-full rounded border px-2 py-1';

const CreateUser = ({ action, cancelHref }: Props) => {
  const [state, formAction, isPending] = useActionState(action, { errors: {} });
  const [clientErrors, setClientErrors] = useState<StudentErrors | null>(null);
  const errors = clientErrors ?? state.errors;
  const values = state.values;

  // Check in the browser first so obvious mistakes don't need a round trip to the server
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const found = validateStudent(readStudentForm(new FormData(e.currentTarget)));
    if (Object.keys(found).length > 0) {
      e.preventDefault();
      setClientErrors(found);
    } else {
      setClientErrors(null);
    }
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex max-w-md flex-col gap-4">
      <h1 className="text-lg font-bold">Add user</h1>

      <Field label="ID" error={errors.StudentId}>
        <input name="StudentId" placeholder="e.g. S021" maxLength={20} required defaultValue={values?.StudentId} aria-invalid={!!errors.StudentId} className={inputClass} />
      </Field>
      <Field label="Name" error={errors.FullName}>
        <input name="FullName" maxLength={100} required defaultValue={values?.FullName} aria-invalid={!!errors.FullName} className={inputClass} />
      </Field>
      <Field label="Date of birth" error={errors.DOB}>
        <input name="DOB" type="date" required defaultValue={values?.DOB} aria-invalid={!!errors.DOB} className={inputClass} />
      </Field>
      <Field label="Enrolment date" error={errors.EnrolmentDate}>
        <input name="EnrolmentDate" type="date" required defaultValue={values?.EnrolmentDate} aria-invalid={!!errors.EnrolmentDate} className={inputClass} />
      </Field>
      <label className="inline-flex items-center gap-2">
        <input name="IsActive" type="checkbox" defaultChecked={values?.IsActive ?? true} />
        Active
      </label>

      {errors.form && <p className="text-sm text-red-600" aria-live="polite">{errors.form}</p>}

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </button>
        <Link href={cancelHref} className="btn">Cancel</Link>
      </div>
    </form>
  )
}

export default CreateUser
