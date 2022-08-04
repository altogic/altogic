import React from 'react'
import { XIcon, PlusIcon } from '@heroicons/react/solid'
import Button from './Button'
function Tag({ tag, onClick, selected, className }) {
  return (
    <Button
      type='button'
      onClick={!selected ? onClick : () => {}}
      className={`inline-flex items-center  border border-transparent shadow-sm text-sm leading-5 rounded-md tracking-[-0.4px]  ${
        !selected
          ? 'px-3 py-2 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 '
          : 'px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm  text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 '
      }${className}`}
    >
      {!selected ? (
        <PlusIcon className='mr-2 h-5 w-5 text-gray-400' aria-hidden='true' />
      ) : (
        <XIcon
          onClick={onClick}
          className='mr-2 h-4 w-4 sm:h-5 sm:w-5 hover:text-indigo-300'
          aria-hidden='true'
        />
      )}
      {tag}
    </Button>
  )
}

export default Tag
