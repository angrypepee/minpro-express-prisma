'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Define form data
interface FormData {
  name: string;
  email: string;
  password: string;
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });
  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setApiError(null);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('Registration successful!');
        setRegistrationSuccess(true);
        // TODO: Redirect to login page or home page after a short delay
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" {...register('name')} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" {...register('password')} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

      {registrationSuccess && (
        <p className="text-green-500 text-sm">Registration successful!</p>
      )}

      <button type="submit" disabled={submitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {submitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}