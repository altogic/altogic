import { useState, useEffect } from 'react'
import Pagination from '../Pagination'
import ForumCard from './ForumCard'

export default function ForumTable({
  hasPagination = true,
  forums,
  top,
  loading,
  operation,
  onEdit,
  onDelete,
  categories,
  page,
  paginationRange,
  count,
  pageSize,
  noDataText,
  urlBasedPagination = true,
  setCurrentPage,
  isReplyTable = false,

}) {
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(forums[0]?._id === undefined)
  }, [forums])

  return (
    <div className='flex flex-col relative'>
      <div className='overflow-x-auto'>
        <div className='inline-block min-w-full align-middle'>
          <div className='overflow-hidden md:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-300'>
              <thead className='bg-slate-100'>
                <tr>
                  <th scope='col' className='p-4 text-left text-xs font-medium text-slate-800'>
                    Forum
                  </th>
                  {!top && (
                    <th
                      scope='col'
                      className='hidden md:table-cell p-4 text-xs font-medium text-slate-800'
                    >
                      Recent
                    </th>
                  )}
                  <th
                    scope='col'
                    className='hidden md:table-cell p-4 text-xs font-medium text-slate-800'
                  >
                    Replies
                  </th>
                  <th
                    scope='col'
                    className='hidden md:table-cell p-4 text-xs font-medium text-slate-800'
                  >
                    View
                  </th>
                  {!top && (
                    <th
                      scope='col'
                      className='hidden md:table-cell p-4 text-xs font-medium text-slate-800'
                    >
                      Last Activity
                    </th>
                  )}
                  {operation && (
                    <th
                      scope='col'
                      className='hidden md:table-cell p-4 text-xs font-medium text-slate-800'
                    >
                      Operations
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {forums?.length ? (
                  forums?.map((forum, index) => (
                    <ForumCard
                      key={index}
                      forum={forum}
                      top={top}
                      loading={loading || isLoading}
                      onEdit={(id, catId) => onEdit(id, catId)}
                      onDelete={(id) => onDelete(id)}
                      operation={operation}
                      categories={categories}
                      isReplyTable={isReplyTable}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      className='whitespace-normal md:whitespace-nowrap py-4 lg:py-7 px-4 text-sm text-center text-slate-800'
                      colSpan='6'
                    >
                      {noDataText ?? "No forum found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {hasPagination && <Pagination setCurrentPage={setCurrentPage} urlBasedPagination={urlBasedPagination} pageSize={pageSize} paginationRange={paginationRange} page={page} count={count} />}
    </div>
  )
}
