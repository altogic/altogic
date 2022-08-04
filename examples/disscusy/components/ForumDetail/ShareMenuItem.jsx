import Icons from '@/constants/Icons'
import useAuth from '@/hooks/useAuth'
import useForum from '@/hooks/useForum'
import useNotification from '@/hooks/useNotifications'
import useReply from '@/hooks/useReply'
import { Menu } from '@headlessui/react'

export default function ShareMenuItem({
  Icon,
  Text,
  Color,
  Href,
  isForum,
  Id,
  Card,
  onClick,
  isAuthenticated,
}) {
  const { increaseForumShareCounter } = useForum()
  const { increaseReplyShareCounter } = useReply()
  const { user } = useAuth()

  const { sendNotification } = useNotification()
  const handleClick = () => {

    if (Card?.user?._id !== user?._id && isAuthenticated) {
      increaseShareCount()
      sendNotification({
        user: Card.user?._id,
        sentUser: user?._id,
        type: 'share',
        targetId: Card._id,
        sentUsername: user.username,
        sentUserProfilePicture: user.profilePicture,
        targetTitle: isForum ? Card.title : `${Card.forum.title}`,
      })
    }
  }

  const increaseShareCount = () => {
    if (isForum) {
      increaseForumShareCounter(Id)
    } else {
      increaseReplyShareCounter(Id)
    }
  }
  return (
    <Menu.Item onClick={onClick}>
      <a
        href={Href}
        onClick={onClick ?? handleClick}
        className='cursor-pointer flex items-center gap-3 bg-white text-slate-600 py-3 px-6 text-base leading-6 tracking-[-0.4px] hover:bg-slate-50'
      >
        <svg
          className='w-5 h-5 text-slate-400'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            {...(Color && { fill: Color })}
            {...(Icons[Icon].fillRule && { fillRule: Icons[Icon].fillRule })}
            {...(Icons[Icon].clipRule && { clipRule: Icons[Icon].clipRule })}
            {...(Icons[Icon].stroke && { stroke: Icons[Icon].stroke })}
            {...(Icons[Icon].strokeWidth && { strokeWidth: Icons[Icon].strokeWidth })}
            {...(Icons[Icon].strokeLinecap && { strokeLinecap: Icons[Icon].strokeLinecap })}
            {...(Icons[Icon].strokeLinejoin && { strokeLinejoin: Icons[Icon].strokeLinejoin })}
            {...(Icons[Icon].d && { d: Icons[Icon].d })}
          />
        </svg>
        {Text}
      </a>
    </Menu.Item>
  )
}
