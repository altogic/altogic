import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import useForum from '@/hooks/useForum'
import ForumDetailCard from '@/components/ForumDetail/ForumDetailCard'
import useBookmark from '@/hooks/useBookmark'
import useAuth from '@/hooks/useAuth'
import useReply from '@/hooks/useReply'
import useVote from '@/hooks/useVote'
import useProfile from '@/hooks/useProfile'
import { usePagination } from '@/hooks/usePagination'
import Pagination from '@/components/Pagination'
import ClipLoader from 'react-spinners/ClipLoader'
export default function ForumDetail() {
  const router = useRouter()
  const pageSize = 20
  const [isBookmarked, setIsBookmarked] = useState()
  const { user, isAuthenticated } = useAuth()

  const id = router.query.id
  const replyId = router.query.reply

  const { followings, getFollowings } = useProfile()
  const { forumVotes, replyVotes, fetchForumVotesByUser, fetchReplyVotesByUser } = useVote()
  const page = router.query.page ?? 1
  const { getForum, forum: forumInitial, increaseForumVisitCount } = useForum()
  const { getForumReplies, replies, comments, getComments, countInfo, loading } = useReply()
  const [forum, setForum] = useState()
  const [repliesData, setRepliesData] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState()
  const {
    replyBookmarks,
    forumBookmarks,
    fetchForumBookmarks,
    fetchReplyBookmarks,
    fetchBookmarkCategories,
    categories: bookmarkCategories,
  } = useBookmark()

  const checkLocalStorage = (id) => {
    let visitedForums = JSON.parse(localStorage.getItem('visitedForums')) ?? []
    if (!visitedForums?.includes(id)) {
      localStorage.setItem('visitedForums', JSON.stringify([...visitedForums, id]))
      increaseForumVisitCount(id)
    }
  }

  const ref = []

  useEffect(() => {
    if (id) getForumReplies(id, page, pageSize)
  }, [id, page])

  useEffect(() => {
    if (id) {
      getForum(id)
    }
  }, [id])

  useEffect(() => {
    if (router.query.id == forumInitial?._id) setForum(forumInitial)
  }, [forumInitial])
  useEffect(() => {
    if (id && isLoggedIn) {
      fetchForumBookmarks(user?._id)
      fetchReplyBookmarks(user?._id)
      fetchBookmarkCategories(user?._id)
      getFollowings(user?._id)
      fetchForumVotesByUser(user?._id)
      fetchReplyVotesByUser(user?._id)
      getComments(id)
      checkLocalStorage(id)
    }
  }, [id, isLoggedIn])

  useEffect(() => {
    if (replyId && ref[replyId - 1]) {
      ref[replyId - 1].scrollIntoView()
    }
  }, [replyId, ref])

  useEffect(() => {
    if (forumBookmarks?.some((bk) => bk.forum?._id === router.query.id)) {
      setIsBookmarked(true)
    }
  }, [forumBookmarks, router.query.id])

  useEffect(() => setIsLoggedIn(isAuthenticated), [isAuthenticated])

  useLayoutEffect(() => {
    const temp = replies?.map((reply) => {
      if (replyBookmarks?.some((bk) => bk.reply._id === reply._id)) {
        reply.bookmarked = true
      } else {
        reply.bookmarked = false
      }
      return reply
    })
    setRepliesData(temp)
  }, [replyBookmarks, replies])
  const paginationRange = usePagination({
    pageSize: pageSize,
    currentPage: Number(page),
    totalCount: countInfo?.count,
  })

  return (
    <>
      {loading ? (
        <ClipLoader
          color='#4338CA'
          loading={loading}
          size={100}
          cssOverride={{
            display: 'block',
            margin: 'auto',
            position: 'absolute',
            top: '50%',
            left: '40%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ) : (
        <div className='p-4'>
          <div className='max-w-screen-xl mx-auto space-y-4'>
            <div className='bg-white p-4 md:p-8 rounded-[10px]'>
              <ForumDetailCard
                card={forum}
                bookmarked={isBookmarked}
                comments={comments.filter((cm) => cm.forum === id && !('reply' in cm))}
                bookmarkCategories={bookmarkCategories}
                voted
                followings={followings}
                upVoted={forumVotes.some(
                  (vote) => vote.forum?._id === router.query.id && vote.voteType === 'Up',
                )}
                downVoted={forumVotes.some(
                  (vote) => vote.forum?._id === router.query.id && vote.voteType === 'Down',
                )}
                isAuthenticated={isLoggedIn}
              />
            </div>

            {repliesData?.map((reply, index) => (
              <div
                ref={(el) => (ref[index] = el)}
                key={reply._id}
                className='bg-white p-4 md:p-8 rounded-[10px]'
              >
                <ForumDetailCard
                  card={reply}
                  index={index + 1}
                  comments={comments.filter((cm) => cm.reply === reply._id)}
                  bookmarkCategories={bookmarkCategories}
                  bookmarked={reply.bookmarked}
                  followings={followings}
                  upVoted={replyVotes.some(
                    (vote) => vote.reply._id === reply._id && vote.voteType === 'Up',
                  )}
                  downVoted={replyVotes.some(
                    (vote) => vote.reply._id === reply._id && vote.voteType === 'Down',
                  )}
                  isAuthenticated={isLoggedIn}
                />
              </div>
            ))}

            <Pagination
              pageSize={pageSize}
              paginationRange={paginationRange}
              page={page}
              count={countInfo?.count}
            />
          </div>
        </div>
      )}
    </>
  )
}
