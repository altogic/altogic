import React, { Fragment, useState, useEffect, forwardRef } from 'react'
import { mainMenus, resources } from '@/constants/constant'
import Image from 'next/image'
import AutoComplete from '@/components/AutoComplete'
import { useRouter } from 'next/router'
import { Menu, Popover, Transition } from '@headlessui/react'
import {
  MenuIcon,
  XIcon,
  BellIcon,
  UsersIcon,
  AdjustmentsIcon,
  LogoutIcon,
  SearchIcon,
  PlusIcon,
} from '@heroicons/react/outline'
import Link from 'next/link'
import useForum from '@/hooks/useForum'
import Button from '@/components/Button'
import useNotification from '@/hooks/useNotifications'
import Notifications from '@/components/Notifications'
import useAuth from '@/hooks/useAuth'
import MobileNotification from '@/components/MobileNotification'
import DefaultAvatar from '@/components/MyProfile/DefaultAvatar'
import { notificationQueryBuilder } from '@/utils/utils'
export default function Header() {
  const router = useRouter()

  const { searchForum, searchedForums, searchLoading } = useForum()

  const { notifications, markAsRead, getNotification } = useNotification()
  const { user, isAuthenticated, logout } = useAuth()
  const [isNotificationModal, setIsNotificationModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const handleOnSearch = async (searchText) => {
    if (searchText) {
      await searchForum(searchText)
    }
  }
  const formatResult = (item) => {
    return (
      <div className='result-wrapper'>
        <div className='flex items-center text-slate-500 text-sm font-medium tracking-[-0.4px] hover:text-slate-700 cursor-pointer'>
          <div className='flex items-center justify-center w-7 h-7 bg-slate-100 rounded-full mr-4'>
            <SearchIcon className='w-4 h-4 text-slate-400' />
          </div>
          {item.title}
        </div>
      </div>
    )
  }
  const handleLogout = async () => {
    await logout()
    setIsLoggedIn(false)
  }
  useEffect(() => {
    if (isAuthenticated) {
      let interval = setInterval(() => {
        const query = notificationQueryBuilder(user?.notification_preferences)
        getNotification(user?._id, query)
      }, 5000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [isAuthenticated])

  useEffect(() => setIsLoggedIn(isAuthenticated), [isAuthenticated])
  const MyLink = forwardRef(function MyLink(props, ref) {
    let { href, children, ...rest } = props
    return (
      <Link href={href}>
        <a className='-m-3 p-3 flex items-center rounded-md hover:bg-gray-50' ref={ref} {...rest}>
          {children}
        </a>
      </Link>
    )
  })
  return (
    <Popover className='relative bg-white shadow px-4'>
      <div className='max-w-screen-xl mx-auto'>
        <div className='flex items-center justify-between gap-6 py-2.5 md:py-6'>
          <div className='flex justify-start'>
            <Link href='/'>
              <div className='cursor-pointer'>
                <span className='sr-only'>Disscusy</span>
                <img src='/logo.png' alt='Disscusy Logo' className=' w-36 h-14 object-contain' />
              </div>
            </Link>
          </div>
          <div className='flex items-center justify-end md:flex-1 space-x-5 md:space-x-6'>
            <div className='search-bar w-full hidden md:block'>
              <AutoComplete
                suggestions={searchedForums}
                formatResult={formatResult}
                placeholder='Search'
                onSearch={handleOnSearch}
                loading={searchLoading}
              />
            </div>
            {/* Mobile Notification */}
            {isLoggedIn && (
              <Button
                type='button'
                onClick={() => setIsNotificationModal(true)}
                className='block sm:hidden relative rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'
              >
                <BellIcon className='w-6 h-6 text-gray-400' aria-hidden='true' />
                {notifications.filter((n) => n.isSeen === false).length > 0 && (
                  <span className='inline-flex items-center justify-center absolute top-0 -right-0.5 w-3.5 h-3.5 bg-red-700 text-white text-[8px] border border-white rounded-full tracking-[-0.2px]'>
                    {notifications.filter((n) => !n.isSeen).length}
                  </span>
                )}
              </Button>
            )}
            {isNotificationModal && (
              <MobileNotification
                isOpen={isNotificationModal}
                onClose={() => setIsNotificationModal(false)}
                notifications={notifications}
                markAsRead={markAsRead}
                setIsNotificationModal={setIsNotificationModal}
              />
            )}
            {/* Desktop Notification */}
            {isLoggedIn ? (
              <Fragment>
                <Notifications notifications={notifications} markAsRead={markAsRead} />
                <Menu as='div' className='relative hidden md:inline-block text-left'>
                  <div>
                    <Menu.Button className='inline-flex justify-center w-[42px] h-[42px] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
                      {user?.profilePicture ? (
                        <Image
                          className='inline-block w-[42px] h-[42px] rounded-full object-cover'
                          src={user?.profilePicture}
                          alt=''
                          height={42}
                          width={42}
                        />
                      ) : (
                        <DefaultAvatar name={user?.username} className='w-[42px] h-[42px]' />
                      )}
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
                    <Menu.Items className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white overflow-hidden ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50'>
                      <div className='px-6 py-3 text-left'>
                        <p className='text-xs text-slate-400 tracking-[-0.4px]'>Signed in as</p>
                        <p className='text-sm font-medium text-slate-800 tracking-[-0.4px]'>
                          {user?.name} {user?.surname}
                        </p>
                      </div>
                      <div className='divide-y divide-gray-100'>
                        <Menu.Item>
                          <Button
                            onClick={() => router.push('/my-profile')}
                            className='flex w-full items-center justify-start ml-3 text-slate-600 py-3 text-base hover:bg-gray-50'
                          >
                            <UsersIcon className='mr-3 w-5 h-5 text-slate-400' />
                            Profile
                          </Button>
                        </Menu.Item>
                        <Menu.Item>
                          <Button
                            onClick={() => router.push('/my-profile?tab=settings')}
                            className='flex w-full items-center justify-start ml-3 text-slate-600 py-3 text-base hover:bg-gray-50'
                          >
                            <AdjustmentsIcon className='mr-3 w-5 h-5 text-slate-400' />
                            Settings
                          </Button>
                        </Menu.Item>
                        <Menu.Item>
                          <Button
                            onClick={handleLogout}
                            className='flex items-center justify-start ml-3 w-full text-slate-600 py-3 text-base hover:bg-gray-50'
                          >
                            <LogoutIcon className='mr-3 w-5 h-5 text-slate-400' />
                            Logout
                          </Button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <div className='md:hidden flex items-center justify-end'>
                  <Popover.Button className='bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                    <span className='sr-only'>Open menu</span>
                    <MenuIcon className='h-6 w-6' aria-hidden='true' />
                  </Popover.Button>
                </div>
                <Button
                  label='Create Forum'
                  className='hidden md:inline-flex items-center justify-center py-[13px] px-6 whitespace-nowrap text-base font-medium tracking-[-0.4px] rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  onClick={() => router.push('/new-forum')}
                >
                  <PlusIcon className='w-5 h-5 mr-3' />
                </Button>
              </Fragment>
            ) : (
              <div className='flex items-center justify-around'>
                <Button
                  label='Login'
                  className='inline-flex items-center justify-center py-1 px-1 md:py-[10px] md:px-6  whitespace-nowrap text-base font-medium tracking-[-0.4px] rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2'
                  onClick={() => router.push('/login')}
                ></Button>
                <Button
                  label='Register'
                  className='inline-flex items-center justify-center py-1 px-1 md:py-[10px] md:px-6 whitespace-nowrap text-base font-medium tracking-[-0.4px] rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  onClick={() => router.push('/create-an-account')}
                ></Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter='duration-200 ease-out'
        enterFrom='opacity-0 scale-95'
        enterTo='opacity-100 scale-100'
        leave='duration-100 ease-in'
        leaveFrom='opacity-100 scale-100'
        leaveTo='opacity-0 scale-95'
      >
        <Popover.Panel
          focus
          className='absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50'
        >
          <div className='rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50'>
            <div className='pt-5 pb-6 px-5'>
              <div className='flex items-center justify-between'>
                <img src='/logo.png' alt='Disscusy Logo' className=' w-36 h-14 object-contain' />
                <div className='-mr-2'>
                  <Popover.Button className='bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                    <span className='sr-only'>Close menu</span>
                    <XIcon className='h-6 w-6' aria-hidden='true' />
                  </Popover.Button>
                </div>
              </div>
            </div>
            <div className='search-bar flex flex-col gap-6 px-5 pb-6'>
              <AutoComplete
                suggestions={searchedForums}
                formatResult={formatResult}
                placeholder='Search'
                onSearch={handleOnSearch}
              />
            </div>
            <div className='flex flex-col gap-6 px-5 pb-6'>
              <div>
                <p className='text-xs text-slate-400 tracking-[-0.4px]'>Signed in as</p>
                <p className='text-sm font-medium text-slate-800 tracking-[-0.4px]'>
                  {user?.name} {user?.surname}
                </p>
              </div>
              <nav className='grid gap-y-8'>
                {mainMenus.map((item) => (
                  <Popover.Button
                    as={MyLink}
                    href={item.href}
                    key={item.name}
                    className='-m-3 p-3 flex items-center rounded-md hover:bg-gray-50'
                    onClick={() => item.name === 'Logout' && handleLogout()}
                  >
                    <item.icon
                      className='flex-shrink-0 h-6 w-6 text-slate-400'
                      aria-hidden='true'
                    />
                    <span className='ml-3 text-base text-slate-600'>{item.name}</span>
                  </Popover.Button>
                ))}
              </nav>
              <Popover.Button
                className='flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent text-base font-medium tracking-[-0.4px] rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                onClick={() => router.push('/new-forum')}
              >
                Create Forum
              </Popover.Button>
            </div>

            <div className='py-6 px-5 border-t border-gray-50'>
              <span className='inline-block mb-4 text-slate-800 font-medium tracking-[-0.4px]'>
                Your Profile
              </span>
              <div className='grid grid-cols-2 gap-y-6 gap-x-[30px]'>
                {resources.map((item) => (
                  <Popover.Button
                    as={MyLink}
                    key={item.name}
                    href={item.href}
                    className='-m-3 p-3 flex items-center rounded-md hover:bg-gray-50'
                  >
                    <item.icon
                      className='flex-shrink-0 h-6 w-6 text-slate-400'
                      aria-hidden='true'
                    />
                    <span className='ml-3 text-base text-slate-700 tracking-[-0.4px]'>
                      {item.name}
                    </span>
                  </Popover.Button>
                ))}
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
