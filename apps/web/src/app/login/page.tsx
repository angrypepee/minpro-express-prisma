'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';

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

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Redirect to homepage after successful login
        window.location.href = '/'; 
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #3b82f6, #9333ea)'
    }}>
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '384px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="email" style={{ display: 'block', color: '#4b5563', fontWeight: 'bold', marginBottom: '8px' }}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              style={{
                width: '100%', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                border: '1px solid #d1d5db', 
                boxSizing: 'border-box', 
                fontSize: '16px', 
                color: '#4b5563', 
                marginBottom: '8px'
              }}
              {...register('email')}
            />
            {errors.email && <p style={{ color: '#ef4444', fontSize: '14px' }}>{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="password" style={{ display: 'block', color: '#4b5563', fontWeight: 'bold', marginBottom: '8px' }}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              style={{
                width: '100%', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                border: '1px solid #d1d5db', 
                boxSizing: 'border-box', 
                fontSize: '16px', 
                color: '#4b5563', 
                marginBottom: '8px'
              }}
              {...register('password')}
            />
            {errors.password && <p style={{ color: '#ef4444', fontSize: '14px' }}>{errors.password.message}</p>}
          </div>

          {loginError && <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>{loginError}</p>}

          <button
            type="submit"
            style={{
              backgroundColor: '#3b82f6', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              color: 'white', 
              fontWeight: 'bold', 
              border: 'none', 
              width: '100%', 
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: '16px' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
