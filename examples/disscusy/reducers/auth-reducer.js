import { auth } from '@/utils/altogic'
const authReducer = {
  initialState: {
    user: auth.getUser(),
    loading: false,
    error: null,
    signUpError: null,

    isAuthenticated: false,
    resetSuccess: false,
    userBeforeLogin: null,
    emailChanged: false,
    createSuccess: false,
  },
  reducer: (state, action) => {
    switch (action.type) {
      case 'LOGIN_REQUESTED':
        return {
          ...state,
          loading: true,
        }
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          loading: false,
          isAuthenticated: true,
          user: action.payload,
        }
      case 'LOGIN_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'SIGNUP_REQUESTED':
        return {
          ...state,
          loading: true,
          createSuccess: false,
        }
      case 'SIGNUP_FAILED':
        return {
          ...state,
          loading: false,
          signUpError: action.payload,
          createSuccess: false,
        }

      case 'SIGNUP_SUCCESS':
        return {
          ...state,
          loading: false,
          user: action.payload,
          signUpError: null,
          createSuccess: true,
        }
      case 'GET_USER_FROM_DB_REQUESTED':
        return {
          ...state,
          loading: true,
          user: action.payload
        }
      case 'GET_USER_FROM_DB_FAILED':
        return {
          ...state,
          loading: false,
        }

      case 'GET_USER_FROM_DB_SUCCESS':
        return {
          ...state,
          loading: false,
          user: action.payload,
          signUpError: null,
          createSuccess: true,
        }

      case 'FORGOT_PASSWORD_REQUESTED':
        return {
          ...state,
          loading: true,
        }
      case 'FORGOT_PASSWORD_SUCCESS':
        return {
          ...state,
          loading: false,
          user: action.payload,
        }
      case 'FORGOT_PASSWORD_FAILED':
        return {
          ...state,
          error: action.payload,
          loading: false,
        }
      case 'RESET_PASSWORD_REQUESTED':
        return {
          ...state,
          loading: true,
        }
      case 'RESET_PASSWORD_SUCCESS':
        return {
          ...state,
          loading: false,
          resetSuccess: true,
        }
      case 'RESET_PASSWORD_FAILED':
        return {
          ...state,
          error: action.payload,
          loading: false,
        }
      case 'LOGOUT_REQUESTED':
        return {
          ...state,
          loading: true,
        }
      case 'LOGOUT_SUCCESS':
        return {
          ...state,
          loading: false,
          user: null,
          isAuthenticated: false,
        }
      case 'LOGOUT_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }

      case 'SET_USER_FROM_LOCAL_STORAGE':
        return {
          ...state,
          user: action.payload,
          error: null,
        }
      case 'GET_USER_FROM_LOCAL_STORAGE':
        return {
          ...state,
          user: action.payload,
          error: null,
        }

      case 'CHANGE_EMAIL_REQUESTED':
        return {
          ...state,
          error: null,
          loading: true,
        }

      case 'CHANGE_EMAIL_SUCCESS':
        return {
          ...state,
          error: null,
          loading: false,
          emailChanged: true,
        }
      case 'CHANGE_EMAIL_FAILED':
        return {
          ...state,
          error: action.payload,
          loading: false,
          emailChanged: false,
        }
      case 'RESET_EMAIL_CHANGE_DATA':
        return {
          ...state,
          loading: false,
          emailChanged: false,
        }

      default:
        return state
    }
  },
}

export default authReducer
