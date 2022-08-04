import { useEffect, useState } from 'react'
import ForumHeader from '@/components/Forum/ForumHeader'
import ForumTable from '@/components/Forum/ForumTable'
import useForum from '@/hooks/useForum'
import { usePagination } from '@/hooks/usePagination'
import { useRouter } from 'next/router'

export default function Home() {
  const { forums, loading, countInfo, fetchForums } = useForum()
  const [fforums, setfforums] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const pageSize = 40
  const router = useRouter()
  const page = router.query.page ?? 1

  const paginationRange = usePagination({
    pageSize: pageSize,
    currentPage: Number(page),
    totalCount: countInfo?.count,
  })
  useEffect(() => {
    if (router.isReady) {
      const fetchData = async () => {
        setIsLoading(true)
        if (router.query.category || router.query.tag || router.query.sort) {
          await fetchForums(
            router.query.page,
            pageSize,
            router.query.category,
            router.query.tag?.toLowerCase().split(' '),
            router.query.sort,
          )
        } else {
          await fetchForums(router.query.page, pageSize)
        }
        setIsLoading(false)
      }
      fetchData()
    }
  }, [router.asPath, router.isReady, router.query.tag])
  useEffect(() => {
    if (!forums && isLoading) {
      setfforums([{}])
    }
    if (forums.length >= 0 && !isLoading) {
      setfforums(forums)
    }
  }, [forums, isLoading])
  return (
    <div className='p-4'>
      <div className='max-w-screen-xl mx-auto'>
        <div className='bg-white p-4 md:p-8 shadow rounded-[10px]'>
          <ForumHeader
            category={router.query.category}
            tags={router.query.tag}
            sort={router.query.sort}
          />
          <hr className='my-4' />
          <ForumTable
            pageSize={pageSize}
            forums={forums.length >= 0 && !isLoading ? fforums : [{}, {}, {}, {}, {}, {}, {}, {}]}
            loading={loading}
            count={countInfo?.count}
            paginationRange={paginationRange}
            page={page}
          />
        </div>
      </div>
    </div>
  )
}
