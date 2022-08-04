import { ProfileContext } from '@/context/ProfileContext'
import { useContext } from 'react'

const useProfile = () => {
  const ctx = useContext(ProfileContext)
  if (ctx === undefined) {
    throw new Error('Hook must be used within a Provider')
  }
  return ctx
}
export default useProfile
