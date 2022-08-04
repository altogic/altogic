import React, { useEffect, useState } from 'react'
import useProfile from '@/hooks/useProfile'
import useForum from '@/hooks/useForum'
import useReply from '@/hooks/useReply'
import useAuth from '@/hooks/useAuth'
import ForumTable from '../Forum/ForumTable'
import { QuestionMarkCircleIcon } from '@heroicons/react/outline'
import { getUniqueListBy } from '@/utils/utils'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Summary = () => {
  const {
    visitCount,
    totalView,
    votesGiven,
    replyCount,
    forumCount,
    votesReceived,
    getAllStats,
    loading,
  } = useProfile()
  useEffect(() => {
    const getStats = async () => await getAllStats()
    getStats()
  }, [])
  const stats = [
    {
      name: 'Day Visited',
      stat: visitCount,
      desc: 'It represents the day count of the user has visited',
    },
    {
      name: 'Total views',
      stat: totalView,
      desc: "It represents the number of visits to current user's forums",
    },
    {
      name: 'Total Points',
      stat: votesReceived,
      desc: 'It represents the sum of the - and + points received by the user',
    },
    {
      name: 'Votes Given',
      stat: votesGiven,
      desc: 'It represents the likes and dislikes counts of the user has given',
    },
    {
      name: 'Forums Created',
      stat: forumCount,
      desc: 'It represents the forum counts has been created by the user',
    },
    {
      name: 'Replies Posted',
      stat: replyCount,
      desc: 'It represents the reply counts has been created by the user',
    },
  ]
  const { user } = useAuth()
  const { fetchTopForums, topForums } = useForum()
  const { fetchTopReplies, topReplies } = useReply()
  const [repliesForum, setRepliesForum] = useState([])
  useEffect(() => {
    fetchTopForums(user?._id)
    fetchTopReplies(user?._id)
  }, [])
  useEffect(() => {
    topReplies?.forEach((reply) => {
      setRepliesForum((prevState) => [...getUniqueListBy(prevState), reply.forum])
    })
  }, [topReplies])

  return (
    <div className='bg-slate-50 p-4 md:p-6 rounded-[10px]'>
      <div className='flex flex-col sm:flex-row items-center justify-between'>
        <div className='mb-4 sm:mb-0'>
          <h3 className='text-2xl leading-7 font-medium text-slate-800 tracking-[-0.8px]'>
            Profile Summary
          </h3>
          <p className='mt-1 text-slate-500 tracking-[-0.4px]'>See your profile summary.</p>
        </div>
      </div>
      <hr className='my-6' />
      <div>
        <div>
          <dl className='mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-2 sm:gap-4'>
            {stats.map((item) => (
              <div
                key={item.name}
                className={classNames(
                  'flex flex-row sm:flex-col items-center sm:items-start justify-between px-4 py-5 bg-white rounded-lg sm:p-6 relative ',
                  loading && 'animate-pulse cursor-not-allowed',
                )}
              >
                <div className='group hidden lg:flex self-end absolute top-2 right-2'>
                  <QuestionMarkCircleIcon className=' w-5 h-5 text-slate-400' aria-hidden='true' />
                  <div className='hidden rounded-lg p-2 text-xs bg-gray-100 absolute z-50 group-hover:block -mt-6 ml-5 shadow-md w-48'>
                    {item?.desc}
                  </div>
                </div>

                <dt
                  className={classNames(
                    'text-xs sm:text-sm leading-5 text-slate-700 tracking-[-0.4px]',
                    loading
                      ? 'bg-gray-300 w-full h-6 rounded-md'
                      : 'max-w-[58px] sm:max-w-[65px] h-10',
                  )}
                >
                  {!loading && item.name}
                </dt>
                <dd
                  className={classNames(
                    'mt-1 text-2xl sm:text-3xl font-semibold text-slate-600 tracking-[-0.8px]',
                    loading && 'bg-gray-300 w-3/4 h-4 rounded-md',
                  )}
                >
                  {!loading && item.stat}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className='mt-10 md:mt-[88px]'>
        <div className='mb-6 md:mb-8 text-center sm:text-left'>
          <h3 className='text-2xl leading-7 font-medium text-slate-800 tracking-[-0.8px]'>
            Your Top Forums
          </h3>
        </div>
        <ForumTable hasPagination={false} forums={topForums} loading={loading} top />
      </div>
      <div className='mt-10 md:mt-[88px]'>
        <div className='mb-6 md:mb-8 text-center sm:text-left'>
          <h3 className='text-2xl leading-7 font-medium text-slate-800 tracking-[-0.8px]'>
            Your Top Replies
          </h3>
        </div>
        <ForumTable hasPagination={false} forums={repliesForum} loading={loading} top />
      </div>
    </div>
  )
}

export default Summary
