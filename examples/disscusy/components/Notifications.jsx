import React, { useState, Fragment, useEffect } from 'react'
import { Menu, Transition, Dialog } from '@headlessui/react'
import NotificationItem from '@/components/NotificationItem'
import { BellIcon, CogIcon } from '@heroicons/react/outline'
import { NOTIFICATION_TYPES } from '@/constants/constant'
import { capitalizeFirstLetter, notificationQueryBuilder } from '@/utils/utils'
import useAuth from '@/hooks/useAuth'
import useCredential from '@/hooks/useCredential'
import Button from './Button'
import useNotification from '@/hooks/useNotifications'

function Notifications({ notifications, markAsRead }) {
  const { user, setUserFromLocalStorage } = useAuth()
  const { updateProfile, updateProfileLoading } = useCredential()
  const { getNotification } = useNotification()
  const [isSettingsModal, setIsSettingsModal] = useState(false)
  const [notificationPreferences, setNotificationPreferences] = useState([])
  const [markedAsRead, setMarkedAsRead] = useState(false)

  function closeModal() {
    setIsSettingsModal(false)
  }
  function openModal() {
    setIsSettingsModal(true)
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    if (checked) {
      setNotificationPreferences([...notificationPreferences, name])
    } else {
      setNotificationPreferences(notificationPreferences.filter((pref) => pref !== name))
    }
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    await updateProfile({
      _id: user?._id,
      notification_preferences: notificationPreferences,
    })
    closeModal()
    setUserFromLocalStorage()
  }
  useEffect(() => {
    if (user) {
      setNotificationPreferences(user.notification_preferences)
      const query = notificationQueryBuilder(user.notification_preferences)
      getNotification(user?._id, query)
    }
  }, [user?.notification_preferences])

  return (
    <Menu as='div' className='relative hidden sm:inline-flex items-center z-50'>
      {({ open: internalOpen }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(
          () => () => {
            if (internalOpen && notifications.length > 0) {
              markAsRead(user._id)
              setMarkedAsRead(true)
            }
          },
          [internalOpen],
        )

        return (
          <>
            <Menu.Button className='relative rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
              <BellIcon
                className='hover:text-indigo-700 w-6 h-6 text-gray-400'
                aria-hidden='true'
              />
              {notifications.filter((n) => !n.isSeen).length > 0 && !markedAsRead && (
                <span className='inline-flex items-center justify-center absolute top-0 -right-0.5 w-3.5 h-3.5 bg-red-700 text-white text-[8px] border border-white rounded-full tracking-[-0.2px]'>
                  {notifications.filter((n) => !n.isSeen).length}
                </span>
              )}
            </Menu.Button>
            <Transition
              as='div'
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items
                static
                className='origin-top-right absolute top-8 right-0 w-[430px] p-2 rounded-[10px] shadow-xl bg-slate-100 focus:outline-none z-50 max-h-[32rem] overflow-y-auto'
              >
                <Menu.Item>
                  <div className='p-6 space-y-4'>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <NotificationItem key={notification._id} item={notification} />
                      ))
                    ) : (
                      <div className='p-4 bg-white rounded-lg'>
                        <div className='flex items-start'>
                          <div className='ml-3 w-0 flex-1'>
                            <p className='text-sm leading-5 tracking-[-0.4px] text-slate-600'>
                              No notifications
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Menu.Item>
                <Menu.Item onClick={openModal}>
                  <CogIcon className='absolute right-2 top-2 w-5 h-5 m-1 text-gray-400 cursor-pointer' />
                </Menu.Item>
              </Menu.Items>
            </Transition>
            <Transition appear show={isSettingsModal} as={Fragment}>
              <Dialog as='div' className='relative z-10' onClose={closeModal}>
                <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='fixed inset-0 bg-black bg-opacity-25' />
                </Transition.Child>

                <div className='fixed inset-0 overflow-y-auto z-50'>
                  <div className='flex min-h-full items-center justify-center p-4 text-center'>
                    <Transition.Child
                      as={Fragment}
                      enter='ease-out duration-300'
                      enterFrom='opacity-0 scale-95'
                      enterTo='opacity-100 scale-100'
                      leave='ease-in duration-200'
                      leaveFrom='opacity-100 scale-100'
                      leaveTo='opacity-0 scale-95'
                    >
                      <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                        <Dialog.Title
                          as='h3'
                          className='text-lg font-medium leading-6 text-gray-900'
                        >
                          Notification Settings
                        </Dialog.Title>
                        <Dialog.Description className='text-sm text-gray-500'>
                          You can change what notifications you want to receive here.
                        </Dialog.Description>
                        <form className='my-2' onSubmit={onSubmit}>
                          <div className='grid grid-cols-2 gap-6 m-auto p-4 '>
                            {NOTIFICATION_TYPES.map((type, index) => (
                              <div className='col-span-1 flex items-center' key={index}>
                                <div className='mr-2'>
                                  <input
                                    id={type}
                                    name={type}
                                    type='checkbox'
                                    className='form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out'
                                    checked={notificationPreferences?.includes(type)}
                                    onChange={handleCheckboxChange}
                                  />
                                </div>
                                <label
                                  htmlFor='notifications-email'
                                  className='block text-sm font-medium leading-5 text-gray-700'
                                >
                                  {capitalizeFirstLetter(type)}
                                </label>
                              </div>
                            ))}
                          </div>
                        </form>
                        <div className='mt-4 flex justify-center items-center'>
                          <button
                            type='button'
                            className='inline-flex justify-center rounded-md border border-transparent bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 mr-8 '
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                          <Button
                            loading={updateProfileLoading}
                            type='submit'
                            className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                            onClick={onSubmit}
                            label='Save'
                          ></Button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </>
        )
      }}
    </Menu>
  )
}

export default Notifications
