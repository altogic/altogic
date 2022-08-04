import React, { Fragment, useEffect, useState } from 'react'
import ShareMenuItem from '@/components/ForumDetail/ShareMenuItem'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { formatDate } from '@/utils/date'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from '../Input'
import ForumDetailTag from './ForumDetailTag'
import InteractionButton from './InteractionButton'
import DefaultAvatar from '../MyProfile/DefaultAvatar'
import useBookmark from '@/hooks/useBookmark'
import useAuth from '@/hooks/useAuth'
import FollowButton from '../FollowButton'
import useReply from '@/hooks/useReply'
import useForum from '@/hooks/useForum'
import useVote from '@/hooks/useVote'
import { PlusIcon } from '@heroicons/react/outline'
import { ReplyIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'
import useNotification from '@/hooks/useNotifications'
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share'
import Button from '../Button'
export default function ForumDetailCard({
  card,
  index,
  bookmarked,
  comments,
  bookmarkCategories,
  upVoted,
  downVoted,
  followings,
  isAuthenticated,
}) {
  const router = useRouter()
  const { addComment, updateReplyLastComment, loading, comment, commentLoading } = useReply()
  const { updateForumActivity } = useForum()
  const { user } = useAuth()
  const { addForumVote, addReplyVote } = useVote()
  const [basePath, setBasePath] = useState()
  const [commentOpen, setCommentOpen] = useState(false)
  const { addBookmark, addBookmarkCategory } = useBookmark()
  const { sendNotification } = useNotification()
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [voteCount, setVoteCount] = useState(0)
  const [isCreateCategoryModal, setIsCreateCategoryModal] = useState(false)
  const [newComment, setNewComment] = useState()
  const [commentsToShow, setCommentsToShow] = useState()
  const [isBookmarked, setIsBookmarked] = useState()
  const [isVoted, setIsVoted] = useState()
  const [isDownVoted, setIsDownVoted] = useState()
  const [isFollowed, setIsFollowed] = useState()
  const [_user, set_user] = useState()

  const [currentButton, setCurrentButton] = useState()
  const bookmarkCategorySchema = yup.object().shape({
    name: yup.string().required('Category name is required'),
  })
  const page = router.query.page
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(bookmarkCategorySchema),
  })

  const shareUrl = `${basePath}/forum-detail?id=${card?.forum?._id ?? card?._id}${
    page == undefined ? '' : `&page=${page}`
  }${card?.forum ? `&reply=${index}` : ''}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
  }

  async function formSubmit(e) {
    setCurrentButton(card?._id)
    e.preventDefault()
    let replyData = {
      content: newComment,
      isDeleted: false,
      user: user?._id,
      username: user.username,
      forum: router.query.id,
    }
    if (card?.forum) {
      replyData.reply = card?._id
    }

    let lastComment = {
      _parent: card?._id,
      content: replyData.content,
      user: user?._id,
      username: user.username,
    }
    await addComment(replyData)
    if (card?.lastComments.length < 5) updateReplyLastComment(card?._id, lastComment)
    updateForumActivity(router.query.id)
    setCommentOpen(false)
    sendNotificationHandler('comment')

    if (router.query.reply) {
      router.query.reply = []
      router.push(router)
    }
  }

  useEffect(() => {
    card?.bookmarkCount && setBookmarkCount(card?.bookmarkCount)
    card?.voteCount && setVoteCount(card?.voteCount)
  }, [card])
  useEffect(() => {
    setIsFollowed(
      followings?.data?.some((following) => following.followingUser === card?.user?._id),
    )
  }, [card?.user?._id, followings])

  const handleAddBookmark = async (card, category) => {
    const request = {
      bookmark_category: category,
      user: user?._id,
    }
    if (card?.forum) {
      request.reply = card?._id
      request.type = 'reply'
      request.reply_forum = card.forum._id
      request.reply_link = shareUrl
    } else {
      request.forum = router.query.id
      request.type = 'forum'
    }
    addBookmark(request)
    if (!isBookmarked) {
      setBookmarkCount(bookmarkCount + 1)
    }
    setIsBookmarked(true)
    sendNotificationHandler('bookmark')
  }
  const handleVote = async (voteType) => {
    if (user && !isVoted && !isDownVoted) {
      const request = {
        user: user?._id,
        voteType,
        forum: router.query.id,
      }
      if (card?.forum) {
        request.reply = card?._id
        request.reply_link = shareUrl
        addReplyVote(request)
      } else {
        addForumVote(request)
      }

      if (voteType === 'Up') {
        setVoteCount(voteCount + 1)
        setIsVoted(true)
      } else {
        setVoteCount(voteCount - 1)
        setIsDownVoted(true)
      }
      sendNotificationHandler('vote')
    }
  }
  const handleAddBookmarkCategory = async () => {
    setIsCreateCategoryModal(false)
    const catId = await addBookmarkCategory(user._id, getValues('name'))
    handleAddBookmark(card, catId)
  }
  useEffect(() => {
    setBasePath(window.location.origin)
    setCommentsToShow(card?.lastComments ?? [])
  }, [])

  useEffect(() => {
    setIsBookmarked(bookmarked)
    setIsVoted(upVoted)
    setIsDownVoted(downVoted)
  }, [bookmarked, downVoted, upVoted])

  useEffect(() => {
    set_user(user)
  }, [user])
  const sendNotificationHandler = (type) => {
    if (user?._id !== card?.user?._id) {
      sendNotification({
        user: card?.user?._id,
        sentUser: user?._id,
        type,
        targetId: card?._id,
        sentUsername: user.username,
        sentUserProfilePicture: user.profilePicture,
        targetTitle: !card?.forum ? card?.title : `${card?.forum.title}`,
        reply_link: card?.forum ? shareUrl : '',
      })
    }
  }
  useEffect(() => {
    if (commentsToShow?.length > 5) {
      setCommentsToShow(comments)
    } else {
      setCommentsToShow(card?.lastComments)
    }
  }, [comment, loading])
  return (
    <div className='relative lg:grid lg:grid-cols-[107px_1fr] lg:gap-8 '>
      <div className='relative flex flex-col'>
        <div
          className={
            'group hidden lg:flex flex-col space-y-2 ' +
            (!isAuthenticated || card?.user?.isDeleted ? '' : 'cursor-pointer')
          }
        >
          {card?.user?.isDeleted || card?.user?.profilePicture ? (
            <img
              className='w-10 h-10 rounded-full object-cover'
              src={card?.user?.isDeleted ? '/default-avatar.jpeg' : card?.user?.profilePicture}
              alt=''
            />
          ) : (
            <DefaultAvatar name={card?.user?.username} className='h-10 w-10' />
          )}

          <div className='text-sm leading-5 tracking-[-0.4px]'>
            <h3 className='text-slate-900 font-medium'>{card?.user?.name}</h3>
            <p className='text-slate-400'>
              @{card?.user?.isDeleted ? 'anonymous' : card?.user?.username}
            </p>
          </div>
          <div
            className={`absolute left-0 top-[80px] shadow bg-white w-96 border border-gray-200 z-10 rounded-lg hidden ${
              !card?.user?.isDeleted && isAuthenticated && 'group-hover:block'
            }`}
          >
            <div className='w-full flex flex-col justify-between p-6'>
              <div className='relative rounded-lg flex items-center gap-6 mb-6'>
                <div className='flex-shrink-0'>
                  {card?.user?.profilePicture ? (
                    <img
                      className='h-14 w-14 rounded-full object-cover'
                      src={card?.user?.profilePicture}
                      alt=''
                    />
                  ) : (
                    <DefaultAvatar name={card?.user?.username} className='h-14 w-14' />
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <Link
                    href={
                      card?.user?._id == _user?._id
                        ? 'my-profile'
                        : 'user?userId=' + card?.user?._id
                    }
                  >
                    <a className='focus:outline-none'>
                      <span className='absolute inset-0' aria-hidden='true'></span>
                      <p className='text-sm font-medium text-slate-800'>{card?.user?.name}</p>
                      <p className='text-sm text-slate-400 truncate'>@{card?.user?.username}</p>
                    </a>
                  </Link>
                </div>
              </div>
              <div>
                <h6 className='text-slate-800 mb-2 text-sm font-semibold leading-5 tracking-[-0.4px]'>
                  About
                </h6>
                <p className='text-slate-600 text-sm leading-5 tracking-[-0.4px]'>
                  {card?.user?.about}
                </p>
              </div>
            </div>
            <div>
              <div className='-mt-px flex border-t border-gray-200 divide-x divide-gray-200'>
                <div className='w-0 flex-1 flex'>
                  <Link
                    href={
                      card?.user?._id == _user?._id
                        ? 'my-profile'
                        : 'user?userId=' + card?.user?._id
                    }
                  >
                    <a className='relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm tracking-[-0.4px] text-slate-500 font-medium border border-transparent rounded-bl-lg hover:bg-gray-50'>
                      <svg
                        xmlns='http:www.w3.org/2000/svg'
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
                </div>
                {_user?._id != card?.user?._id && (
                  <div className='-ml-px w-0 flex-1 flex'>
                    <FollowButton
                      profile={card?.user}
                      followed={isFollowed}
                      setIsFollowedProps={setIsFollowed}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='flex-col self-start justify-center items-center mt-8 hidden lg:flex '>
          <ChevronUpIcon
            className={`${isVoted ? 'text-gray-700' : 'text-gray-300'} ${
              !isDownVoted && user ? 'hover:text-gray-700 cursor-pointer' : ''
            } w-12 h-12`}
            onClick={() => handleVote('Up')}
          />
          <span className='text-gray-500 text-xl'>{voteCount}</span>
          <ChevronDownIcon
            className={`${isDownVoted ? 'text-gray-700' : 'text-gray-300'} ${
              !isVoted && user ? 'hover:text-gray-700 cursor-pointer' : ''
            }  w-12 h-12`}
            onClick={() => handleVote('Down')}
          />
        </div>
      </div>
      <div>
        {card?.title && (
          <h2 className='mb-6 text-2xl leading-7 font-bold tracking-[-0.8px] max-w-[88%]'>
            {card?.title}
          </h2>
        )}
        <div className='flex items-center gap-8'>
          {card?.categoryName && (
            <div className='flex items-center gap-3'>
              <span
                className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white tracking-[-0.4px] cursor-default'
                style={{ backgroundColor: `${card?.categoryColor}` }}
              >
                {card?.categoryName}
              </span>
            </div>
          )}
          <span className='text-slate-400 text-sm leading-5 tracking-[-0.4px]'>
            Create:{' '}
            <span className='text-slate-700'>{formatDate(card?.createdAt, 'dd MMM yyyy')}</span>
          </span>
          <div
            className={`flex flex-col self-start justify-center items-center right-3 absolute ml-4 pt-2 lg:hidden ${
              card?.title ? ' -top-5' : 'top-16'
            }`}
          >
            <ChevronUpIcon
              className={`${
                isVoted ? 'text-gray-700' : 'text-gray-300'
              } hover:text-gray-700 cursor-pointer w-10 h-10`}
              onClick={() => handleVote('Up')}
            />
            <span className='text-gray-500 text-xl'>{voteCount}</span>
            <ChevronDownIcon
              className={`${
                isDownVoted ? 'text-gray-700' : 'text-gray-300'
              } hover:text-gray-700 cursor-pointer w-10 h-10`}
              onClick={() => handleVote('Down')}
            />
          </div>
        </div>
        <hr className='my-6' />
        <div
          id={card?.forum && card?._id}
          className={
            'flex flex-col xl:flex-row xl:items-center gap-4 ' +
            (card?.forum ? 'justify-end' : 'justify-between')
          }
        >
          {card?.tags && (
            <div className='flex items-center'>
              <span className='inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-slate-400 rounded-full ring-8 ring-white'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                  xmlns='http:www.w3.org/2000/svg'
                >
                  <path
                    d='M11.25 3.06424L10.5003 3.72597C10.514 3.74154 10.5282 3.75667 10.5429 3.77135L11.25 3.06424ZM16.9358 11.25L16.274 10.5003C16.2585 10.514 16.2433 10.5282 16.2287 10.5429L16.9358 11.25ZM17.0833 8.89757L17.8331 8.23584C17.8193 8.22028 17.8051 8.20514 17.7904 8.19047L17.0833 8.89757ZM8.89756 17.0833L8.19045 17.7904C8.20513 17.8051 8.22026 17.8193 8.23582 17.8331L8.89756 17.0833ZM11.1024 17.0833L11.7641 17.8331C11.7797 17.8193 11.7948 17.8051 11.8095 17.7904L11.1024 17.0833ZM3.06421 11.25L3.77132 10.5429L3.74929 10.5209L3.72594 10.5003L3.06421 11.25ZM5.83331 4.83333C5.28103 4.83333 4.83331 5.28105 4.83331 5.83333C4.83331 6.38562 5.28103 6.83333 5.83331 6.83333V4.83333ZM5.84164 6.83333C6.39393 6.83333 6.84164 6.38562 6.84164 5.83333C6.84164 5.28105 6.39393 4.83333 5.84164 4.83333V6.83333ZM3.49997 5.83333C3.49997 4.54467 4.54464 3.5 5.83331 3.5V1.5C3.44007 1.5 1.49997 3.4401 1.49997 5.83333H3.49997ZM3.49997 10V5.83333H1.49997V10H3.49997ZM5.83331 3.5H9.99999V1.5H5.83331V3.5ZM9.99999 3.5C10.199 3.5 10.3766 3.58591 10.5003 3.72597L11.9997 2.40251C11.5126 1.85055 10.7966 1.5 9.99999 1.5V3.5ZM16.5 10C16.5 10.199 16.4141 10.3766 16.274 10.5003L17.5975 11.9997C18.1495 11.5126 18.5 10.7966 18.5 10H16.5ZM16.3336 9.55931C16.4379 9.67743 16.5 9.83024 16.5 10H18.5C18.5 9.32439 18.2475 8.70532 17.8331 8.23584L16.3336 9.55931ZM9.99999 16.5C9.83023 16.5 9.67742 16.4379 9.55929 16.3336L8.23582 17.8331C8.70531 18.2474 9.32437 18.5 9.99999 18.5V16.5ZM10.4407 16.3336C10.3226 16.4379 10.1697 16.5 9.99999 16.5V18.5C10.6756 18.5 11.2947 18.2474 11.7641 17.8331L10.4407 16.3336ZM3.72594 10.5003C3.58588 10.3766 3.49997 10.199 3.49997 10H1.49997C1.49997 10.7966 1.85052 11.5126 2.40248 11.9997L3.72594 10.5003ZM10.5429 3.77135L16.3762 9.60468L17.7904 8.19047L11.9571 2.35713L10.5429 3.77135ZM9.60466 16.3762L3.77132 10.5429L2.3571 11.9571L8.19045 17.7904L9.60466 16.3762ZM16.2287 10.5429L10.3953 16.3762L11.8095 17.7904L17.6429 11.9571L16.2287 10.5429ZM5.83331 6.83333H5.84164V4.83333H5.83331V6.83333Z'
                    fill='currentColor'
                  />
                </svg>
              </span>

              <span className='inline-flex text-slate-700 mx-3 text-sm leading-5 tracking-[-0.4px]'>
                Tags
              </span>
              <div className='inline lg:flex lg:items-center lg:gap-3'>
                {card?.tags?.map((tag, index) => {
                  return <ForumDetailTag key={tag} Tag={tag} Index={index} />
                })}
              </div>
            </div>
          )}
          <div className='flex flex-wrap items-center gap-2'>
            {isAuthenticated && (
              <Menu
                as='div'
                className='group relative z-100 inline-flex shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'
              >
                <Menu.Button className='flex sm:inline-flex justify-between relative z-0 w-full'>
                  <InteractionButton
                    Text='Add Bookmark'
                    Count={bookmarkCount}
                    Icon={'Bookmark'}
                    marked={isBookmarked}
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='origin-top-left absolute top-10 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
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
                      {bookmarkCategories?.map((category) => (
                        <Menu.Item
                          key={category._id}
                          as='div'
                          className='group flex items-center justify-between gap-4 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300'
                          role='button'
                          tabIndex={0}
                          onClick={() => {
                            handleAddBookmark(card, category._id)
                          }}
                        >
                          <span className='inline-flex text-sm font-medium tracking-[-0.4px] text-slate-600'>
                            {category.name}
                          </span>
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}

            <Menu as='div' className='relative inline-block text-left'>
              <div>
                <Menu.Button className='group relative z-0 inline-flex justify-center w-full rounded-md bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
                  <InteractionButton Text='Share' Count={card?.shareCount} Icon={'Share'} />
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
                  <div className='py-1 divide-y divide-gray-100'>
                    <ShareMenuItem
                      onClick={copyToClipboard}
                      Icon={'CopyLink'}
                      Text={'Copy link'}
                      isForum={!card?.forum}
                      Id={card?._id}
                      Card={card}
                    />
                    <TwitterShareButton url={shareUrl}>
                      <ShareMenuItem
                        Card={card}
                        Color={'currentColor'}
                        Icon={'Twitter'}
                        Text={'Share on Twitter'}
                        isForum={!card?.forum}
                        Id={card?._id}
                        isAuthenticated={isAuthenticated}
                      />
                    </TwitterShareButton>
                    <FacebookShareButton url={shareUrl}>
                      <ShareMenuItem
                        Card={card}
                        Color={'currentColor'}
                        Icon={'Facebook'}
                        Text={'Share on Facebook'}
                        isForum={!card?.forum}
                        Id={card?._id}
                        isAuthenticated={isAuthenticated}
                      />
                    </FacebookShareButton>
                    <LinkedinShareButton url={shareUrl}>
                      <ShareMenuItem
                        Card={card}
                        Color={'currentColor'}
                        Icon={'Linkedin'}
                        Text={'Share on Linkedin'}
                        isForum={!card?.forum}
                        Id={card?._id}
                        isAuthenticated={isAuthenticated}
                      />
                    </LinkedinShareButton>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <div className='relative inline-block'>
          <div className='mt-6 gap-2 group flex items-end lg:hidden space-y-2 text-sm leading-5 tracking-[-0.4px]'>
            {card?.user?.profilePicture ? (
              <img
                className='w-10 h-10 rounded-full object-cover'
                src={card?.user?.profilePicture}
                alt=''
              />
            ) : (
              <DefaultAvatar
                name={card?.user?.username}
                className='w-10 h-10 rounded-full object-cover'
              />
            )}

            <div className=''>
              <h3 className='text-slate-900 font-medium'>
                {card?.user?.name + ' ' + card?.user?.surname}
              </h3>
              <p className='text-slate-400'>@{card?.user?.username}</p>
            </div>
            <div
              className={`absolute top-[80px] shadow bg-white w-80 border border-gray-200 z-10 rounded-lg hidden ${
                !card?.user?.isDeleted && 'group-hover:block'
              }`}
            >
              <div className='w-full flex flex-col justify-between p-6'>
                <div className='relative rounded-lg flex items-center gap-6 mb-6'>
                  <div className='flex-shrink-0'>
                    {card?.user?.profilePicture ? (
                      <img
                        className='h-14 w-14 rounded-full object-cover'
                        src={card?.user?.profilePicture}
                        alt=''
                      />
                    ) : (
                      <DefaultAvatar
                        name={card?.user?.username}
                        className='my-6  w-10 h-10 rounded-full object-cover'
                      />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <a href='' className='focus:outline-none'>
                      <span className='absolute inset-0' aria-hidden='true'></span>
                      <p className='text-sm font-medium text-slate-800'>
                        {card?.user?.name + ' ' + card?.user?.surname}
                      </p>
                      <p className='text-sm text-slate-400 truncate'>@{card?.user?.username}</p>
                    </a>
                  </div>
                </div>
                <div>
                  <h6 className='text-slate-800 mb-2 text-sm font-semibold leading-5 tracking-[-0.4px]'>
                    About
                  </h6>
                  <p className='text-slate-600 text-sm leading-5 tracking-[-0.4px]'>
                    {card?.user?.about}
                  </p>
                </div>
              </div>
              <div>
                <div className='-mt-px flex border-t border-gray-200 divide-x divide-gray-200'>
                  <div className='w-0 flex-1 flex'>
                    <Link
                      href={
                        card?.user?._id == _user?._id
                          ? 'my-profile'
                          : 'user?userId=' + card?.user?._id
                      }
                    >
                      <a
                        href=''
                        className='relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm tracking-[-0.4px] text-slate-500 font-medium border border-transparent rounded-bl-lg hover:bg-gray-50'
                      >
                        <svg
                          xmlns='http:www.w3.org/2000/svg'
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
                  </div>
                  {_user?._id != card?.user?._id && (
                    <div className='-ml-px w-0 flex-1 flex'>
                      <FollowButton
                        profile={card?.user}
                        followed={isFollowed}
                        setIsFollowedProps={setIsFollowed}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className='my-6' />
        <div
          className='content grid prose prose-h3:text-slate-700 prose-h3:text-base prose-h3:leading-6 prose-h3:tracking-[-0.4px] prose-h3:my-6 prose-a:text-indigo-700 prose-a:no-underline prose-a:font-normal prose-p:text-slate-600 prose-p:my-6 prose-p:text-sm prose-p:leading-5 prose-p:tracking-[-0.4px] max-w-full'
          dangerouslySetInnerHTML={{ __html: card?.content }}
        ></div>

        {card?.forum &&
          commentsToShow?.map((commentItem) => {
            return (
              <div key={commentItem?._id} className='div'>
                <hr className='my-6' />

                <p className='text-xs text-gray-500'>
                  {commentItem?.content}
                  {'  '}-
                  {commentItem?.username === 'anonymous' ? (
                    <a className='text-gray-500'>{commentItem?.username}</a>
                  ) : (
                    <Link href={basePath + '/user?userId=' + commentItem?.user}>
                      <a className='text-blue-500'>{commentItem?.username}</a>
                    </Link>
                  )}
                  {'   ' + formatDate(commentItem?.createdAt, 'dd MMM yyyy')}
                </p>
              </div>
            )
          })}
        <hr className='my-6' />

        {card?.forum && comments?.length > 5 && commentsToShow?.length < 6 && (
          <div onClick={() => setCommentsToShow(comments)} className='w-12/12 text-center '>
            <a className='text-blue-500 text-sm right cursor-pointer'>
              Show {comments.length - 5}+ More{' '}
            </a>{' '}
          </div>
        )}

        {!card?.forum && isAuthenticated && (
          <Link href={'/reply-forum?forumId=' + card?._id}>
            <button
              type='button'
              className='inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <ReplyIcon className='-ml-1 mr-3 h-5 w-5' aria-hidden='true' />
              Reply
            </button>
          </Link>
        )}
        <div className='my-6' />
        {card?.forum && isAuthenticated && (
          <Button
            onClick={() => {
              setCommentOpen((state) => !state)
            }}
            className='inline-flex items-center cursor-pointer'
          >
            <ReplyIcon className='-ml-1 mr-3 h-5 w-5' aria-hidden='true' />
            Comment
          </Button>
        )}
        {commentOpen && (
          <div className=''>
            <form onSubmit={(e) => formSubmit(e)}>
              <textarea
                rows={5}
                className='mt-5 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md'
                label='Enter Your Text Here'
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>

              <Button
                loading={currentButton == card._id && commentLoading}
                type='submit'
                label='Send'
                className='mt-5 inline-flex items-center px-10 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              />
            </form>
          </div>
        )}
        {isCreateCategoryModal && isAuthenticated && (
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
                  <form onSubmit={handleSubmit(handleAddBookmarkCategory)}>
                    <div>
                      <div className='mt-1'>
                        <Input
                          name='name'
                          id='name'
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
                    onClick={handleAddBookmarkCategory}
                    className='inline-flex items-center justify-center px-4 py-2 whitespace-nowrap border border-transparent text-sm font-medium tracking-[-0.4px] rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
