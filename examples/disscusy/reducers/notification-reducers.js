const notificationReducer = {
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducer: (state, action) => {
    switch (action.type) {
      case 'GET_NOTIFICATION_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'GET_NOTIFICATION_SUCCESS':
        return {
          ...state,
          notifications: action.payload,
          loading: false,
          error: null,
        }
      case 'GET_NOTIFICATION_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'NOTIFICATION_MARK_AS_READ_REQUESTED':
        return {
          ...state,
          loading: true,
        }
      case 'NOTIFICATION_MARK_AS_READ_SUCCESS':
        return {
          ...state,
          loading: false,
          error: null,
        }
      case 'NOTIFICATION_MARK_AS_READ_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'SEND_NOTIFICATION_REQUESTED':
        return {
          ...state,
          loading: true,
        }
      case 'SEND_NOTIFICATION_SUCCESS':
        return {
          ...state,
          loading: false,
          error: null,
        }
      case 'SEND_NOTIFICATION_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }

      default:
        return state
    }
  },
}
export default notificationReducer
