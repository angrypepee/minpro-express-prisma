// apps/web/src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  password: string;
  role: 'ATTENDEE' | 'ORGANIZER';
  referralCode?: string; // Optional referral code field
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  role: yup.string().oneOf(['ATTENDEE', 'ORGANIZER']).required('Role is required'),
  referralCode: yup.string().optional(), // Referral code is optional
}).required();

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });
  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';


  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setApiError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/register`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('Registration successful!');
        setRegistrationSuccess(true);
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        setApiError(errorData.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setApiError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {registrationSuccess ? (
          <div className="text-green-500 text-sm mb-4">
            Registration successful! You can now{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              log in
            </Link>
            .
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register('name')}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                Email:
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register('email')}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register('password')}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block text-gray-700 font-bold mb-2">
                Role:
              </label>
              <select
                id="role"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register('role')}
              >
                <option value="ATTENDEE">Attendee</option>
                <option value="ORGANIZER">Organizer</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
            </div>

            <div className="mb-4"> 
              <label htmlFor="referralCode" className="block text-gray-700 font-bold mb-2">
                Referral Code (Optional):
              </label>
              <input
                type="text"
                id="referralCode"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register('referralCode')}
              />
              {errors.referralCode && <p className="text-red-500 text-sm">{errors.referralCode.message}</p>}
            </div>

            {apiError && <p className="text-red-500 text-sm mb-4">{apiError}</p>}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {submitting ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}