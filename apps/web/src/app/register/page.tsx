'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';

// Define form data
interface FormData {
  name: string;
  email: string;
  password: string;
  role: 'ATTENDEE' | 'ORGANIZER';
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  role: yup.string().oneOf(['ATTENDEE', 'ORGANIZER']).required('Role is required'),
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
      const response = await fetch('http://localhost:3001/api/register', { // Correct API endpoint URL
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #3b82f6, #9333ea)'
    }}>
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '384px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Register</h2>
        {registrationSuccess ? (
          <div style={{ color: '#10b981', fontSize: '14px', marginBottom: '16px' }}>
            Registration successful! You can now{' '}
            <Link href="/login" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
              log in
            </Link>
            .
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="name" style={{ display: 'block', color: '#4b5563', fontWeight: 'bold', marginBottom: '8px' }}>
                Name:
              </label>
              <input
                type="text"
                id="name"
                style={{
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db', 
                  fontSize: '16px', 
                  color: '#4b5563', 
                  marginBottom: '8px',
                  boxSizing: 'border-box'
                }}
                {...register('name')}
              />
              {errors.name && <p style={{ color: '#ef4444', fontSize: '14px' }}>{errors.name.message}</p>}
            </div>
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
                  fontSize: '16px', 
                  color: '#4b5563', 
                  marginBottom: '8px',
                  boxSizing: 'border-box'
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
                  fontSize: '16px', 
                  color: '#4b5563', 
                  marginBottom: '8px',
                  boxSizing: 'border-box'
                }}
                {...register('password')}
              />
              {errors.password && <p style={{ color: '#ef4444', fontSize: '14px' }}>{errors.password.message}</p>}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="role" style={{ display: 'block', color: '#4b5563', fontWeight: 'bold', marginBottom: '8px' }}>
                Role:
              </label>
              <select
                id="role"
                style={{
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db', 
                  fontSize: '16px', 
                  color: '#4b5563', 
                  marginBottom: '8px',
                  boxSizing: 'border-box'
                }}
                {...register('role')}
              >
                <option value="ATTENDEE">Attendee</option>
                <option value="ORGANIZER">Organizer</option>
              </select>
              {errors.role && <p style={{ color: '#ef4444', fontSize: '14px' }}>{errors.role.message}</p>}
            </div>

            {apiError && <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>{apiError}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  backgroundColor: '#3b82f6', 
                  padding: '12px 24px', 
                  borderRadius: '8px', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  border: 'none', 
                  cursor: 'pointer', 
                  width: '48%'
                }}
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
