import React, { Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Input from '../Input'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import useAuth from '@/hooks/useAuth'
import Button from '../Button'

const ChangeEmailModal = ({ changeEmailModal, setChangeEmailModal }) => {
  const changeEmailSchema = new yup.ObjectSchema({
    email: yup.string().email().required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must be at most 50 characters')
      .required('Password is required'),
  })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(changeEmailSchema),
  })

  const handleForm = async (form) => {
    await changeEmail(form.password, form.email)
    if (emailChanged) {
      setChangeEmailModal(false)
    }
  }

  const { error, changeEmail, loading, emailChanged } = useAuth()

  useEffect(() => {
    if (error) {
      error?.forEach((err) => {
        if (err.message?.includes('email')) {
          setError('email', { type: 'manuel', message: err.message })
        } else if (err.message?.includes('password')) {
          setError('password', {
            type: 'manuel',
            message: err.message,
          })
        }
      })
    }
  }, [error, setError])

  useEffect(() => {
    reset()
  }, [changeEmailModal])

  return (
    <Transition appear show={changeEmailModal} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={() => setChangeEmailModal(false)}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                {!emailChanged && (
                  <form onSubmit={handleSubmit(handleForm)}>
                    <div className='text-center'>
                      <Dialog.Title
                        as='h3'
                        className='text-lg font-medium leading-6 text-slate-900'
                      >
                        Change Email Address
                      </Dialog.Title>
                      <div className='mt-2'>
                        <p className='text-sm text-gray-500'>Change your email address.</p>
                      </div>
                    </div>

                    <div className='mt-7 mb-12'>
                      <div>
                        <div className='mt-1'>
                          <Input
                            label=' Enter New Email Address'
                            id='email'
                            name='email'
                            register={register('email')}
                            error={errors.email}
                            placeholder='johndoe@example.com'
                          />
                        </div>
                      </div>
                      <div>
                        <div className='mt-1'>
                          <Input
                            label='Type Your Password'
                            id='password'
                            name='password'
                            register={register('password')}
                            error={errors.password}
                            type='password'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      <button
                        type='button'
                        className='inline-flex items-center justify-center px-4 py-2 whitespace-nowrap border border-gray-300 shadow-sm text-sm font-medium tracking-[-0.4px] rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        onClick={() => {
                          setChangeEmailModal(false)
                        }}
                      >
                        Cancel
                      </button>
                      <Button
                        loading={loading}
                        type='Submit'
                        className='flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium tracking-[-0.4px] rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        label='Change'
                      />
                    </div>
                  </form>
                )}
                {emailChanged && (
                  <div className='flex items-center justify-center'>
                    <p className=' text-center text-md mt-3 text-gray-400'>
                      Confirmation e-mail has sent to {getValues('email')}{' '}
                      <Button
                        onClick={() => {
                          setChangeEmailModal(false)
                        }}
                        loading={loading}
                        className='flex items-center justify-center w-full mt-5 px-4 py-2 border border-transparent text-sm font-medium tracking-[-0.4px] rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        label='OK'
                      />
                    </p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ChangeEmailModal
