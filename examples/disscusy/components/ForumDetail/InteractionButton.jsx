import Icons from '@/constants/Icons'
import React from 'react'

export default function InteractionButton({ Text, Count = 0, Icon, className, marked }) {
  return (
    <React.Fragment>
      <span
        className={`relative inline-flex items-center px-4 py-1.5 rounded-l-md border border-indigo-700 bg-white text-xs leading-4 tracking-[-0.4px]  focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
          marked
            ? 'text-white bg-indigo-700'
            : 'text-slate-500 group-hover:bg-indigo-700 group-hover:text-white'
        } ${className}`}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className={`${
            marked ? 'text-white' : 'text-pink-700 group-hover:text-white'
          } -ml-1 mr-2 h-5 w-5 `}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth='2'
          aria-hidden='true'
        >
          <path
            {...(Icons[Icon].strokeLinecap && { strokeLinecap: Icons[Icon].strokeLinecap })}
            {...(Icons[Icon].strokeLinejoin && { strokeLinejoin: Icons[Icon].strokeLinejoin })}
            {...(Icons[Icon].d && { d: Icons[Icon].d })}
          />
        </svg>
        {Text}
      </span>
      <span className='-ml-px relative inline-flex items-center px-3 py-1.5 rounded-r-md border border-indigo-700 bg-indigo-700 text-sm font-medium text-white focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'>
        {Count}
      </span>
    </React.Fragment>
  )
}
