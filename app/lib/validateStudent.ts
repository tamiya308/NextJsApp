// Shared by the CreateUser form (instant feedback) and the createStudent Server Action (the real check).
// No 'server-only' import here, because the client component imports this file too.
import type { Student } from './students';

export type StudentErrors = Partial<Record<'StudentId' | 'FullName' | 'DOB' | 'EnrolmentDate' | 'form', string>>;

export interface CreateStudentState {
  errors: StudentErrors;
  values?: Student; // what was submitted, so the form can be refilled after a failed save
}

export function readStudentForm(formData: FormData): Student {
  const text = (name: string) => String(formData.get(name) ?? '').trim();
  return {
    StudentId: text('StudentId'),
    FullName: text('FullName'),
    DOB: text('DOB'),
    EnrolmentDate: text('EnrolmentDate'),
    IsActive: formData.get('IsActive') === 'on',
  };
}

// True for a real calendar date in YYYY-MM-DD form (rejects e.g. 2024-02-30)
function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

export function validateStudent(student: Student): StudentErrors {
  const errors: StudentErrors = {};
  const today = new Date().toISOString().slice(0, 10);

  if (!student.StudentId) errors.StudentId = 'ID is required';
  else if (!/^[A-Za-z0-9-]{1,20}$/.test(student.StudentId)) errors.StudentId = 'ID can only contain letters, numbers and dashes (max 20)';

  if (!student.FullName) errors.FullName = 'Name is required';
  else if (student.FullName.length < 2 || student.FullName.length > 100) errors.FullName = 'Name must be 2 to 100 characters';

  if (!student.DOB) errors.DOB = 'Date of birth is required';
  else if (!isValidDate(student.DOB)) errors.DOB = 'Enter a valid date';
  else if (student.DOB > today) errors.DOB = "Date of birth can't be in the future";

  if (!student.EnrolmentDate) errors.EnrolmentDate = 'Enrolment date is required';
  else if (!isValidDate(student.EnrolmentDate)) errors.EnrolmentDate = 'Enter a valid date';
  else if (!errors.DOB && student.EnrolmentDate <= student.DOB) errors.EnrolmentDate = 'Enrolment date must be after date of birth';

  return errors;
}
