import React, { useEffect, useState } from 'react'
import ProfileTabs from '@/components/MyProfile/ProfileTabs'
import DefaultAvatar from '@/components/MyProfile/DefaultAvatar'
import useAuth from '@/hooks/useAuth'

const MyProfile = () => {
  const [_user, set_user] = useState()
  const { user } = useAuth({
    redirectTo: '/login',
  })

  useEffect(() => {
    set_user(user)
  }, [user])
  return (
    <div className='sm:p-4'>
      <div className='max-w-screen-xl mx-auto'>
        <div className='bg-white rounded-[10px]'>
          <img
            className='w-full h-36 md:h-44 object-cover rounded-bl-[10px] rounded-br-[10px] sm:rounded-[10px]'
            src={
              _user?.headerImage
                ? _user.headerImage
                : 'https://images.unsplash.com/photo-1567360425618-1594206637d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80'
            }
            alt=''
          />

          {_user?.profilePicture ? (
            <img
              className='relative w-[120px] h-[120px] md:w-36 md:h-36 -mt-[60px] md:-mt-[73px] mx-auto lg:ml-16 object-cover border-4 border-white rounded-full z-10'
              src={_user?.profilePicture}
              alt=''
            />
          ) : (
            <DefaultAvatar
              name={_user?.username}
              className='text-5xl relative w-[120px] h-[120px] md:w-36 md:h-36 -mt-[60px] md:-mt-[73px] mx-auto lg:ml-16 object-cover border-4 border-white rounded-full z-10'
            />
          )}

          <div className='p-4 lg:pb-20 lg:px-16'>
            <ProfileTabs />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
