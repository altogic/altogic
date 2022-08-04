import useProfile from '@/hooks/useProfile'
import React, { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import Link from 'next/link'
import FollowButon from '../FollowButton'
import DefaultAvatar from './DefaultAvatar'
import { usePagination } from '@/hooks/usePagination'
import { useRouter } from 'next/router'
import Pagination from '../Pagination'
const UserList = ({ type }) => {
  const router = useRouter()
  const page = router.query.page ?? 1

  const pageSize = 20
  const { followings, getFollowers, followers, getFollowings } = useProfile()
  const [countItems, setCountItems] = useState(0)

  const { user } = useAuth()

  const [items, setItems] = useState()
  useEffect(() => {
    getFollowings(user?._id, page, pageSize)
    if (type == 'followers') {
      getFollowers(user?._id, page, pageSize)
    }
  }, [])

  useEffect(() => {
    if (type == 'followers') {
      setItems(followers?.data)
      setCountItems(followers?.info?.count)
    } else if (type == 'followings') {
      setItems(followings?.data)
      setCountItems(followings?.info?.count)
    }
  }, [followers, followings])

  const paginationRange = usePagination({
    pageSize: pageSize,
    currentPage: Number(page),
    totalCount: followers?.info?.count,
  })

  return (
    <div className='bg-slate-50 p-4 md:p-6 rounded-[10px]'>
      <div className='mb-8 text-center sm:text-left'>
        <h3 className='text-2xl leading-7 font-medium text-slate-800 tracking-[-0.8px]'>
          Total {type.charAt(0).toUpperCase() + type.substring(1)} :{' '}
          <strong>{items?.length ?? 0}</strong>
        </h3>
        <p className='mt-1 text-slate-500 tracking-[-0.4px]'>
          Users {type == 'followers' ? 'follows you' : 'you follow'}.
        </p>
      </div>
      <ul role='list' className='grid sm:grid-cols-2 xl:grid-cols-3 gap-x-4 md:gap-x-16'>
        {items?.map((item) => (
          <li
            key={item.id}
            className='relative flex items-center justify-between py-6 border-b border-gray-200'
          >
            <div className='group cursor-pointer flex items-center space-x-2 md:space-x-4 pr-2'>
              <div className='relative'>
                {(type == 'followers' && item.followerUserProfilePicture) ||
                (type === 'followings' && item.followingUserProfilePicture) ? (
                  <img
                    className='w-10 h-10 rounded-full object-cover'
                    src={
                      type == 'followers'
                        ? item.followerUserProfilePicture
                        : item.followingUserProfilePicture
                    }
                    alt=''
                  />
                ) : (
                  <DefaultAvatar
                    name={type == 'followers' ? item.followerUsername : item.followingUsername}
                    className='h-10 w-10'
                  />
                )}

                <div className='absolute left-0 top-[40px] shadow bg-white w-full sm:w-96 border border-gray-200 z-10 rounded-lg opacity-0 invisible md:group-hover:opacity-100 group-hover:visible'>
                  <div className='w-full flex flex-col justify-between p-6'>
                    <div className='relative rounded-lg flex items-center gap-6 mb-6'>
                      <div className='flex-shrink-0'>
                        {(type == 'followers' && item.followerUserProfilePicture) ||
                        (type === 'followings' && item.followingUserProfilePicture) ? (
                          <img
                            className='w-14 h-14 rounded-full object-cover'
                            src={
                              type == 'followers'
                                ? item.followerUserProfilePicture
                                : item.followingUserProfilePicture
                            }
                            alt=''
                          />
                        ) : (
                          <DefaultAvatar
                            name={
                              type == 'followers' ? item.followerUsername : item.followingUsername
                            }
                            className='h-14 w-14 text-xs'
                          />
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <a className='focus:outline-none'>
                          <span className='absolute inset-0' aria-hidden='true'></span>
                          <p className='text-sm font-medium text-slate-800'>
                            {type == 'followers' ? item.followerName : item.followingName}
                          </p>
                          <p className='text-sm text-slate-400 truncate'>
                            @{type == 'followers' ? item.followerUsername : item.followingUsername}
                          </p>
                        </a>
                      </div>
                    </div>
                    <div>
                      <h6 className='text-slate-800 mb-2 text-sm font-semibold leading-5 tracking-[-0.4px]'>
                        About
                      </h6>
                      <p className='text-slate-600 text-sm leading-5 tracking-[-0.4px]'>
                        {type == 'followers' ? item.followerUserAbout : item.followingUserAbout}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className='-mt-px flex border-t border-gray-200 divide-x divide-gray-200'>
                      <div className='w-0 flex-1 flex'>
                        <>
                          <Link
                            href={
                              'user?userId=' +
                              (type == 'followers' ? item?.followerUser : item?.followingUser)
                            }
                          >
                            <a className='relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm tracking-[-0.4px] text-slate-500 font-medium border border-transparent rounded-bl-lg hover:bg-gray-50'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-6 w-6'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                strokeWidth='2'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                                />
                              </svg>
                              <span className='ml-3'>View Profile</span>
                            </a>
                          </Link>
                        </>
                      </div>
                      <div className='-ml-px w-0 flex-1 flex'>
                        <FollowButon
                          profile={
                            type == 'followers'
                              ? {
                                  _id: item?.followerUser,
                                  username: item?.followerUsername,
                                  name: item?.followerName ?? '',
                                  surname: '',
                                  about: item?.followerUserAbout,
                                  profilePicture: item?.followerUserProfilePicture,
                                }
                              : {
                                  _id: item?.followingUser,
                                  username: item?.followingUsername,
                                  name: item?.followingName ?? '',
                                  surname: '',
                                  about: item?.followingUserAbout,
                                  profilePicture: item?.followingUserProfilePicture,
                                }
                          }
                          followed={followings?.data?.some(
                            (following) => following._id == item?._id,
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href={
                  'user?userId=' + (type == 'followers' ? item?.followerUser : item?.followingUser)
                }
              >
                <div className='text-sm leading-5 tracking-[-0.4px]'>
                  <h3 className='text-slate-900 font-medium'>
                    {type == 'followers' ? item.followerName : item.followingName}{' '}
                  </h3>
                  <p className='text-slate-400'>
                    @{type == 'followers' ? item.followerUsername : item.followingUsername}{' '}
                  </p>
                </div>
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <Pagination
        pageSize={pageSize}
        paginationRange={paginationRange}
        page={page}
        count={countItems}
      />
    </div>
  )
}

export default UserList
