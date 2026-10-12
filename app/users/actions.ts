'use server';
import { revalidatePath } from 'next/cache';
import { setStudentActive } from '../lib/students';

export async function updateStudentActive(studentId: string, enrolmentDate: string, isActive: boolean) {
  // Server Actions can be called with any arguments, so check them before touching the database
  if (typeof studentId !== 'string' || typeof enrolmentDate !== 'string' || typeof isActive !== 'boolean') {
    throw new Error('Invalid arguments');
  }

  await setStudentActive(studentId, enrolmentDate, isActive);

  // revalidatePath('/users');
  revalidatePath(`/users/${studentId}`);
}
