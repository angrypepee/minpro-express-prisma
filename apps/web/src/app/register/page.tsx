'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import './RegisterPage.css'; // Import the new CSS file

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
    <div className="register-container">
      <div className="register-box">

        <h2 className="register-title">Registration </h2>
        {registrationSuccess ? (
          <div className="success-message">
            Registration successful ❤️! You can now{' '}
            <Link href="/login" className="success-link">
              log in
            </Link>
            .
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name:</label>
              <input
                type="text"
                id="name"
                className="form-input"
                {...register('name')}
              />
              {errors.name && <p className="error-text">{errors.name.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                id="email"
                className="form-input"
                {...register('email')}
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                id="password"
                className="form-input"
                {...register('password')}
              />
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="role" className="form-label">Role:</label>
              <select
                id="role"
                className="form-input"
                {...register('role')}
              >
                <option value="ATTENDEE">Attendee</option>
                <option value="ORGANIZER">Organizer</option>
              </select>
              {errors.role && <p className="error-text">{errors.role.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="referralCode" className="form-label">
                Referral Code (Optional):
              </label>
              <input
                type="text"
                id="referralCode"
                className="form-input"
                {...register('referralCode')}
              />
              {errors.referralCode && <p className="error-text">{errors.referralCode.message}</p>}
            </div>

            {apiError && <p className="error-text">{apiError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="submit-button"
            >
              {submitting ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
