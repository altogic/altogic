import { ReplyContext } from '@/context/ReplyContext'
import { useContext } from 'react'

const useReply = () => {
  const ctx = useContext(ReplyContext)
  if (ctx === undefined) {
    throw new Error('Hook must be used within a Provider')
  }
  return ctx
}
export default useReply
