import { LoginForm } from '@/components/login-form';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background via-secondary to-background">
      <LoginForm />
    </main>
  );
}
