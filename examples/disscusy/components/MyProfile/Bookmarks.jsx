import React, { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  ChevronDownIcon,
  SortAscendingIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/solid'
import useAuth from '@/hooks/useAuth'
import useBookmark from '@/hooks/useBookmark'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import Input from '../Input'
import ForumTable from '../Forum/ForumTable'
import { firstLetterUpperCase } from '@/constants/constant'
import { usePagination } from '@/hooks/usePagination'
import { getUniqueListBy } from '@/utils/utils'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Bookmarks = () => {
  const { user } = useAuth()

  const pageSize = 10
  const {
    fetchReplyBookmarks,
    fetchForumBookmarks,
    replyBookmarks,
    forumBookmarks,
    replyLoading,
    forumLoading,
    fetchBookmarkCategories,
    categories,
    deleteBookmarkCategory,
    changeBookmarkCategoryName,
    addBookmarkCategory,
    deleteBookmark,
    changeBookmarkCategory,
    forumBookmarkCount,
    replyBookmarkCount,
  } = useBookmark()
  const [bookmarkForums, setBookmarkForums] = useState([])
  const [isCreateCategoryModal, setIsCreateCategoryModal] = useState(false)
  const [isEditCategoryModal, setIsEditCategoryModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [buttonText, setButtonText] = useState('Sort')
  const [replyForums, setReplyForums] = useState([])
  const [categoriesState, setCategoriesState] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [secondCurrentPage, setSecondCurrentPage] = useState(1)

  const bookmarkCategorySchema = yup.object().shape({
    name: yup.string().required('Category name is required'),
  })

  const sortingMethods = [
    {
      id: 0,
      item: 'Newest',
      method: 'desc',
      sort: (categoryId) => {
        fetchReplyBookmarks(user?._id, currentPage, pageSize, categoryId, 'createdAt', 'desc')
        fetchForumBookmarks(user?._id, secondCurrentPage, pageSize, categoryId, 'createdAt', 'desc')
      },
    },
    {
      id: 1,
      item: 'Oldest',
      method: 'asc',
      sort: (categoryId) => {
        fetchReplyBookmarks(user?._id, currentPage, pageSize, categoryId, 'createdAt', 'asc')
        fetchForumBookmarks(user?._id, secondCurrentPage, pageSize, categoryId, 'createdAt', 'asc')
      },
    },
  ]
  const {
    register,
    getValues,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(bookmarkCategorySchema),
  })
  const handleChangeCategory = async (categoryId, categoryName, type = '') => {
    setSelectedCategory(categoryName)
    if (categoryId === 0 && categoryName === 'All') {
      fetchReplyBookmarks(user?._id, currentPage, pageSize)
      fetchForumBookmarks(user?._id, secondCurrentPage, pageSize)
    } else {
      if (type === 'reply') {
        fetchReplyBookmarks(user?._id, currentPage, pageSize, categoryId)
      } else if (type === 'forum') {
        fetchForumBookmarks(user?._id, secondCurrentPage, pageSize, categoryId)
      } else {
        fetchReplyBookmarks(user?._id, currentPage, pageSize, categoryId)
        fetchForumBookmarks(user?._id, secondCurrentPage, pageSize, categoryId)
      }
    }
  }
  useEffect(() => {
    fetchReplyBookmarks(user?._id, secondCurrentPage, pageSize)
    fetchForumBookmarks(user?._id, currentPage, pageSize)
    fetchBookmarkCategories(user?._id)
  }, [currentPage, secondCurrentPage])

  useEffect(() => {
    setBookmarkForums([])
    setReplyForums([])

    forumBookmarks?.forEach((bookmark) => {
      if (bookmark.type == 'forum' && bookmark.forum._id) {
        setBookmarkForums((prevState) => [...getUniqueListBy(prevState), bookmark.forum])
      }
    })
    replyBookmarks?.forEach((bookmark) => {
      if (bookmark.type == 'reply' && bookmark.reply_forum._id) {
        bookmark.reply_forum.reply_link = bookmark.reply_link
        setReplyForums((prevState) => [
          ...prevState,
          { ...bookmark.reply_forum, reply: bookmark.reply },
        ])
      }
    })
  }, [forumBookmarks, replyBookmarks])

  useEffect(() => {
    setReplyForums([])
    setBookmarkForums([])
  }, [selectedCategory])
  useEffect(() => {
    if (!categories.some((category) => category.name === 'All' && category._id === 0)) {
      categories.unshift({
        _id: 0,
        name: 'All',
      })
    }
    setCategoriesState(categories)
  }, [categories])
  const handleDeleteBookmark = async (userId, targetId, type) => {
    await deleteBookmark(userId, targetId, type)
    handleChangeCategory(selectedCategoryId, selectedCategory, type)
  }
  const handleUpdateCategory = async (catId, targetId, type) => {
    await changeBookmarkCategory(user?._id, targetId, type, catId)
    handleChangeCategory(selectedCategoryId, selectedCategory, type)
  }

  const replyPaginationRange = usePagination({
    pageSize: pageSize,
    currentPage: Number(currentPage),
    totalCount: replyBookmarkCount,
  })
  const forumPaginationRange = usePagination({
    pageSize: pageSize,
    currentPage: Number(secondCurrentPage),
    totalCount: forumBookmarkCount,
  })

  return (
    <div className='bg-slate-50 p-4 md:p-6 rounded-[10px]'>
      <div className='mb-8 text-center sm:text-left'>
        <h3 className='text-2xl leading-7 font-medium text-slate-800 tracking-[-0.8px]'>
          Yours Bookmarks
        </h3>
        <p className='mt-1 text-slate-500 tracking-[-0.4px]'>Forums you bookmark.</p>
      </div>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <Menu as='div' className='relative block sm:inline-block w-full sm:w-auto text-left'>
          <div>
            <Menu.Button className='flex sm:inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
              {selectedCategory}
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
            <Menu.Items className='origin-top-left absolute left-0 mt-2 w-full sm:w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
              <div className='p-4'>
                <Menu.Item as='div'>
                  <button
                    type='button'
                    onClick={() => setIsCreateCategoryModal(true)}
                    className='flex items-center justify-center gap-2 w-full px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  >
                    <PlusIcon className='w-5 h-5' />
                    Create Category
                  </button>
                </Menu.Item>
                <hr className='my-5' />
                {categoriesState?.map((category) => (
                  <Menu.Item
                    key={category._id}
                    as='div'
                    className='group flex items-center justify-between gap-4 px-4 py-2 rounded-md cursor-pointer hover:bg-indigo-700'
                    onClick={() => {
                      setSelectedCategoryId(category._id)
                      handleChangeCategory(category._id, category.name)
                    }}
                    role='button'
                    tabIndex={0}
                  >
                    <span className='inline-flex text-sm font-medium tracking-[-0.4px] text-slate-600 group-hover:text-white'>
                      {category.name}
                    </span>
                    {category.name !== 'Unlisted' && category.name !== 'All' && (
                      <div className='flex items-center justify-evenly'>
                        <Menu.Button
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsEditCategoryModal(true)
                            setSelectedCategoryId(category._id)
                            setValue('name', category.name)
                          }}
                          className='flex items-center justify-center w-8 h-8 text-sm font-medium bg-gray-100 rounded-full group-hover:bg-indigo-600 mr-4'
                        >
                          <PencilIcon className='w-5 h-5 text-slate-400 group-hover:text-white' />
                        </Menu.Button>
                        <Menu.Button
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsEditCategoryModal(false)
                            deleteBookmarkCategory(
                              category._id,
                              categories.find((category) => category.name === 'Unlisted')._id,
                            )
                            if (selectedCategoryId === category._id) {
                              handleChangeCategory(0, 'All')
                            }
                          }}
                          className='flex items-center justify-center w-8 h-8 text-sm font-medium bg-gray-100 rounded-full group-hover:bg-indigo-600'
                        >
                          <TrashIcon className='w-5 h-5 text-slate-400 group-hover:text-white' />
                        </Menu.Button>
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <Menu as='div' className='relative block sm:inline-block w-full sm:w-auto text-left'>
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
            <Menu.Items className='origin-top-right absolute right-0 mt-2 w-full sm:w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
              <div className='p-4'>
                {sortingMethods.map((method) => {
                  return (
                    <Menu.Item key={method.id} onClick={() => method.sort(selectedCategoryId)}>
                      {({ active }) => (
                        <span
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm cursor-pointer',
                          )}
                          onClick={() => {
                            setButtonText(firstLetterUpperCase(method.item))
                          }}
                        >
                          {firstLetterUpperCase(method.item)}
                        </span>
                      )}
                    </Menu.Item>
                  )
                })}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <div className='mt-10 md:mt-16'>
        <div className='mb-6 text-center sm:text-left'>
          <p className='mt-1 text-slate-500 tracking-[-0.4px]'>Forums you bookmark.</p>
        </div>
        <ForumTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          urlBasedPagination={false}
          forums={bookmarkForums}
          loading={forumLoading}
          noDataText={'You have no bookmark forums.'}
          onDelete={(id) => handleDeleteBookmark(user?._id, id, 'forum')}
          paginationRange={forumPaginationRange}
          page={currentPage}
          pageSize={pageSize}
          count={forumBookmarkCount}
          onEdit={(id, catId) => {
            handleUpdateCategory(catId, id, 'forum')
          }}
          operation
          categories={categories.filter((ct) => ct.name !== 'All')}
        />
      </div>

      <div className='mt-10 md:mt-16'>
        <div className='mb-6 md:mb-8 text-center sm:text-left'>
          <p className='mt-1 text-slate-500 tracking-[-0.4px]'>Replies you bookmark.</p>
        </div>

        <ForumTable
          isReplyTable={true}
          setCurrentPage={setSecondCurrentPage}
          urlBasedPagination={false}
          forums={replyForums}
          loading={replyLoading}
          noDataText={'You have no bookmark replies.'}
          onDelete={(id) => handleDeleteBookmark(user?._id, id, 'reply')}
          paginationRange={replyPaginationRange}
          page={secondCurrentPage}
          pageSize={pageSize}
          count={replyBookmarkCount}
          onEdit={(id, catId) => {
            handleUpdateCategory(catId, id, 'reply')
          }}
          operation
          categories={categories.filter((ct) => ct.name !== 'All')}
        />
      </div>

      {isCreateCategoryModal && (
        <>
          <div className='fixed inset-0 w-full h-full bg-black bg-opacity-25 z-10'></div>
          <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[510px] bg-white p-6 shadow-xl rounded-lg z-50'>
            <div>
              <div className='text-center'>
                <h3 className='text-xl font-semibold leading-6 tracking-[-0.8px] text-slate-700'>
                  Create New Category
                </h3>
                <div className='mt-2'>
                  <p className='text-sm text-slate-600 tracking-[-0.4px]'>
                    Change the category name or delete the category.
                  </p>
                </div>
              </div>

              <div className='mt-7 mb-12'>
                <form action='#'>
                  <div>
                    <div className='mt-1'>
                      <Input
                        type='text'
                        name='name'
                        id='name'
                        autoComplete='name'
                        register={register('name')}
                        error={errors.name}
                        className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className='flex flex-col-reverse sm:grid sm:grid-cols-2 gap-3'>
                <button
                  type='button'
                  className='inline-flex items-center justify-center px-4 py-2 whitespace-nowrap border border-gray-300 shadow-sm text-sm font-medium tracking-[-0.4px] rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  onClick={() => setIsCreateCategoryModal(false)}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='inline-flex items-center justify-center px-4 py-2 whitespace-nowrap border border-transparent text-sm font-medium tracking-[-0.4px] rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  onClick={() => {
                    setIsCreateCategoryModal(false)
                    addBookmarkCategory(user?._id, getValues('name'))
                    reset()
                  }}
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {isEditCategoryModal && (
        <>
          <div className='fixed inset-0 w-full h-full bg-black bg-opacity-25 z-10'></div>
          <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[510px] bg-white p-6 shadow-xl rounded-lg z-50'>
            <div>
              <div className='text-center'>
                <h3 className='text-xl leading-6 tracking-[-0.8px] text-slate-700'>
                  <strong className='font-semibold'>Change Name</strong> or{' '}
                  <strong className='font-semibold'>Delete Category</strong>
                </h3>
                <div className='mt-2'>
                  <p className='text-sm text-slate-600 tracking-[-0.4px]'>
                    Change the category name or delete the category.
                  </p>
                </div>
              </div>

              <div className='mt-7 mb-12'>
                <form action='#'>
                  <div>
                    <label
                      htmlFor='change-category-name'
                      className='block text-slate-700 tracking-[-0.4px]'
                    >
                      Change Category Name
                    </label>
                    <div className='mt-1'>
                      <Input
                        type='text'
                        name='name'
                        id='name'
                        autoComplete='name'
                        register={register('name')}
                        error={errors.name}
                        className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className='grid sm:grid-cols-2 gap-3'>
                <button
                  type='button'
                  className='inline-flex items-center justify-center px-4 py-2 whitespace-nowrap border border-gray-300 shadow-sm text-sm font-medium tracking-[-0.4px] rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  onClick={() => setIsEditCategoryModal(false)}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='inline-flex items-center justify-center px-4 py-2 whitespace-nowrap border border-transparent text-sm font-medium tracking-[-0.4px] rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  onClick={async () => {
                    await changeBookmarkCategoryName(selectedCategoryId, getValues('name'))
                    handleChangeCategory(selectedCategoryId, getValues('name'))
                    setIsEditCategoryModal(false)
                    reset()
                  }}
                >
                  Change Name
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Bookmarks
