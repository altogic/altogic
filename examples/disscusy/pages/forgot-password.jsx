import Button from '@/components/Button'
import Input from '@/components/Input'
import PoweredByAltogic from '@/components/PoweredByAltogic'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useAuth from '@/hooks/useAuth'
import * as yup from 'yup'
import Link from 'next/link'

export default function Login() {
  const registerSchema = new yup.ObjectSchema({
    email: yup.string().email().required('Email is required'),
  })
  async function formSubmit(form) {
    await forgotPassword(form)
    setHasSent(true)
  }
  const [hasSent, setHasSent] = useState(false)

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(registerSchema),
  })
  const { forgotPassword, error, loading } = useAuth()

  useEffect(() => {
    if (error && hasSent) {
      error.forEach((err) => {
        if (err.message != 'A user with the provided email already exists.')
          setError('email', { type: 'manuel', message: err.message })
      })
    }
  }, [error, setError, hasSent])

  return (
    <div>
      <div className='relative h-screen'>
        <PoweredByAltogic />

        <div className='grid xl:grid-cols-2 h-full'>
          <div className='flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
            <div className='mx-auto w-full max-w-lg lg:w-[489px]'>
              <div>
                <Image
                  width={192}
                  height={66}
                  className='mb-20 md:mb-44'
                  src='/logo.svg'
                  alt='Altogic'
                />
                <h2 className='text-4xl font-bold text-slate-800'>Forgot password?</h2>
                <p className='mt-4 text-base tracking-[-0.4px] text-slate-600'>
                  Enter your email below, you will receive an email with instructions on how to
                  reset your password in a few minutes.
                </p>
              </div>

              <div className='mt-8'>
                <div className='mt-6'>
                  {!hasSent || error ? (
                    <form onSubmit={handleSubmit(formSubmit)} method='POST' className='space-y-6'>
                      <Input
                        label='Email'
                        id='email'
                        name='email'
                        register={register('email')}
                        error={errors.email}
                        placeholder='johndoe@example.com'
                      />

                      <div>
                        <Button
                          loading={loading}
                          type='submit'
                          className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          label='Send'
                        />
                      </div>
                    </form>
                  ) : (
                    <span className='inline-block text-m text-gray-400'>
                      Password reset email has sent to your email address.
                    </span>
                  )}
                  <p className='text-center mt-10 md:mt-20 text-sm text-gray-600'>
                    Back to{' '}
                    <Link
                      href='/login'
                      className='font-medium text-indigo-700 tracking-[-0.4px] hover:text-indigo-500'
                    >
                      <a className='font-medium text-indigo-700 tracking-[-0.4px] hover:text-indigo-500'>
                        Login{' '}
                      </a>
                    </Link>
                    or{' '}
                    <Link href='/create-an-account'>
                      <a className='font-medium text-indigo-700 tracking-[-0.4px] hover:text-indigo-500'>
                        Create an account.
                      </a>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='hidden xl:block relative'>
            <Image
              className='absolute inset-0 h-full w-full object-cover'
              src='/login.avif'
              alt=''
              layout='fill'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
