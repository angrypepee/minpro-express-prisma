'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

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
  const router = useRouter(); // Initialize the router

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        // Redirect user to profile after successful login
        if (responseData.redirectUrl) {
          router.push(responseData.redirectUrl);
        } else {
          router.push('/profile');
        }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('password')}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account? 
            <Link href="/register" className="text-blue-600 hover:underline"> Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
