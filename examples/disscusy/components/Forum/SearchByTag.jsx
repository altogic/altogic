import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Tag from '../Tag'

const SearchByTag = ({ tags }) => {
  const router = useRouter()
  const [searchText, setSearchText] = useState('')

  const handleChange = (event) => {
    setSearchText(event.target.value)
  }

  const removeItemFromSearchArray = (item) => {
    let tempUrl = tags.replace(item, 'rm_this')
    let tagsArray = tempUrl.split(' ')
    tagsArray = tagsArray?.filter((element) => 'rm_this' != element)
    router.query.tag = tagsArray.join(' ')
    if (router.query.tag.length == 0) router.query.tag = []
    router.push(router)
  }

  const handleInsert = (e) => {
    if (e.key === 'Enter' && (!tags || tags?.split(' ').length < 3)) {
      router.query.tag = tags ? `${router.query.tag} ${searchText}` : searchText

      router.push(router)

      setSearchText('')
    }
  }

  return (
    <div className='flex items-center'>
      <input
        className='justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'
        placeholder='Search by Tag'
        value={searchText}
        onChange={handleChange}
        disabled={tags?.split(' ') > 2}
        onKeyDown={handleInsert}
      />

      {tags?.split(' ').map((item) => (
        <Tag
          tag={item}
          selected={true}
          key={item}
          onClick={() => {
            removeItemFromSearchArray(item)
          }}
          className='ml-2 text-xs'
        />
      ))}
    </div>
  )
}

export default SearchByTag
