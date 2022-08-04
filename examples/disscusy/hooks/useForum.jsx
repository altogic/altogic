import { ForumContext } from '@/context/ForumContext'
import { useContext } from 'react'

const useForum = () => {
  const ctx = useContext(ForumContext)
  if (ctx === undefined) {
    throw new Error('Hook must be used within a Provider')
  }
  return ctx
}
export default useForum
