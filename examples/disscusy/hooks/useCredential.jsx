import { CredentialContext } from '@/context/CredentialContext'
import { useContext } from 'react'
const useCredential = () => {
  const ctx = useContext(CredentialContext)
  if (ctx === undefined) {
    throw new Error('Hook must be used within a Provider')
  }
  return ctx
}

export default useCredential
