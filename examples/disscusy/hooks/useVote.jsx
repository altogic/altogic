import { VoteContext } from '@/context/VoteContext'
import { useContext } from 'react'

const useVote = () => {
  const ctx = useContext(VoteContext)
  if (ctx === undefined) {
    throw new Error('Hook must be used within a Provider')
  }
  return ctx
}
export default useVote
