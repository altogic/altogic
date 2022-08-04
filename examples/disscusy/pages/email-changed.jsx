/* eslint-disable react/no-unescaped-entities */

import useAuth from '@/hooks/useAuth'
import Image from 'next/image'


import { useEffect } from 'react'

export default function ChangedEmail() {


  const { setUserFromLocalStorage, getUserFromDb, user } = useAuth()
  useEffect(() => {
    getUserFromDb()
  }, [])

  useEffect(() => {
    setUserFromLocalStorage()
  }, [user])



  return (
    <div>
      <div className='relative h-screen'>
        <div className='grid xl:grid-cols-2 h-full'>
          <div className='flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
            <div className='mx-auto w-full max-w-lg lg:w-[489px]'>
              <div>
                <Image src='/logo.svg' alt='Altogic' width={192} height={66} />
                <h2 className='text-4xl font-bold text-slate-800'>Welcome Back!</h2>
                <p className='mt-4 text-2xl text-slate-600 tracking-[-0.8px]'>Confirmation Page</p>
              </div>

              <div className='mt-8'>
                <div className='mt-6'>
                  <p className='text-gray-400'>Your email has been changed successfully</p>
                  <p className=' mt-8 mb-2 text-sm text-gray-600'>
                      <button onClick={() => window.location.href = "/" } className='font-medium text-indigo-700 tracking-[-0.4px] hover:text-indigo-500'>
                        Back to Forum
                      </button>
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
