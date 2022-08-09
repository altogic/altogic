import React from 'react'
import SocialLoginButton from '@/components/SocialLoginButton'
import useAuth from '@/hooks/useAuth'

const Provider = () => {
  const { authenticateWithProvider } = useAuth()
  return (
    <div>
      <div>
        <p className='text-sm font-medium text-slate-700 tracking-[-0.4px]'>Sign in with</p>

        <div className='mt-1 grid grid-cols-3 gap-3'>
          <SocialLoginButton
            Icon='Facebook'
            onClick={() => {
              authenticateWithProvider('facebook')
            }}
          ></SocialLoginButton>

          <SocialLoginButton
            Icon='Google'
            onClick={() => {
              authenticateWithProvider('google')
            }}
          ></SocialLoginButton>

          <SocialLoginButton
            Icon='GitHub'
            onClick={() => {
              authenticateWithProvider('github')
            }}
          ></SocialLoginButton>
        </div>
      </div>

      <div className='mt-6 relative'>
        <div className='absolute inset-0 flex items-center' aria-hidden='true'>
          <div className='w-full border-t border-gray-300' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-2 bg-gray-100 text-slate-500'>Or continue with</span>
        </div>
      </div>
    </div>
  )
}

export default Provider
