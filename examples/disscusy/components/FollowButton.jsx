import useAuth from '@/hooks/useAuth'
import useNotification from '@/hooks/useNotifications'
import useProfile from '@/hooks/useProfile'
import { UserAddIcon, UserRemoveIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'

export default function FollowButton({ profile, rounded, followed }) {
  const { user } = useAuth()

  const [isFollowed, setIsFollowed] = useState(null)
  const { sendNotification } = useNotification()
  const { followProfile, unfollowProfile } = useProfile()

  const handleFollow = () => {
    followProfile(_user, profile)
    setIsFollowed(true)
    sendNotification({
      user: profile._id,
      sentUser: user?._id,
      type: 'follow',
      sentUsername: user.username,
      sentUserProfilePicture: user.profilePicture,
    })
  }
  const handleUnfollow = () => {
    unfollowProfile(_user, profile)
    setIsFollowed(false)
  }

  const [_user, set_user] = useState()

  useEffect(() => {
    set_user(user)
  }, [user])
  useEffect(() => {
    setIsFollowed(followed)
  }, [followed])

  return (
    <button
      type='button'
      className={
        'flex-1 flex items-center justify-center w-full sm:w-auto px-[45px] py-4 border border-transparent shadow-sm text-base font-medium text-slate-50 bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' +
        (rounded && ' rounded-md ')
      }
      onClick={!isFollowed ? handleFollow : handleUnfollow}
    >
      {isFollowed ? (
        <UserRemoveIcon className='mr-3 h-6 w-6' aria-hidden='true' />
      ) : (
        <UserAddIcon className='mr-3 h-6 w-6' aria-hidden='true' />
      )}

      {isFollowed ? 'Unfollow' : 'Follow'}
    </button>
  )
}
