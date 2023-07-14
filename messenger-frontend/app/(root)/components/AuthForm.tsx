'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import fetcher from '@/app/home/utils/fetcher';
import { toast } from 'react-toastify';

type Variant = 'REGISTER' | 'LOGIN';

type FormFields = {
  name: string;
  email: string;
  password: string;
};

export default function AuthForm() {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const toggleVariant = () => {
    variant === 'LOGIN' ? setVariant('REGISTER') : setVariant('LOGIN');
  };

  // Form Handler

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: { name: '', password: '', email: '' },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setIsLoading(true);
    if (variant === 'REGISTER') {
      if (!data) {
        return null;
      }
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/auth/register`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }
        );
        if (res.status === 200) {
          setVariant('LOGIN');
          toast.success('Account created successfully');
        } else {
          toast.error('An error occurred');
        }
      } catch (error) {
        toast.error('An error occurred');
      }
      setIsLoading(false);
    }

    if (variant === 'LOGIN') {
      if (!data) {
        return null;
      }
      try {
        const res = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/auth/login`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }
        );
        const body = await res.json();
        if (res.status === 200) {
          sessionStorage.setItem('tokenjwt', body.token);
          toast.success('Login successful');
          router.push('/home');
          router.push('/home');
        } else {
          toast.error('An error occurred');
        }
      } catch (error) {
        toast.error('An error occurred');
      }
      setIsLoading(false);
    }
  };

  return (
    <form
      className='mt-10  mx-3 sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-y-4'
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Name for REGISTER ONLY */}
      {variant === 'REGISTER' && (
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium leading-6 text-gray-900'
          >
            Name
          </label>
          <div>
            <input
              id='name'
              type='text'
              minLength={6}
              required
              disabled={isLoading}
              {...register('name')}
              className='block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>
      )}

      {/* Email Address */}
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          Email address
        </label>
        <div>
          <input
            id='email'
            disabled={isLoading}
            {...register('email')}
            type='email'
            required
            className='block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
        </div>
      </div>
      {/* Password */}
      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          Password
        </label>
        <div className='mt-2'>
          <input
            id='password'
            disabled={isLoading}
            minLength={8}
            maxLength={12}
            {...register('password')}
            type='password'
            required
            className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
        </div>
      </div>
      {/* Submit Button */}
      <div>
        <button
          type='submit'
          disabled={isLoading}
          className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          {variant === 'LOGIN' ? 'Sign In' : 'Sign Up'}
        </button>
      </div>

      {/* Variant Toggle */}
      <div
        onClick={toggleVariant}
        className='underline cursor-pointer text-sm text-center underline-offset-4'
      >
        {variant === 'LOGIN'
          ? 'New to Messenger? Create an account'
          : 'Already have an account? Sign in'}
      </div>
    </form>
  );
}
