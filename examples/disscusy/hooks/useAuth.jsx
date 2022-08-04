import { AuthContext } from '@/context/AuthContext'
import Router from 'next/router'
import { useContext, useEffect } from 'react'
import { auth } from '@/utils/altogic'
const useAuth = ({ redirectTo = '' } = {}) => {
  const ctx = useContext(AuthContext)

  useEffect(() => {
    if (!ctx.isAuthenticated && redirectTo) {
      Router.push(redirectTo)
    }
  }, [ctx.isAuthenticated])

  useEffect(() => {
    if (ctx) ctx.isAuthenticated = auth.getUser() && auth.getSession() ? true : false
  }, [ctx])
  if (ctx === undefined) {
    throw new Error('Hook must be used within a Provider')
  }
  return ctx
}

export default useAuth
