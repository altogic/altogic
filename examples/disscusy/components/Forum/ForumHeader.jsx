import { RefreshIcon } from '@heroicons/react/outline'
import CategoryMenu from './CategoryMenu'
import SortMenu from './SortMenu'
import SearchByTag from './SearchByTag'
import useForum from '@/hooks/useForum'
export default function ForumHeader({ category, tags, sort }) {
  const { fetchForums } = useForum()
  return (
    <div className='flex flex-wrap items-center lg:justify-between'>
      <div className='flex flex-wrap items-center gap-4'>
        <CategoryMenu category={category} tags={tags} sort={sort} />
        <SearchByTag tags={tags} />
      </div>
      <div className='flex items-center gap-4'>
        <button
          type='button'
          className='hidden lg:inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          onClick={() => {
            fetchForums(1, 40, '', [], 'createdAt:desc')
          }}
        >
          <RefreshIcon className='-ml-0.5 mr-2 h-4 w-4' aria-hidden='true' />
          Refresh
        </button>
        <SortMenu />
      </div>
    </div>
  )
}
