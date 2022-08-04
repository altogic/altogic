import { NotificationContext } from '@/context/NotificationContext'
import { useContext } from 'react'

const useNotification = () => {
  const ctx = useContext(NotificationContext)
  if (ctx === undefined) {
    throw new Error('Hook must be used within a Provider')
  }
  return ctx
}
export default useNotification
