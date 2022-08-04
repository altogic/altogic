import { Fragment, useEffect, forwardRef } from 'react'
import { Menu, Transition } from '@headlessui/react'
import useForum from '@/hooks/useForum'
import Link from 'next/link'
import { useRouter } from 'next/router'

const CategoryMenu = ({ category, tags, sort }) => {
  const { categories, fetchCategories, totalForumCount } = useForum()
  const router = useRouter()
  useEffect(() => {
    fetchCategories()
  }, [])

  const MyLink = forwardRef(function MyLink(props, ref) {
    let { href, children, ...rest } = props
    return (
      <Link href={href}>
        <a
          className='flex items-center justify-between text-gray-600 px-4 py-2 text-base rounded-md tracking-[-0.4px] hover:bg-indigo-700 hover:text-white'
          ref={ref}
          {...rest}
        >
          {children}
        </a>
      </Link>
    )
  })
  const handleAllCategories = () => {
    ;(router.query = {
      tag: tags ? tags : [],
      page: [],
      sort: sort ?? [],
    }),
      router.push(router)
  }
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button className='inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
          {category ? category : 'All Categories'}
          <svg
            className='-mr-1 ml-2 h-5 w-5'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M10 3C10.2652 3 10.5196 3.10536 10.7071 3.29289L13.7071 6.29289C14.0976 6.68342 14.0976 7.31658 13.7071 7.70711C13.3166 8.09763 12.6834 8.09763 12.2929 7.70711L10 5.41421L7.70711 7.70711C7.31658 8.09763 6.68342 8.09763 6.29289 7.70711C5.90237 7.31658 5.90237 6.68342 6.29289 6.29289L9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6.29289 12.2929C6.68342 11.9024 7.31658 11.9024 7.70711 12.2929L10 14.5858L12.2929 12.2929C12.6834 11.9024 13.3166 11.9024 13.7071 12.2929C14.0976 12.6834 14.0976 13.3166 13.7071 13.7071L10.7071 16.7071C10.3166 17.0976 9.68342 17.0976 9.29289 16.7071L6.29289 13.7071C5.90237 13.3166 5.90237 12.6834 6.29289 12.2929Z'
              fill='#9CA3AF'
            />
          </svg>
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
        <Menu.Items className='origin-top-left absolute left-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
          <div className='p-4'>
            <Menu.Item onClick={handleAllCategories}>
              <div className='flex items-center justify-between text-gray-600 px-4 py-2 text-base rounded-md tracking-[-0.4px] hover:bg-indigo-700 hover:text-white'>
                All Categories
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red-700 bg-red-100`}
                >
                  {totalForumCount}
                </span>
              </div>
            </Menu.Item>
            {categories
              ? categories.map((category) => {
                  return (
                    <Menu.Item key={category._id}>
                      <MyLink
                        href={`?category=${category.name}${tags ? '&tag=' + tags : ''}${
                          sort ? '&sort=' + sort : ''
                        }`}
                      >
                        {category.name}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white`}
                          style={{ backgroundColor: `${category?.color}` }}
                        >
                          {category.forumCount}
                        </span>
                      </MyLink>
                    </Menu.Item>
                  )
                })
              : null}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default CategoryMenu
