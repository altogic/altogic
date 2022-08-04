import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'

import { useRouter } from 'next/router'
import useForum from '@/hooks/useForum'
import useReply from '@/hooks/useReply'
import ForumTable from '@/components/Forum/ForumTable'
import useProfile from '@/hooks/useProfile'
import FollowButon from '@/components/FollowButton'
import DefaultAvatar from '@/components/MyProfile/DefaultAvatar'
import useAuth from '@/hooks/useAuth'
import ClipLoader from 'react-spinners/ClipLoader'
import { getUniqueListBy } from '@/utils/utils'

export default function ProfileDetail() {
  const router = useRouter()
  const { user } = useAuth({
    redirectTo: '/login',
  })

  const userId = router.query.userId
  const {
    profile,
    getProfile,
    getForumCount,
    getReplyCount,
    getVotesReceived,
    votesReceived,
    replyCount,
    forumCount,
    getFollowConnection,
    followings,
    loading,
  } = useProfile()

  const stats = [
    { name: 'Total Vote Received', stat: votesReceived },
    { name: 'Total Forum Created', stat: forumCount },
    { name: 'Total Reply Created', stat: replyCount },
  ]

  const { fetchTopForums, topForums } = useForum()
  const { fetchTopReplies, topReplies } = useReply()
  const [repliesForum, setRepliesForum] = useState([])

  useEffect(() => {
    if (userId == user?._id) {
      router.push('/my-profile')
    }
    if (userId) {
      getProfile(userId)
      fetchTopForums(userId)
      fetchTopReplies(userId)
      getForumCount(userId)
      getReplyCount(userId)
      getVotesReceived(userId)
      getFollowConnection(user?._id, userId)
    }
  }, [userId])
  useEffect(() => {
    setRepliesForum([])
    topReplies?.forEach((reply) => {
      setRepliesForum((prevState) => [...getUniqueListBy(prevState), reply.forum])
    })
  }, [topReplies])

  return (
    <>
      {loading ? (
        <ClipLoader
          size={150}
          color={'#4338CA'}
          loading={loading}
          cssOverride={{
            display: 'block',
            margin: 'auto',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ) : (
        <Layout>
          <div className='sm:p-4'>
            <div className='max-w-screen-xl mx-auto'>
              <div className='bg-white rounded-[10px]'>
                <img
                  className='w-full h-36 md:h-44 object-cover rounded-bl-[10px] rounded-br-[10px] sm:rounded-[10px]'
                  src={
                    profile?.username === 'anonymous' || !profile?.headerImage
                      ? 'https://images.unsplash.com/photo-1567360425618-1594206637d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80'
                      : profile?.headerImage
                  }
                  alt=''
                />
                {profile?.profilePicture ? (
                  <img
                    className='relative w-[120px] h-[120px] md:w-36 md:h-36 -mt-[60px] md:-mt-[73px] mx-auto lg:ml-16 object-cover border-4 border-white rounded-full z-10'
                    src={
                      profile?.username === 'anonymous'
                        ? '/default-avatar.jpeg'
                        : profile?.profilePicture
                    }
                    alt='Profile'
                  />
                ) : (
                  <DefaultAvatar
                    name={profile?.username}
                    className='relative w-[120px] h-[120px] md:w-36 md:h-36 -mt-[60px] md:-mt-[73px] mx-auto lg:ml-16 object-cover border-4 border-white rounded-full z-10 text-5xl'
                  />
                )}
                <div className='p-4 lg:pb-20 lg:px-16'>
                  <div className='bg-slate-50 p-4 md:p-6 rounded-[10px]'>
                    <div className='flex flex-col sm:flex-row items-center justify-between'>
                      <div className='mb-4 sm:mb-0'>
                        <h3 className='text-2xl leading-7 font-medium text-slate-800 tracking-[-0.8px]'>
                          {profile?.name + ' '} {profile?.surname ? profile?.surname : ''}
                        </h3>
                        <p className='mt-1 text-lg leading-7 text-slate-400 tracking-[-0.4px]'>
                          @{profile?.username}
                        </p>
                      </div>
                      <div className='flex items-center justify-between w-full sm:w-auto sm:justify-center gap-1 sm:gap-3'>
                        <FollowButon
                          rounded={true}
                          profile={profile}
                          followed={followings.length}
                        />
                      </div>
                    </div>
                    <hr className='my-6' />
                    <div>
                      <h3 className='text-lg leading-7 font-medium text-slate-600 tracking-[-0.4px]'>
                        About
                      </h3>

                      <p className='mt-1 text-md leading-7 text-slate-500 tracking-[-0.4px]'>
                        {profile?.about}
                      </p>
                    </div>
                    <hr className='my-6' />
                    <div>
                      <h3 className='text-lg leading-7 font-medium text-slate-600 tracking-[-0.4px]'>
                        Profile Summary
                      </h3>
                      <dl className='mt-5 grid grid-cols-1 gap-3 md:gap-4 sm:grid-cols-3'>
                        {stats.map((item, index) => (
                          <div
                            key={index}
                            className='flex flex-row md:flex-col items-center md:items-start justify-between py-3 px-4 md:p-4 bg-white shadow rounded-lg overflow-hidden sm:p-6'
                          >
                            <dt className='text-sm text-slate-700 tracking-[-0.4px] truncate'>
                              {item.name}
                            </dt>
                            <dd className='md:mt-1 text-2xl md:text-3xl font-semibold text-slate-600 tracking-[-0.8px]'>
                              {item.stat}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    <div className='mt-10 md:mt-[88px]'>
                      <div className='mb-6 md:mb-8 text-center sm:text-left'>
                        <h3 className='text-2xl leading-7 font-medium text-slate-800 tracking-[-0.8px]'>
                          {`${profile?.name} ${profile?.surname}'s  Top Forums`}
                          {}
                        </h3>
                      </div>
                      <ForumTable hasPagination={false} forums={topForums} top />
                    </div>
                    <div className='mt-10 md:mt-[88px]'>
                      <div className='mb-6 md:mb-8 text-center sm:text-left'>
                        <h3 className='text-2xl leading-7 font-medium text-slate-800 tracking-[-0.8px]'>
                          {profile && `${profile?.name + ' ' + profile?.surname}’s Top Reply`}
                        </h3>
                      </div>
                      <ForumTable hasPagination={false} forums={repliesForum} top />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      )}
    </>
  )
}
