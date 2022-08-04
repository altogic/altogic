import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import NotificationItem from '@/components/NotificationItem'
import { XIcon } from '@heroicons/react/outline'
import Button from './Button'

function MobileNotification({ isOpen, onClose, notifications, setIsNotificationModal }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={onClose}>
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

        <div className='fixed inset-0 overflow-y-auto'>
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
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-100 p-6 text-left align-middle shadow-xl transition-all'>
                <Button
                  className='absolute top-2 right-2'
                  onClick={() => setIsNotificationModal(false)}
                >
                  <XIcon className='h-4 w-4' />
                </Button>
                <div className='space-y-4'>
                  <div className='p-4 bg-white rounded-lg'>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <NotificationItem
                          key={notification._id}
                          item={notification}
                          setIsNotificationModal={setIsNotificationModal}
                        />
                      ))
                    ) : (
                      <div className='flex items-start'>
                        <div className='ml-3 w-0 flex-1'>
                          <p className='text-sm leading-5 tracking-[-0.4px] text-slate-600'>
                            No notifications
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MobileNotification
