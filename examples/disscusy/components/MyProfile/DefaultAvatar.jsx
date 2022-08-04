import React from 'react'

function DefaultAvatar({ name, className }) {
  return (
    <div className={`rounded-full bg-gray-400 flex items-center justify-center ${className}`}>
      <span className='text-white'>{name?.charAt(0).toUpperCase()}</span>
    </div>
  )
}

export default DefaultAvatar
