'use server';

import { cookies } from 'next/headers';
import type { SessionPayload } from '@/lib/types';
import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';
import { redirect } from 'next/navigation';

const SECRET_KEY = process.env.SESSION_SECRET_KEY || 'a-super-secret-key-that-is-at-least-32-bytes-long';
const password = 'password-for-scrypt';

// Prepare encryption key
const key = scryptSync(password, 'salt', 32);
const iv = Buffer.alloc(16, 0); // Initialization vector.

const SESSION_COOKIE_NAME = 'prolink_session';

export async function createSession(payload: Omit<SessionPayload, 'expires'>) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session: SessionPayload = { ...payload, expires };

  const cipher = createCipheriv('aes-256-cbc', key, iv);
  const encryptedSession = Buffer.concat([
    cipher.update(JSON.stringify(session)),
    cipher.final(),
  ]).toString('hex');
  
  cookies().set(SESSION_COOKIE_NAME, encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    const decryptedSession = Buffer.concat([
      decipher.update(Buffer.from(sessionCookie, 'hex')),
      decipher.final(),
    ]).toString();
    
    const session = JSON.parse(decryptedSession);

    if (new Date(session.expires) < new Date()) {
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to decrypt session:', error);
    return null;
  }
}

export async function deleteSession() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect('/login');
}
