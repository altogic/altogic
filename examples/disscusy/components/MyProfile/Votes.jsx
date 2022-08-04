import useAuth from '@/hooks/useAuth'
import { usePagination } from '@/hooks/usePagination'
import useVote from '@/hooks/useVote'

import React, { useEffect, useState } from 'react'
import ForumTable from '../Forum/ForumTable'

const Votes = () => {
  const {
    replyVotes,
    forumVotes,
    fetchForumVotesByUser,
    fetchReplyVotesByUser,
    loading,
    forumCountInfo,
    replyCountInfo,
  } = useVote()
  const { user } = useAuth()
  const [forums, setForums] = useState([])
  const [replies, setReplies] = useState([])
  const pageSize = 10

  const [currentPage, setCurrentPage] = useState(1)
  const [secondCurrentPage, setSecondCurrentPage] = useState(1)

  useEffect(() => {
    fetchForumVotesByUser(user?._id, currentPage, pageSize)
    fetchReplyVotesByUser(user?._id, secondCurrentPage, pageSize)
  }, [user, currentPage, secondCurrentPage])
  useEffect(() => {
    forumVotes?.forEach((vote) => {
      if (!forums.some((forum) => forum._id === vote.forum._id)) {
        setForums((forums) => [...forums, vote.forum])
      }
    })
  }, [forumVotes])
  useEffect(() => {
    setReplies([])
    replyVotes?.forEach((vote) => {
      vote.forum.reply_link = vote.reply_link
      setReplies((prevState) => [...prevState, {...vote.forum, reply:vote.reply}])
    })
  }, [replyVotes])

  const paginationRangeForum = usePagination({
    pageSize: pageSize,
    currentPage: currentPage,
    totalCount: forumCountInfo?.count,
  })
  const paginationRangeReply = usePagination({
    pageSize: pageSize,
    currentPage: secondCurrentPage,
    totalCount: replyCountInfo?.count,
  })

  return (
    <div className='bg-slate-50 p-4 md:p-6 rounded-[10px]'>
      <div className='mb-8 text-center sm:text-left'>
        <h3 className='text-2xl leading-7 font-medium text-slate-800 tracking-[-0.8px]'>
          Your Votes
        </h3>
      </div>
      <div className='mt-10 md:mt-[88px]'>
        <div className='mb-6 md:mb-8 text-center sm:text-left'>
          <p className='mt-1 text-slate-500 tracking-[-0.4px]'>Forums you voted.</p>
        </div>
        <ForumTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          urlBasedPagination={false}
          forums={forums}
          noDataText={'You have not voted on any forums.'}
          loading={loading}
          count={forumCountInfo?.count}
          paginationRange={paginationRangeForum}
          page={currentPage}
          pageSize={pageSize}
        />
      </div>
      <div className='mt-10 md:mt-[88px]'>
        <div className='mb-6 md:mb-8 text-center sm:text-left'>
          <p className='mt-1 text-slate-500 tracking-[-0.4px]'>Replies you voted.</p>
        </div>
        <ForumTable
          isReplyTable={true}
          currentPage={secondCurrentPage}
          setCurrentPage={setSecondCurrentPage}
          urlBasedPagination={false}
          noDataText={'You have not voted on any replies.'}
          forums={replies}
          loading={loading}
          count={replyCountInfo?.count}
          paginationRange={paginationRangeReply}
          page={secondCurrentPage}
          pageSize={pageSize}
        />
      </div>
    </div>
  )
}

export default Votes
