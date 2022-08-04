import React, { useEffect, useState } from 'react'
import useReply from '@/hooks/useReply'
import useAuth from '@/hooks/useAuth'
import MyTopics from './MyTopics'
import { useRouter } from 'next/router'

const Replies = () => {
  const { user } = useAuth()
  const pageSize = 10
  const router = useRouter()
  const page = router.query.page ?? 1
  const { replies, loading, fetchReplyByUser, countInfo } = useReply()

  const [replyForums, setReplyForums] = useState([])
  useEffect(() => {
    fetchReplyByUser(user?._id, page, pageSize)
  }, [router])
  useEffect(() => {
    setReplyForums([])
    if (replies?.length > 0) {
      replies.forEach((reply) => {
        if (replyForums.some((r) => r._id === reply._id)) {
          return
        }
        setReplyForums((prevState) => [...prevState, reply.forum])
      })
    }
  }, [replies])

  return (
    <MyTopics
      data={replyForums}
      title='Your Replies'
      description='Forums you reply to.'
      loading={loading}
      noDataMessage='You have not replied to any forums yet.'
      count={countInfo?.count}
      page={page}
      pageSize={pageSize}
    />
  )
}

export default Replies
