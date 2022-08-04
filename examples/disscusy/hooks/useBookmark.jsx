import { BookmarkContext } from '@/context/BookmarkContext'
import { useContext } from 'react'
const useBookmark = () => {
  const ctx = useContext(BookmarkContext)
  if (ctx === undefined) {
    throw new Error('Hook must be used within a Provider')
  }
  return ctx
}

export default useBookmark
