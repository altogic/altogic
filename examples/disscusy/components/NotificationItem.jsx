import Image from 'next/image'
import DefaultAvatar from './MyProfile/DefaultAvatar'
import Router from 'next/router'
function NotificationItem({ item, setIsNotificationModal }) {
  function setNotificationMessage(type) {
    switch (type) {
      case 'vote':
        return 'Voted your forum'
      case 'comment':
        return 'Commented on your reply in'
      case 'reply':
        return 'Replied to your forum'
      case 'follow':
        return 'Followed you'
      case 'bookmark':
        return 'Bookmarked your forum'
      case 'share':
        return 'Shared your forum'
      default:
        return 'Notification'
    }
  }
  function setAvatar() {
    if (item?.sentUserProfilePicture) {
      return (
        <button onClick={() => Router.push('user?userId=' + item?.sentUser)}>
          <Image
            className='h-10 w-10 rounded-full'
            src={item?.sentUserProfilePicture}
            alt=''
            width={40}
            height={40}
          />
        </button>
      )
    } else {
      return (
        <button onClick={() => Router.push('user?userId=' + item?.sentUser)}>
          <DefaultAvatar name={item?.sentUsername} className='h-10 w-10' />
        </button>
      )
    }
  }

  const handleRoute = () => {
    if (item?.reply_link == '' || item?.reply_link == null) {
      Router.push(`/forum-detail?id=${item.targetId}`)
    } else {
      Router.push(item?.reply_link)
    }

    if (setIsNotificationModal) {
      setIsNotificationModal(false)
    }
  }
  return (
    <div className='p-4 bg-white rounded-lg'>
      <div className='flex items-start justify-center'>
        <div className='flex-shrink-0'>{setAvatar()}</div>
        <div className='ml-3 w-0 flex-1'>
          <button
            onClick={() => {
              Router.push('user?userId=' + item?.sentUser)
              if (setIsNotificationModal) {
                setIsNotificationModal(false)
              }
            }}
          >
            {item.sentUsername}
          </button>{' '}
          <div className='text-sm leading-5 tracking-[-0.4px] text-slate-600 mt-2'>
            {setNotificationMessage(item.type)}{' '}
            {item.targetTitle && (
              <button className='font-bold text-left text-blue-700' onClick={handleRoute}>
                {item.targetTitle}
              </button>
            )}
          </div>
        </div>
        <div className='ml-4 flex-shrink-0 flex'>
          <button
            type='button'
            className='bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            <span className='sr-only'>Close</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
