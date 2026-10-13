'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addStudent, setStudentActive } from '../lib/students';
import { readStudentForm, validateStudent, type CreateStudentState } from '../lib/validateStudent';

export async function updateStudentActive(studentId: string, enrolmentDate: string, isActive: boolean) {
  // Server Actions can be called with any arguments, so check them before touching the database
  if (typeof studentId !== 'string' || typeof enrolmentDate !== 'string' || typeof isActive !== 'boolean') {
    throw new Error('Invalid arguments');
  }

  await setStudentActive(studentId, enrolmentDate, isActive);

  // revalidatePath('/users');
  revalidatePath(`/users/${studentId}`);
}

export async function createStudent(_prevState: CreateStudentState, formData: FormData): Promise<CreateStudentState> {
  const student = readStudentForm(formData);

  // The browser already validated, but anyone can post to a Server Action, so check again here
  const errors = validateStudent(student);
  if (Object.keys(errors).length > 0) return { errors, values: student };

  try {
    const added = await addStudent(student);
    if (!added) return { errors: { StudentId: 'A user with this ID already exists' }, values: student };
  } catch {
    return { errors: { form: "Couldn't save the user. Please try again." }, values: student };
  }

  revalidatePath('/users');
  redirect('/users'); // outside the try, because redirect works by throwing
}
