import React, { useState, useEffect, useLayoutEffect } from 'react'
import Editor from '@/components/Editor'
import { useForm } from 'react-hook-form'
import { PencilAltIcon } from '@heroicons/react/outline'
import Tag from '@/components/Tag'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Select from '@/components/Select'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import useForum from '@/hooks/useForum'
import useAuth from '@/hooks/useAuth'
import { TAG_REGEX } from '@/constants/constant'
import Router from 'next/router'

export default function NewForum() {
  const newForumSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    content: yup.string().required('Content is required'),
    tags: yup.string().matches(TAG_REGEX, 'Tags must be comma separated'),
    categoryName: yup.string().required('Category is required'),
  })
  const { user } = useAuth({
    redirectTo: '/login',
  })
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    resetField,
    setValue,
  } = useForm({
    resolver: yupResolver(newForumSchema),
  })
  const onSubmit = (data) => {
    data.tags = tags.map((t) => t.toLowerCase())
    data.user = user?._id
    data.username = user.username
    data.userProfilePicture = user.profilePicture
    data.categoryColor = selectedCategory.color
    createForum(data)
  }
  const [tags, setTags] = useState([])
  const [recommendedTags, setRecommendedTags] = useState([])
  const { fetchCategories, categories, createForum } = useForum()
  const [selectedCategory, setSelectedCategory] = useState({})
  useEffect(() => {
    fetchCategories()
  }, [])
  useEffect(() => {
    setRecommendedTags(selectedCategory.recommended_tags)
  }, [selectedCategory])

  useLayoutEffect(() => {
    if (categories.length > 0) {
      setValue('categoryName', categories[0]?.name)
      setSelectedCategory(categories[0])
    }
  }, [categories])

  const handleChange = (e) => {
    const { value } = e.target
    if (e.which === 188 || e.which === 13) {
      if (tags.length < 3) {
        setTags((prevState) => [...prevState, value])
        resetField('tags')
      }
    }
  }
  const checkKeyDown = (e) => {
    if (e.which === 13) e.preventDefault()
  }
  const onEditorStateChange = (editorState) => {
    setValue('content', editorState)
  }

  return (
    <div>
      <div className='p-4'>
        <div className='max-w-screen-xl mx-auto'>
          <div className='bg-white p-4 md:p-8 rounded-[10px]'>
            <div className='flex flex-col items-center mb-12 md:mb-8 space-y-2'>
              <PencilAltIcon className='w-8 h-8 text-slate-400' aria-hidden='true' />
              <h1 className='text-slate-800 text-2xl font-medium leading-7 tracking-[-0.8px]'>
                Create New Forum
              </h1>
              <p className='text-slate-500 text-sm leading-5 tracking-[-0.4px]'>
                Start a forum on any topic.
              </p>
            </div>
            <form
              className='max-w-[800px] mx-auto'
              onSubmit={handleSubmit(onSubmit)}
              onKeyDown={(e) => checkKeyDown(e)}
            >
              <div className='mb-4 md:mb-6'>
                <Input
                  id='title'
                  name='title'
                  error={errors.title}
                  register={register('title')}
                  type='enter-forum-title'
                  autoComplete='enter-forum-title'
                  placeholder='Enter Forum Title'
                  className='appearance-none block w-full px-6 py-6 border border-gray-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg'
                />
              </div>
              <Editor
                name='content'
                control={control}
                errors={errors.content}
                onEditorStateChange={onEditorStateChange}
              />
              <div className='my-4 md:my-6'>
                <Select
                  id='categoryName'
                  name='categoryName'
                  error={errors.categoryName}
                  register={register('categoryName')}
                  autoComplete='category-name'
                  className='block w-full px-4 py-3.5 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                  options={categories}
                  onChange={(e) => {
                    setSelectedCategory(
                      categories.find((category) => category.name === e.target.value),
                    )
                  }}
                />
              </div>
              <div className='flex md:items-center gap-4 relative px-4 py-3.5 mb-4 md:mb-6 border border-gray-300 rounded-md'>
                <span className='whitespace-nowrap text-sm font-medium leading-5 text-slate-600 tracking-[-0.4px]'>
                  Add Tags
                </span>
                <div className='flex flex-wrap items-center gap-2 sm:gap-4'>
                  {tags.map((tag) => (
                    <Tag
                      key={tag}
                      tag={tag}
                      onClick={() => {
                        setTags(tags.filter((t) => t !== tag))
                        setRecommendedTags([...recommendedTags, tag])
                      }}
                      selected
                    />
                  ))}
                </div>
                <Input
                  id='tags'
                  name='tags'
                  error={errors.tags}
                  register={register('tags')}
                  className='new-forum-input border-none shadow-none bg-transparent h-full'
                  onKeyDown={handleChange}
                />
              </div>
              <div>
                <p className='text-gray-500 mb-4 text-xs leading-4 tracking-[-0.4px]'>
                  Recomended Tags
                </p>
                <div className='flex flex-wrap items-center gap-4'>
                  {recommendedTags?.map((tag) => (
                    <Tag
                      key={tag}
                      tag={tag}
                      onClick={() => {
                        if (tags.length < 3) {
                          setTags([...tags, tag])
                          setRecommendedTags(recommendedTags.filter((t) => t !== tag))
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
              <hr className='my-4 sm:my-6 md:my-10' />
              <div className='flex flex-col-reverse sm:grid sm:grid-cols-2 gap-2 sm:gap-4 md:gap-8'>
                <Button
                  label='Cancel'
                  type='button'
                  className='flex items-center justify-center w-full px-4 py-3 sm:p-4 border border-transparent shadow-sm text-base leading-6 rounded-md tracking-[-0.4px] text-indigo-700 bg-indigo-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                  onClick={() => Router.back()}
                />
                <Button
                  label='Create Forum'
                  type='submit'
                  className='flex items-center justify-center w-full px-4 py-3 sm:p-4 border border-transparent shadow-sm text-base leading-6 rounded-md tracking-[-0.4px] text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
// export const getServerSideProps = async ({ req, res }) => {
//   const { user } = req.session

//   if (!user) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: {},
//   }
// }
