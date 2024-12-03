'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './LoginPage.css';

interface LoginForm {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required();

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        // Redirect user to profile or a custom redirect URL from the server
        const redirectUrl = responseData.redirectUrl || '/profile';
        router.push(redirectUrl);
      } else {
        const errorData = await response.json();
        setLoginError(errorData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('An unexpected error occurred');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              {...register('email')}
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              {...register('password')}
            />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          {loginError && <p className="error-text">{loginError}</p>}
          
          <button
            type="submit"
            className="submit-button"
          >
            Login
          </button>
        </form>

        <div className="register-link">
          <p>Don't have an account? 
            <Link href="/register" className="link"> Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
