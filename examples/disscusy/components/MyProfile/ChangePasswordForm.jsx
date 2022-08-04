import React, { useEffect } from 'react'
import useCredential from '@/hooks/useCredential'
import Input from '../Input'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import Button from '../Button'

const ChangePasswordForm = () => {
  const { changePassword, error, changePasswordLoading, changePasswordSuccess } = useCredential()
  const changePasswordSchema = new yup.ObjectSchema({
    oldPassword: yup
      .string()
      .required('Password is required')
      .min(6, 'Old Password must be at least 6 characters'),
    newPassword: yup.string().required('Username is required '),
    //   .min(6, 'New Password must be at least 6 characters'),
    newPasswordConfirm: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
  })
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  })

  const formSubmit = async (form) => {
    await changePassword(form.newPassword, form.oldPassword)
    reset()
  }

  useEffect(() => {
    if (error) {
      error?.forEach((err) => {
        if (err.message?.includes('current password')) {
          setError('oldPassword', { type: 'manuel', message: 'Current password is wrong!' })
        } else if (err.message?.includes('at least')) {
          setError('newPassword', {
            type: 'manuel',
            message: err.message,
          })
        }
      })
    }
  }, [error, setError])
  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <div className='space-y-8 divide-y divide-gray-200 p-6 '>
        <div>
          <div className='text-center sm:text-left'>
            <h3 className='text-2xl leading-7 font-medium text-slate-800 tracking-[-0.8px]'>
              Change Password
            </h3>
            <p className='mt-1 text-slate-500 tracking-[-0.4px]'>
              Use the form to change your password.
            </p>
          </div>
          <div className='mt-6 grid grid-cols-1 gap-y-5 gap-x-8 sm:grid-cols-6'>
            <div className='sm:col-span-2'>
              <div className='mt-1'>
                <Input
                  label='Old Password'
                  id='oldPassword'
                  name='oldPassword'
                  register={register('oldPassword')}
                  type='password'
                  error={errors.oldPassword}
                />
              </div>
            </div>

            <div className='sm:col-span-2'>
              <div className='mt-1'>
                <Input
                  label='New Password'
                  id='newPassword'
                  name='newPassword'
                  register={register('newPassword')}
                  type='password'
                  error={errors.newPassword}
                />
              </div>
            </div>

            <div className='sm:col-span-2'>
              <div className='mt-1'>
                <Input
                  label='Confirm New Password'
                  id='newPasswordConfirm'
                  name='newPasswordConfirm'
                  register={register('newPasswordConfirm')}
                  type='password'
                  error={errors.newPasswordConfirm}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='px-6 py-3 bg-slate-100'>
        <div className='flex flex-col-reverse sm:flex-row justify-end gap-6 sm:gap-8'>
          <Button
            type='submit'
            className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            label='Change Password'
            loading={changePasswordLoading}
          />
        </div>
        {changePasswordSuccess && <p className='text-green-600'>Password successfully changed</p>}
      </div>
    </form>
  )
}

export default ChangePasswordForm
