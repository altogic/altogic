import { useEffect } from 'react'
import AuthService from '@/services/auth'
import useAuth from '@/hooks/useAuth'
import Router, { useRouter } from 'next/router'
export default function AuthRedirect(props) {
  const { authStateChange } = useAuth()

  const router = useRouter()
  async function checkProps() {
    if (!props?.error) {
      await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ token: props?.session.token }),
        headers: { 'Content-Type': 'application/json' },
      })
      authStateChange(props?.session, props?.user)
      Router.push('/')
    }
  }

  useEffect(() => {
    checkProps()
    if (router.query.status == 401) {
      alert(router.query.error)
      router.push('/login')
    } else if (router.query.action == 'reset-pwd') {
      router.push({
        pathname: 'set-new-password',
        query: { access_token: router.query.access_token },
      })
    } else if (router.query.action == 'change-email') {
      router.push({
        pathname: 'email-changed',
      })
    }
  }, [])
}
export async function getServerSideProps(context) {
  const response = await AuthService.getAuthGrant(context.query.access_token)
  if (response.user) {
    return {
      props: {
        action: context.query.action,
        error: null,
        user: response.user,
        session: response.session,
      },
    }
  } else {
    return {
      props: {
        action: context.query.action,
        error: response.errors.items[0].message,
      },
    }
  }
}
