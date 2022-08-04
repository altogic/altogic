import { useContext } from 'react'
import { FileContext } from '@/context/FileContext'

const useFile = () => {
  const ctx = useContext(FileContext)
  if (ctx === undefined) {
    throw new Error('Hook must be used within a Provider')
  }
  return ctx
}
export default useFile
