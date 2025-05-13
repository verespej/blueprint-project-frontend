import { useState } from 'react';
import { useNavigate } from 'react-router'

import { useAuthStore, type AuthState } from '#src/stores/auth-store';
import { type TypUser } from '#src/stores/types';

export function Login() {
  const login = useAuthStore((s: AuthState) => s.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user: TypUser = await login(email, password);
      const dashboardPath = user.type === 'provider' ? '/provider' : '/patient';
      navigate(dashboardPath);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const onEditEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const onEditPassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form
        className="card p-6 w-full max-w-sm space-y-4"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-bold">Sign in</h1>
        <input
          className="input w-full"
          onChange={onEditEmail}
          placeholder="Email"
          type="email"
          value={email}
        />
        <input
          className="input w-full"
          onChange={onEditPassword}
          placeholder="Password"
          type="password"
          value={password}
        />
        <button className="btn btn-primary w-full" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}
