'use server';

import { signIn } from 'next-auth/react';
import { AuthError } from 'next-auth';

export async function login(email: string, password: string) {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    
    return { error: 'An error occurred. Please try again.' };
  }
}
