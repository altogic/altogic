import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, SortAscendingIcon, SortDescendingIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const SortMenu = () => {
  const [buttonText, setButtonText] = useState('Sort')
  const router = useRouter()
  const sortFromUrl = router.query.sort

  const sortingMethods = [
    {
      id: 0,
      item: 'replies',
      method: 'descending',
      text: 'More Replies',
      url: 'replyCount:desc',
    },
    {
      id: 1,
      item: 'replies',
      method: 'ascending',
      text: 'Less Replies',
      url: 'replyCount:asc',
    },
    {
      id: 2,
      item: 'views',
      method: 'descending',
      text: 'More Views',
      url: 'viewCount:desc',
    },
    {
      id: 3,
      item: 'Views',
      url: 'viewCount:asc',
      text: 'Less Views',
      method: 'ascending',
    },
    {
      id: 4,
      item: 'activity',
      url: 'lastActivityAt:desc',
      text: 'Newest Activity',
      method: 'descending',
    },
    {
      id: 5,
      item: 'activity',
      url: 'lastActivityAt:asc',
      text: 'Oldest Activity',
      method: 'ascending',
    },
  ]

  const handleChange = (index) => {
    router.query.sort = sortingMethods[index].url
    router.push(router)
  }

  useEffect(() => {
    if (router.isReady) {
      const sort = sortingMethods.find((method) => method.url === sortFromUrl)

      if (sort) {
        setButtonText(sort.text)
      }
    }
  }, [sortFromUrl, router.isReady])

  return (
    <>
      <Menu as='div' className='relative hidden lg:inline-block text-left'>
        <div>
          <Menu.Button className='inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-sm font-medium text-slate-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
            <SortAscendingIcon className='-ml-1 mr-2 h-4 w-4 text-gray-400' aria-hidden='true' />
            {buttonText}
            <ChevronDownIcon className='-mr-1 ml-2 h-4 w-4 text-gray-400' aria-hidden='true' />
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
          <Menu.Items className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
            <div className='p-4'>
              {sortingMethods.map((method, index) => {
                return (
                  <>
                    <Menu.Item key={method.id} onClick={() => handleChange(index)}>
                      {({ active }) => (
                        <span
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            ' px-4 py-2 text-sm cursor-pointer flex',
                          )}
                          onClick={() => {
                            setButtonText(method.text)
                          }}
                        >
                          {method.method === 'ascending' ? (
                            <SortAscendingIcon
                              className='-ml-1 mr-2 h-4 w-4 text-gray-400'
                              aria-hidden='true'
                            />
                          ) : (
                            <SortDescendingIcon
                              className='-ml-1 mr-2 h-4 w-4 text-gray-400'
                              aria-hidden='true'
                            />
                          )}{' '}
                          {method.text}
                        </span>
                      )}
                    </Menu.Item>
                    <hr />
                  </>
                )
              })}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}

export default SortMenu
