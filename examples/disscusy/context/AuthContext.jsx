import { createContext, useReducer } from 'react'
import { useRouter } from 'next/router'
import authReducer from '@/reducers/auth-reducer'
import authService from '@/services/auth'
import BookmarkService from '@/services/bookmark'
export const AuthContext = createContext('')

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer.reducer, authReducer.initialState)
  const router = useRouter()

  if (typeof window !== 'undefined') {
    if (
      !localStorage.getItem('lastLogin') ||
      localStorage.getItem('lastLogin') !== new Date().toDateString()
    ) {
      authService.updateVisitCount()
    }
    localStorage.setItem('lastLogin', new Date().toDateString())
  }

  const setUserFromLocalStorage = () => {
    dispatch({ type: 'SET_USER_FROM_LOCAL_STORAGE', payload: authService.getUser() })
  }
  const getUser = () => {
    dispatch({ type: 'GET_USER_FROM_LOCAL_STORAGE', payload: authService.getUser() })
  }

  const login = async (request) => {
    dispatch({ type: 'LOGIN_REQUESTED' })

    const data = await authService.login(request)
    if (!data.errors) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: data.user,
      })
      router.push('/')
    } else {
      dispatch({
        type: 'LOGIN_FAILED',
        payload: data.errors.items,
      })
    }
  }

  const signUp = async (request) => {
    dispatch({ type: 'SIGNUP_REQUESTED' })
    const { user, errors } = await authService.signUp(request)
    if (!errors) {
      dispatch({
        type: 'SIGNUP_SUCCESS',
        payload: user,
      })
      await BookmarkService.addBookmarkCategory(user._id, 'Unlisted')
    } else {
      dispatch({
        type: 'SIGNUP_FAILED',
        payload: errors.items,
      })
    }
  }
  const forgotPassword = async (request) => {
    dispatch({ type: 'FORGOT_PASSWORD_REQUESTED' })
    const { data, errors } = await authService.forgotPassword(request)
    if (!errors) {
      dispatch({
        type: 'FORGOT_PASSWORD_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FORGOT_PASSWORD_FAILED',
        payload: errors.items,
      })
    }
  }
  const resetPassword = async (request) => {
    dispatch({ type: 'RESET_PASSWORD_REQUESTED' })

    const { data, errors } = await authService.resetPassword(request)
    if (!errors) {
      dispatch({
        type: 'RESET_PASSWORD_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'RESET_PASSWORD_FAILED',
        payload: errors.items,
      })
    }
  }
  const logout = async () => {
    dispatch({ type: 'LOGOUT_REQUESTED' })
    const { data, errors } = await authService.logout()
    if (!errors) {
      dispatch({
        type: 'LOGOUT_SUCCESS',
        payload: data,
      })
      router.push('/')
    } else {
      dispatch({
        type: 'LOGOUT_FAILED',
        payload: errors.items,
      })
    }
  }

  const changeEmail = async (password, newEmail) => {
    dispatch({ type: 'CHANGE_EMAIL_REQUESTED' })

    const { errors } = await authService.changeEmail(password, newEmail)

    if (!errors) {
      dispatch({ type: 'CHANGE_EMAIL_SUCCESS' })
    } else {
      dispatch({ type: 'CHANGE_EMAIL_FAILED', payload: errors.items })
    }
  }

  const authenticateWithProvider = async (provider) => {
    await authService.authenticateWithProvider(provider)
  }

  const authStateChange = async (newSession, newUser) => {
    authService.authStateChange(newSession, newUser)
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: newUser,
    })
    if (!newUser.username) {
      const data = await authService.setUsernameForProvider()
      if (!data.errors) {
        await authService.getUserFromDb()
        setUserFromLocalStorage()
      }
    }
  }
  const getUserFromDb = async () => {
    const data = await authService.getUserFromDb()
    if (!data.errors) {
      dispatch({
        type: 'GET_USER_FROM_DB_SUCCESS',
        payload: data.user,
      })
    } else {
      dispatch({
        type: 'GET_USER_FROM_DB_FAILED',
        payload: data.errors.items,
      })
    }
  }
  const resetEmailChangeData = () => {
    dispatch({ type: 'RESET_EMAIL_CHANGE_DATA' })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signUp,
        forgotPassword,
        resetPassword,
        logout,
        setUserFromLocalStorage,
        changeEmail,
        authStateChange,
        authenticateWithProvider,
        getUser,
        resetEmailChangeData,
        getUserFromDb,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export default AuthProvider
