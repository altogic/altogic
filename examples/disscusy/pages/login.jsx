/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import useAuth from '@/hooks/useAuth'
import Input from '@/components/Input'
import Link from 'next/link'
import Button from '@/components/Button'
import Provider from '@/components/Provider'
export default function Login() {
  const loginSchema = new yup.ObjectSchema({
    email: yup.string().email().required('Email is required'),
    password: yup.string().required('Password is required'),
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(loginSchema),
  })
  const { login, error, loading } = useAuth()
  async function formSubmit(data) {
    await login(data)

    setHasSent(true)
  }

  const [hasSent, setHasSent] = useState(false)

  useEffect(() => {
    if (error && hasSent) {
      error.forEach((err) => {
        setError('password', { type: 'manuel', message: err.message })
        setError('email', { type: 'manuel', message: null })
      })
    }
  }, [error, setError, hasSent])

  return (
    <div>
      <div className='relative h-screen'>
        <div className='grid xl:grid-cols-2 h-full'>
          <div className='flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
            <div className='mx-auto w-full max-w-lg lg:w-[489px]'>
              <div>
                <img src='/logo.png' alt='Disscusy' className='w-48 h-16 object-contain mb-2' />
                <h2 className='text-4xl font-bold text-slate-800'>Welcome Back!</h2>
                <p className='mt-4 text-2xl text-slate-600 tracking-[-0.8px]'>
                  Sign-in your account
                </p>
              </div>

              <div className='mt-8'>
                <Provider />

                <div className='mt-6'>
                  <form action='#' onSubmit={handleSubmit(formSubmit)} className='space-y-6'>
                    <Input
                      label='Email'
                      id='email'
                      name='email'
                      register={register('email')}
                      error={errors.email}
                      placeholder='johndoe@example.com'
                    />
                    <div className='space-y-1'>
                      <Input
                        label='Password'
                        id='password'
                        name='password'
                        register={register('password')}
                        type='password'
                        error={errors.password}
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <input
                          id='remember-me'
                          name='remember-me'
                          type='checkbox'
                          className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                        />
                        <label
                          htmlFor='remember-me'
                          className='ml-2 block text-sm text-slate-700 tracking-[-0.4px]'
                        >
                          Remember me
                        </label>
                      </div>
                      <div className='text-sm'>
                        <Link href='/forgot-password'>
                          <a className='font-medium text-indigo-700 tracking-[-0.4px] hover:text-indigo-500'>
                            Forgot your password?
                          </a>
                        </Link>
                      </div>
                    </div>

                    <div>
                      <Button
                        type='Submit'
                        className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        label='Sign In'
                        loading={loading}
                      />
                    </div>
                  </form>
                  <div className='text-center'>
                    <p className=' mt-8 mb-2 text-sm text-gray-600'>
                      Don't have an account yet?{' '}
                      <Link href='/create-an-account'>
                        <a className='font-medium text-indigo-700 tracking-[-0.4px] hover:text-indigo-500'>
                          Create an account
                        </a>
                      </Link>
                    </p>
                    <Link href='/'>
                      <a className='justify-center text-sm font-medium text-indigo-700 tracking-[-0.4px] hover:text-indigo-500'>
                        Go to forum without login
                      </a>
                    </Link>
                  </div>
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
