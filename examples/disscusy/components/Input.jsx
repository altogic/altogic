import React from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
const Input = ({ label, id, error, register, className, ...rest }) => {
  return (
    <div className='relative'>
      <label
        htmlFor={id}
        className={`block text-base font-medium text-slate-700 ${error && 'text-red-600'}`}
      >
        {label}
      </label>
      <div className='relative mt-2'>
        <input
          id={id}
          className={`appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            error && 'border-red-600 text-red-900 placeholder-red-300 focus:ring-red-600'
          } ${className}`}
          {...register}
          {...rest}
        />
        {error && (
          <ExclamationCircleIcon className='w-8 h-8 absolute inset-y-1 right-0 pr-3 flex items-center pointer-events-none text-red-600' />
        )}
        {error?.message && (
          <span className='inline-block text-sm text-red-600'>
            {error.message.charAt(0).toUpperCase() + error.message.slice(1)}
          </span>
        )}
      </div>
    </div>
  )
}
export default Input
