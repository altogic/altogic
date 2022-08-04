import React, { useState } from 'react'
import ChangePasswordForm from './ChangePasswordForm'
import UpdateProfileForm from './UpdateProfileForm'
import DeleteUserModal from './DeleteUserModal'
import useAuth from '@/hooks/useAuth'
const Settings = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { user } = useAuth()
  return (
    <>
      <div className='bg-slate-50 rounded-tl-[10px] rounded-tr-[10px] sm:rounded-[10px] overflow-hidden'>
        <UpdateProfileForm />
      </div>
      {user?.provider === 'altogic' && (
        <div className='bg-slate-50 mt-8 sm:rounded-[10px] overflow-hidden'>
          <ChangePasswordForm />
        </div>
      )}
      <div className='bg-slate-50  mt-8 rounded-bl-[10px] rounded-br-[10px] sm:rounded-[10px] overflow-hidden'>
        <div className='flex flex-col sm:flex-row  items-center justify-between p-6 gap-6'>
          <div className='text-center sm:text-left'>
            <h3 className='text-2xl leading-7 font-medium text-slate-800 tracking-[-0.8px]'>
              Delete Profile
            </h3>
            <p className='mt-1 text-slate-500 tracking-[-0.4px]'>
              You can delete all your user profile data.
            </p>
          </div>

          <button
            type='button'
            onClick={() => setShowDeleteModal(true)}
            className='flex items-center justify-center w-full sm:w-auto px-4 py-2.5 border border-transparent text-base font-medium tracking-[-0.4px] rounded-md shadow-sm text-white bg-red-700 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
          >
            Delete Profile
          </button>
          <DeleteUserModal
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
          />
        </div>
      </div>
    </>
  )
}

export default Settings
