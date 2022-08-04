import React, { useState, useEffect } from 'react'
import useAuth from '@/hooks/useAuth'
import useCredential from '@/hooks/useCredential'
import Button from '../Button'
import Input from '../Input'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import ChangeEmailModal from './ChangeEmailModal'
import useFile from '@/hooks/useFile'
import { TIMEZONE_OPTIONS } from '@/constants/constant'
import ClipLoader from 'react-spinners/ClipLoader'
import debounce from 'lodash.debounce'
const UpdateProfileForm = () => {
  const { user, setUserFromLocalStorage, resetEmailChangeData } = useAuth()
  const { updateProfileLoading, error, updateProfile, checkUsername, isUsernameAvailable } =
    useCredential()
  const [changeEmailModal, setChangeEmailModal] = useState(false)

  const updateProfileSchema = new yup.ObjectSchema({
    about: yup.string(),
    firstName: yup.string(),
    lastName: yup.string(),
    username: yup.string().required('Username is required'),
    timezone: yup.string(),
    profilePicture: yup.string(),
    headerImage: yup.string(),
  })

  const {
    uploadProfilePicture,
    uploadHeaderImage,
    headerImageUrl,
    profilePictureUrl,
    ppLoading,
    headerLoading,
  } = useFile()

  useEffect(() => {
    setValue('firstName', user?.name)
    setValue('lastName', user?.surname)
    setValue('username', user?.username)
    setValue('about', user?.about)
    setValue('timezone', user?.timezone)
    setValue('headerImage', user?.headerImage)
    setValue('profilePicture', user?.profilePicture)
  }, [])

  useEffect(() => {
    if (error) {
      error?.item?.forEach((err) => {
        if (err.message?.includes('username')) {
          setError('username', { type: 'manuel', message: err.message })
        }
      })
    }
  }, [error, setError])

  useEffect(() => {
    if (profilePictureUrl) {
      setValue('profilePicture', profilePictureUrl)
    }
  }, [profilePictureUrl])

  useEffect(() => {
    if (headerImageUrl) {
      setValue('headerImage', headerImageUrl)
    }
  }, [headerImageUrl])

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(updateProfileSchema),
  })

  const handleUpdate = async (form) => {
    await updateProfile({
      _id: user?._id,
      username: form.username,
      name: form.firstName,
      surname: form.lastName,
      about: form.about,
      timezone: form.timezone,
      profilePicture: form.profilePicture,
      headerImage: form.headerImage,
    })
    setUserFromLocalStorage()
  }

  const handleProfilePictureChange = async (event) => {
    await uploadProfilePicture(event.target.files[0], `${user?._id}-profile`, user?.profilePicture)
    setValue('profilePicture', profilePictureUrl)
  }

  const handleHeaderImageChange = async (event) => {
    await uploadHeaderImage(event.target.files[0], `${user?._id}-header`, user?.headerImage)
    setValue('headerImage', headerImageUrl)
  }
  const checkUsernameExist = async (e) => {
    await checkUsername(e.target.value)
    usernameControl()
  }
  useEffect(() => {
    usernameControl()
  }, [isUsernameAvailable])

  const usernameControl = () => {
    if (!isUsernameAvailable) {
      setError('username', {
        type: 'manuel',
        message: `Username is already taken`,
      })
    } else {
      clearErrors('username')
    }
  }
  return (
    <form onSubmit={handleSubmit(handleUpdate)}>
      <div className='space-y-8 divide-y divide-gray-200 p-4 md:p-6'>
        <div>
          <div className='text-center sm:text-left'>
            <h3 className='text-2xl leading-7 font-medium text-slate-800 tracking-[-0.8px]'>
              Personal Information
            </h3>
            <p className='mt-1 text-slate-500 tracking-[-0.4px]'>
              Change your profile information.
            </p>
          </div>
          <div className='mt-6 grid grid-cols-1 gap-y-5 gap-x-8 sm:grid-cols-6'>
            <div className='sm:col-span-3'>
              <div className='mt-1'>
                <Input
                  label='First Name'
                  id='firstName'
                  name='firstName'
                  register={register('firstName')}
                  type='text'
                  error={errors.firstName}
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <div className='mt-1'>
                <Input
                  label='Last Name'
                  id='lastName'
                  name='lastName'
                  register={register('lastName')}
                  type='text'
                  error={errors.lastName}
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <div className='mt-1'>
                <Input
                  label='Username'
                  id='username'
                  name='username'
                  register={register('username')}
                  type='text'
                  error={errors.username}
                  onChange={debounce(checkUsernameExist, 700)}
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <div className='mt-1'>
                <label htmlFor='email' className='block text-base font-medium text-slate-700 pb-2'>
                  Email Address
                </label>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-4 '>
                  <span className='text-slate-800 text-lg font-medium tracking-[-0.4px]'>
                    {user?.email}
                  </span>
                  {user?.provider === 'altogic' && (
                    <React.Fragment>
                      <div>
                        <Button
                          className='inline-flex cursor-pointer sm:flex items-center justify-center w-full sm:w-auto py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium tracking-[-0.4px] rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          onClick={() => {
                            resetEmailChangeData()
                            setChangeEmailModal(true)
                          }}
                          label='Change Email Address'
                          type='button'
                        />
                      </div>
                      <ChangeEmailModal
                        changeEmailModal={changeEmailModal}
                        setChangeEmailModal={setChangeEmailModal}
                      />
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label htmlFor='about' className='block text-base font-medium text-slate-700'>
                About
              </label>
              <div className='mt-1'>
                <textarea
                  rows={5}
                  className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md'
                  id='about'
                  name='about'
                  {...register('about')}
                  error={errors.about}
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label htmlFor='timezone' className='block text-slate-700 tracking-[-0.4px]'>
                Time Zone
              </label>
              <div className='mt-1'>
                <select
                  id='timezone'
                  name='timezone'
                  autoComplete='timezone'
                  {...register('timezone')}
                  defaultValue={user?.timezone}
                  className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                >
                  {TIMEZONE_OPTIONS.map((timezone) => {
                    return (
                      <option key={timezone} value={timezone}>
                        {timezone}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>

            <div className='sm:col-span-6'>
              <label htmlFor='photo' className='block text-slate-700 tracking-[-0.4px]'>
                Photo
              </label>
              <div className='mt-1 flex items-center'>
                <span className='h-12 w-12 rounded-full overflow-hidden bg-gray-100'>
                  {profilePictureUrl ? (
                    <img src={profilePictureUrl} alt='Profile' />
                  ) : (
                    <svg
                      className='h-full w-full text-gray-300'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                    </svg>
                  )}
                </span>
                <Button
                  loading={ppLoading}
                  type='button'
                  label='Change'
                  className='inline-flex sm:flex items-center justify-center ml-5 relative bg-indigo-600 hover:bg-indigo-700  py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 tracking-[-0.4px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer'
                >
                  <input
                    id='file-upload-profile-picture'
                    name='file-upload'
                    type='file'
                    accept='image/png, image/jpeg'
                    className='appearance-none opacity-0 inset-0 absolute cursor-pointer'
                    onChange={handleProfilePictureChange}
                  />
                </Button>
              </div>
            </div>

            <div className='sm:col-span-6'>
              <label htmlFor='cover-photo' className='block text-slate-700 tracking-[-0.4px]'>
                Cover photo
              </label>
              <div className='mt-1 flex justify-center min-h-[10rem] px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative'>
                {headerLoading ? (
                  <ClipLoader
                    color='#4338CA'
                    loading={headerLoading}
                    size={50}
                    cssOverride={{
                      display: 'block',
                      margin: 'auto',
                      position: 'absolute',
                      top: '40%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ) : (
                  <div className='space-y-1 text-center'>
                    {headerImageUrl ? (
                      <img src={headerImageUrl} alt='Header' />
                    ) : (
                      <svg
                        className='mx-auto h-12 w-12 text-gray-400'
                        stroke='currentColor'
                        fill='none'
                        viewBox='0 0 48 48'
                        aria-hidden='true'
                      >
                        <path
                          d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    )}
                    <div className='flex text-sm items-center justify-center text-gray-600'>
                      <label
                        htmlFor='file-upload'
                        className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 tracking-[-0.4px] hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
                      >
                        <span>Upload a file</span>
                        <input
                          id='file-upload'
                          name='file-upload'
                          type='file'
                          className='sr-only'
                          onChange={handleHeaderImageChange}
                          accept='image/png, image/jpeg'
                        />
                      </label>
                      <p className='pl-1 text-slate-500 tracking-[-0.4px]'>or drag and drop</p>
                    </div>
                    <p className='text-xs text-slate-400 tracking-[-0.4px]'>
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-end px-6 py-3 bg-slate-100'>
        <Button
          type='submit'
          className='inline-flex sm:flex items-center justify-center w-full sm:w-auto py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium tracking-[-0.4px] rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          label='Update Profile'
          loading={updateProfileLoading}
        />
      </div>
    </form>
  )
}

export default UpdateProfileForm
