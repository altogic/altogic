import React from 'react'
import { useEffect } from 'react'
import MyTopics from './MyTopics'
import useAuth from '@/hooks/useAuth'
import useForum from '@/hooks/useForum'
import { useRouter } from 'next/router'

const MyForums = () => {
  const { user } = useAuth()
  const pageSize = 5
  const router = useRouter()
  const page = router.query.page ?? 1
  const { fetchForumsByUser, forums, loading, countInfo } = useForum()
  useEffect(() => {
    fetchForumsByUser(user?._id, page, pageSize)
  }, [router])

  return (
    <MyTopics
      count={countInfo?.count}
      data={forums}
      title='Your Forums'
      description='Forums you have created.'
      loading={loading}
      noDataMessage='You have not created any forums yet.'
      page={page}
      pageSize={pageSize}
    />
  )
}

export default MyForums
