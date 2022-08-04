import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { Menu, Transition } from '@headlessui/react'
import DefaultAvatar from '../MyProfile/DefaultAvatar'
import { diffForumDate } from '@/utils/date'
import { PencilIcon, XIcon } from '@heroicons/react/solid'
import ClipLoader from 'react-spinners/ClipLoader'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ForumCard({
  forum,
  top,
  loading,
  onDelete,
  onEdit,
  operation,
  categories,
  isReplyTable,
}) {
  const router = useRouter()
  const pushRouter = (forum) => {
    if (forum?.reply_link == '' || forum?.reply_link == null)
      router.push(`/forum-detail?id=${forum._id}`)
    else router.push(forum?.reply_link)
  }

  function strip(html) {
    return html?.replace(/<\s*[^>]*>/gi, '')
  }
  const [spinner, setSpinner] = useState(false)
  return (
    <tr key={forum?._id} className={loading ? 'animate-pulse' : ''}>
      <td className='whitespace-normal md:whitespace-nowrap py-4 lg:py-7 px-4 text-sm w-1/2'>
        <div className='flex items-center'>
          <div>
            <button
              onClick={() => {
                pushRouter(forum)
              }}
              className={classNames(
                'text-lg text-left font-semibold text-slate-800 mb-2 tracking-[-0.4px] w-[18rem] md:w-[34rem] truncate',
                loading ? 'bg-gray-300 w-full h-6 rounded-md' : '',
              )}
            >
              {!loading && forum?.title}
            </button>
            {isReplyTable && (
              <p className='mb-3  w-[18rem] md:w-[34rem] truncate'>
                {strip(forum?.reply?.content)}{' '}
              </p>
            )}
            <div className='flex flex-wrap flex-col md:flex-row gap-2 md:gap-4'>
              <div className='flex items-center gap-2'>
                <div
                  className={classNames(
                    'h-6 w-6 flex-shrink-0',
                    loading ? 'bg-gray-300 rounded-full' : '',
                  )}
                >
                  {!loading &&
                    (forum?.userProfilePicture ? (
                      <img
                        className='inline-block h-6 w-6 ring-2 rounded-full ring-white'
                        src={
                          forum?.username === 'anonymous'
                            ? '/default-avatar.jpeg'
                            : forum?.userProfilePicture
                        }
                        alt='Profile'
                      />
                    ) : (
                      <DefaultAvatar name={forum?.username} className='h-6 w-6 text-xs' />
                    ))}
                </div>
                <div
                  className={classNames(
                    'text-xs text-slate-800 tracking-[-0.4px]',
                    loading ? 'bg-gray-300 w-10 h-3/4 rounded-md' : '',
                  )}
                >
                  {!loading && forum?.username}
                </div>
                <div
                  className={classNames(
                    'text-xs text-slate-500 tracking-[-0.4px]',
                    loading ? 'bg-gray-300 w-24 h-3/4 rounded-md' : '',
                  )}
                >
                  {!loading && diffForumDate(forum?.createdAt)}
                </div>
              </div>
              <div
                className={classNames(
                  'flex flex-wrap items-center gap-2 md:gap-4 text-gray-500 md:ml-0',
                  loading ? 'bg-gray-300 w-16 h-3/4 rounded-md' : '',
                )}
              >
                {!loading && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-default  ${
                      !loading ? 'bg-red-100 text-white' : null
                    } tracking-[-0.4px]`}
                    style={{ backgroundColor: `${forum?.categoryColor}` }}
                  >
                    {!loading && forum?.categoryName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </td>
      {!top && (
        <td className='hidden md:table-cell whitespace-nowrap p-3 text-sm text-gray-500 w-32'>
          <div className='flex items-center justify-center -space-x-1 overflow-hidden'>
            {forum?.recentUsers?.map((user, index) => (
              <div className='group relative' key={index}>
                <div className={loading ? 'bg-gray-300 h-6 w-6 rounded-full' : ''}>
                  {!loading &&
                    (user.profilePicture ? (
                      <img
                        className={classNames(
                          'inline-block h-6 w-6 rounded-full ring-2 ring-white',
                          loading ? 'bg-gray-300' : '',
                        )}
                        src={user.profilePicture}
                        alt='Profile'
                      />
                    ) : (
                      <DefaultAvatar name={user?.username} className='h-6 w-6 text-xs' />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </td>
      )}
      <td className='hidden md:table-cell whitespace-nowrap p-3 text-center text-xs font-medium tracking-[-0.4px] text-slate-800 w-32'>
        <div className={loading ? 'bg-gray-300 w-10 h-4 rounded-md m-auto' : ''}>
          {!loading && forum?.replyCount}
        </div>
      </td>
      <td className='hidden md:table-cell whitespace-nowrap p-3 text-center text-xs font-medium tracking-[-0.4px] text-slate-800 w-32'>
        <div className={loading ? 'bg-gray-300 w-10 h-4 rounded-md m-auto' : ''}>
          {!loading && forum?.viewCount}
        </div>
      </td>
      {!top && (
        <td className='hidden md:table-cell whitespace-nowrap p-3 text-center text-xs text-slate-600 w-32'>
          <div className={loading ? 'bg-gray-300 w-10 h-4 rounded-md m-auto' : ''}>
            {!loading && diffForumDate(forum?.lastActivityAt)}
          </div>
        </td>
      )}
      {operation && (
        <td className='hidden md:table-cell whitespace-nowrap p-3 text-center text-xs text-slate-600 w-32'>
          <div className='w-full h-full flex items-center justify-center'>
            <Menu as='div' className='block sm:inline-block w-full sm:w-auto text-left'>
              <div>
                <Menu.Button className='inline-flex items-center justify-center w-full'>
                  <PencilIcon className='cursor-pointer hover:text-indigo-700 h-5 w-5 mr-2'></PencilIcon>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <Menu.Items className='absolute origin-top-right right-[5%] mt-2 w-full sm:w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
                  <div className='p-4'>
                    {categories?.map((category) => {
                      return (
                        <Menu.Item
                          key={category._id}
                          onClick={() => {
                            onEdit(forum.reply ? forum.reply._id : forum._id, category._id)
                          }}
                        >
                          {({ active }) => (
                            <span
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm cursor-pointer',
                              )}
                            >
                              {category.name}
                            </span>
                          )}
                        </Menu.Item>
                      )
                    })}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            {spinner ? (
              <ClipLoader size={17} color='#4338CA' loading={spinner} />
            ) : (
              <XIcon
                className='cursor-pointer hover:text-indigo-700 h-5 w-5'
                onClick={async () => {
                  setSpinner(true)
                  await onDelete(forum.reply ? forum.reply._id : forum._id)
                  setSpinner(false)
                }}
              ></XIcon>
            )}
          </div>
        </td>
      )}
    </tr>
  )
}
