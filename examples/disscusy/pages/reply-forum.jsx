import React, { useEffect } from 'react'
import Editor from '@/components/Editor'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import useForum from '@/hooks/useForum'
import useAuth from '@/hooks/useAuth'
import Button from '@/components/Button'
import { useRouter } from 'next/router'
import useNotification from '@/hooks/useNotifications'

const ReplyForum = () => {
  const router = useRouter()

  const newForumSchema = yup.object().shape({
    content: yup.string().required('Content is required'),
  })

  const forumId = router.query.forumId

  const { user } = useAuth({
    redirectTo: '/login',
  })
  const {
    replyToForum,
    error,
    loading,
    getForum,
    forum,
    updateForumActivity,
    updateForumRecentUser,
  } = useForum()
  const { sendNotification } = useNotification()
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(newForumSchema),
  })
  const onSubmit = async (data) => {
    await replyToForum({
      username: user.username,
      userProfilePicture: user.profilePicture,
      user: user?._id,
      forum: forumId,
      content: data.content,
    })
    if (!error) {
      if (forum?.user?._id !== user?._id) {
        sendNotification({
          user: forum?.user?._id,
          sentUser: user?._id,
          type: 'reply',
          targetId: forumId,
          sentUsername: user.username,
          sentUserProfilePicture: user.profilePicture,
          targetTitle: forum.title,
        })
      }
      updateForumActivity(forumId)
      updateForumRecentUser({
        _parent: forumId,
        username: user.username,
        profilePicture: user.profilePicture,
        user: user?._id,
      })
      router.push({ pathname: '/forum-detail', query: { id: forumId } })
    }
  }

  const onEditorStateChange = (editorState) => {
    setValue('content', editorState)
  }

  useEffect(() => {
    if (error) {
      setError('content', error.message)
    }
  }, [error])

  useEffect(() => {
    getForum(forumId)
  }, [forumId])

  return (
    <div className='p-4'>
      <div className='max-w-screen-xl mx-auto'>
        <div className='bg-white p-4 md:p-8 rounded-[10px]'>
          <div className='flex flex-col items-center mb-12 md:mb-8 space-y-2'>
            <svg
              className='w-8 h-8 text-slate-400'
              viewBox='0 0 32 32'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M13.3334 5.33334H5.00008C3.15913 5.33334 1.66675 6.82572 1.66675 8.66667V27C1.66675 28.841 3.15913 30.3333 5.00008 30.3333H23.3334C25.1744 30.3333 26.6667 28.841 26.6667 27V18.6667M24.3097 2.97631C25.6115 1.67456 27.722 1.67456 29.0238 2.97631C30.3255 4.27806 30.3255 6.38861 29.0238 7.69036L14.7141 22H10.0001L10.0001 17.286L24.3097 2.97631Z'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <h1 className='text-slate-800 text-xl md:text-2xl font-bold leading-6 sm:leading-7 tracking-[-0.8px] text-center'>
              <span className='text-slate-400'>Reply:</span> {forum ? forum?.title : ''}
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='max-w-[800px] mx-auto'>
              <Editor
                name='content'
                control={control}
                errors={errors.content}
                onEditorStateChange={onEditorStateChange}
              />

              <hr className='my-4 sm:my-6 md:my-10' />
              <div className='flex flex-col-reverse sm:grid sm:grid-cols-2 gap-2 sm:gap-4 md:gap-8'>
                <Button
                  label='Cancel'
                  type='button'
                  className='flex items-center justify-center w-full px-4 py-3 sm:p-4 border border-transparent shadow-sm text-base leading-6 rounded-md tracking-[-0.4px] text-indigo-700 bg-indigo-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                  onClick={() => router.back()}
                />
                <Button
                  label='Reply'
                  type='submit'
                  loading={loading}
                  className='flex items-center justify-center w-full px-4 py-3 sm:p-4 border border-transparent shadow-sm text-base leading-6 rounded-md tracking-[-0.4px] text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReplyForum
