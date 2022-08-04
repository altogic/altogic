import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import useAuth from '@/hooks/useAuth'
import Input from '@/components/Input'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/Button'
import { useEffect } from 'react'
import { ADJECTIVES, STARWARS_NAMES } from '@/constants/constant'

export default function CreateAnAccount() {
  const registerSchema = new yup.ObjectSchema({
    email: yup.string().email().required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must be at most 50 characters')
      .required('Password is required'),
    username: yup
      .string()
      .required('Username is required ')
      .matches(/^[a-zA-Z0-9_]+$/, 'Only alphabets are allowed for this field ')
      .max(15, 'Username must be at most 15 characters'),
    // name: yup.string(),
    // surname: yup.string(),
  })
  async function formSubmit(form) {
    form.notification_preferences = ['follow', 'reply', 'comment', 'bookmark', 'vote', 'share']
    form.name = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
    form.surname = STARWARS_NAMES[Math.floor(Math.random() * STARWARS_NAMES.length)].split(' ')[0]
    await signUp(form)
  }
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(registerSchema),
  })
  const { signUp, signUpError, loading, createSuccess } = useAuth()

  useEffect(() => {
    if (signUpError && !createSuccess) {
      signUpError.forEach((err) => {
        if (err.message?.includes('username')) {
          setError('username', { type: 'manuel', message: 'This username already exists' })
        } else if (err.message?.includes('6')) {
          setError('password', {
            type: 'manuel',
            message: 'Password must be at least 6 characters',
          })
        } else if (err.message?.includes('50')) {
          setError('password', {
            type: 'manuel',
            message: 'Password must be at most 50 characters',
          })
        } else if (err.message?.includes('email')) {
          setError('email', {
            type: 'manuel',
            message: err.message,
          })
        } else setError('email', { type: 'manuel', message: err?.message })
      })
    }
  }, [signUpError, setError])

  return (
    <div>
      <div className='relative h-screen'>
        <div className='grid xl:grid-cols-2 h-full'>
          <div className='flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
            <div className='mx-auto w-full max-w-lg lg:w-[489px]'>
              <div>
                <img src='/logo.png' alt='Discussy' className='w-48 h-16 object-contain mb-2' />
                <p className='text-2xl text-slate-800 tracking-[-0.8px]'>Start using</p>
                <h2 className='text-4xl font-bold text-slate-800'>Discussy</h2>
                <p className='mt-4 text-2xl text-slate-600 tracking-[-0.8px]'>
                  Let’s create your account
                </p>
              </div>

              <div className='mt-8'>
                <div className='mt-6'>
                  {createSuccess ? (
                    <span className='inline-block text-m text-gray-400'>
                      Verification email has sent to your email address, please activate your
                      account.
                    </span>
                  ) : (
                    <form onSubmit={handleSubmit(formSubmit)} method='POST' className='space-y-6'>
                      <Input
                        label='Username'
                        id='username'
                        name='username'
                        register={register('username')}
                        placeholder='johndoe'
                        error={errors.username}
                      />

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
                          placeholder='************ '
                          type='password'
                          error={errors.password}
                        />
                      </div>

                      <div>
                        <Button
                          loading={loading}
                          type='Submit'
                          className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          label='Create Your Account'
                        />
                      </div>
                    </form>
                  )}

                  <div className='text-center'>
                    <p className='mt-8 mb-2 text-sm text-gray-600'>
                      Already have an account?{' '}
                      <Link href='/login'>
                        <a className='font-medium text-indigo-700 tracking-[-0.4px] hover:text-indigo-500'>
                          Login
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
