import { usePagination } from '@/hooks/usePagination'
import React from 'react'
import ForumTable from '../Forum/ForumTable'

function MyTopics({
  data,
  title,
  description,
  loading,
  noDataMessage,
  children,
  count,
  page,
  pageSize,
}) {
  const paginationRange = usePagination({
    pageSize: pageSize,
    currentPage: Number(page),
    totalCount: count,
  })
  return (
    <div className='bg-slate-50 p-4 md:p-6 rounded-[10px]'>
      <div className='mb-8 text-center sm:text-left'>
        <h3 className='text-2xl leading-7 font-medium text-slate-800 tracking-[-0.8px]'>{title}</h3>
        <p className='mt-1 text-slate-500 tracking-[-0.4px]'>{description}</p>
      </div>
      {children}
      {data?.length > 0 ? (
        <ForumTable
          forums={data}
          loading={loading}
          count={count}
          paginationRange={paginationRange}
          page={page}
          pageSize={pageSize}
        />
      ) : (
        <div className='bg-white py-8 px-10 text-slate-500 text-base leading-6 tracking-[-0.4px] text-center'>
          <p>{noDataMessage}</p>
        </div>
      )}
    </div>
  )
}

export default MyTopics
