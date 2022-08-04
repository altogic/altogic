import { auth } from '@/utils/altogic'
const credentialReducer = {
  initialState: {
    user: auth.getUser(),
    loading: false,
    error: null,
    updateProfileLoading: false,
    changePasswordLoading: false,
    changePasswordSuccess: false,
    isUsernameAvailable: true,
  },
  reducer: (state, action) => {
    switch (action.type) {
      case 'REQUESTED':
        return {
          ...state,
          error: null,
          loading: true,
        }
      case 'CHANGE_PASSWORD_REQUESTED':
        return {
          ...state,
          error: null,
          changePasswordLoading: true,
          changePasswordSuccess: false,
        }
      case 'CHANGE_PASSWORD_SUCCESS':
        return {
          ...state,
          error: null,
          changePasswordLoading: false,
          changePasswordSuccess: true,
        }
      case 'CHANGE_PASSWORD_FAILED':
        return {
          ...state,
          error: action.payload,
          changePasswordLoading: false,
        }

      case 'PROFILE_UPDATE_REQUESTED':
        return {
          ...state,
          error: null,
          updateProfileLoading: true,
        }

      case 'PROFILE_UPDATE_SUCCESS':
        return {
          ...state,
          error: null,
          updateProfileLoading: false,
        }
      case 'PROFILE_UPDATE_FAILED':
        return {
          ...state,
          error: action.payload,
          updateProfileLoading: false,
        }

      case 'DELETE_USER_SUCCESS':
        return {
          ...state,
          error: null,
          loading: false,
        }
      case 'DELETE_USER_FAILED':
        return {
          ...state,
          error: action.payload,
          loading: false,
        }
      case 'CHECK_USERNAME_REQUESTED':
        return {
          ...state,
          error: null,
          loading: true,
        }
      case 'CHECK_USERNAME_SUCCESS':
        return {
          ...state,
          error: null,
          loading: false,
          isUsernameAvailable: action.payload,
        }
      case 'CHECK_USERNAME_FAILED':
        return {
          ...state,
          error: action.payload,
          loading: false,
        }

      default:
        return state
    }
  },
}

export default credentialReducer
