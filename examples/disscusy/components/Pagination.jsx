import { useRouter } from 'next/router'

const { ChevronRightIcon, ChevronLeftIcon } = require('@heroicons/react/outline')

const Pagination = ({
  paginationRange,
  count = 0,
  page = 1,
  pageSize,
  urlBasedPagination = true,
  setCurrentPage,
}) => {
  const router = useRouter()
  const handleOtherParameters = () => {
    router.query.reply = []
  }
  const handlePrevious = () => {
    handleOtherParameters()
    if (urlBasedPagination) {
      if (page > 2) {
        --router.query.page
        router.push(router)
      } else if (page == 2) {
        router.query.page = []
        router.push(router)
      }
    } else {
      if (page > 1) setCurrentPage((state) => state - 1)
    }
  }
  const handleNext = () => {
    handleOtherParameters()
    if (urlBasedPagination) {
      if (page < paginationRange[paginationRange?.length - 1]) {
        if (!router.query.page) router.query.page = 1

        ++router.query.page
        router.push(router)
      }
    } else {
      if (page < paginationRange[paginationRange?.length - 1]) setCurrentPage((state) => state + 1)
    }
  }

  const handlePage = (e, pageIndex) => {
    handleOtherParameters()
    if (urlBasedPagination) {
      if (String(pageIndex).includes('..')) return
      if (pageIndex != 1) router.query.page = pageIndex
      else router.query.page = []
      router.push(router)
    } else {
      setCurrentPage(pageIndex)
    }
  }

  return (
    <div className='bg-white px-4 py-8 flex flex-col-reverse md:flex-row items-center justify-between gap-4 border-t border-gray-200 sm:px-6'>
      <div className='flex-1 flex justify-between w-full sm:hidden'>
        <button
          onClick={handlePrevious}
          className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className='ml-3 relative inline-flex items-center px-4 py-2 border border-indigo-700 text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-60'
        >
          Next
        </button>
      </div>
      <div className='flex-1 flex flex-col lg:flex-row items-center justify-between gap-4'>
        <div>
          <p className='text-sm text-gray-700'>
            Showing <span className='font-medium'>{count ? 1 + (page - 1) * pageSize : 0}</span> to{' '}
            <span className='font-medium'>
              {Math.min((page - 1) * pageSize + pageSize, count)}{' '}
            </span>{' '}
            of <span className='font-medium'>{count}</span> results
          </p>
        </div>
        <div className='hidden md:block'>
          <nav
            className='relative inline-flex rounded-md shadow-sm -space-x-px'
            aria-label='Pagination'
          >
            <button
              onClick={handlePrevious}
              className='relative z-[1] inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
            >
              <span className='sr-only'>Previous</span>
              <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
            </button>
            {paginationRange?.map((pageIndex) => (
              <p
                key={pageIndex}
                onClick={(e) => {
                  handlePage(e, pageIndex)
                }}
                aria-current='page'
                className={
                  'cursor-pointer relative inline-flex items-center px-4 py-2 border text-sm font-medium ' +
                  (pageIndex == page
                    ? 'z-[2] bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50')
                }
              >
                {pageIndex}
              </p>
            ))}
            <button
              onClick={handleNext}
              className='relative z-[1] inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
            >
              <span className='sr-only'>Next</span>
              <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
export default Pagination
