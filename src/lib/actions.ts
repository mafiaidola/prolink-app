'use server';

import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Ensure the admin password is set in environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD is not set in environment variables.');
}

const loginSchema = z.object({
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginState = {
  error?: string;
  success?: boolean;
};

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const validatedFields = loginSchema.safeParse({
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.password?.[0],
    };
  }

  if (validatedFields.data.password !== ADMIN_PASSWORD) {
    return { error: 'Invalid password.' };
  }

  await createSession({ isAdmin: true });
  
  redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
}
