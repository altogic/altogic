import { createContext, useReducer } from 'react'
import notificationReducer from '@/reducers/notification-reducers'
import notificationService from '@/services/notification'
export const NotificationContext = createContext()

const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    notificationReducer.reducer,
    notificationReducer.initialState,
  )
  const getNotification = async (userId, filter) => {
    dispatch({
      type: 'GET_NOTIFICATION_REQUESTED',
    })
    const { data, errors } = await notificationService.getNotifications(userId, filter)
    if (!errors) {
      dispatch({
        type: 'GET_NOTIFICATION_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'GET_NOTIFICATION_FAILED',
        payload: errors.items,
      })
    }
  }
  const markAsRead = async (userId) => {
    dispatch({
      type: 'NOTIFICATION_MARK_AS_READ_REQUESTED',
    })
    const { errors } = await notificationService.markAsRead(userId)
    if (!errors) {
      dispatch({
        type: 'NOTIFICATION_MARK_AS_READ_SUCCESS',
      })
    } else {
      dispatch({
        type: 'NOTIFICATION_MARK_AS_READ_FAILED',
        payload: errors.items,
      })
    }
  }
  const sendNotification = async (notificationData) => {
    dispatch({ type: 'SEND_NOTIFICATION_REQUESTED' })
    const { error, response } = notificationService.addNotification(notificationData)
    if (!error) {
      dispatch({
        type: 'SEND_NOTIFICATION_SUCCESS',
        payload: response,
      })
    } else {
      dispatch({
        type: 'SEND_NOTIFICATION_FAILED',
        payload: error.items,
      })
    }
  }
  return (
    <NotificationContext.Provider
      value={{
        ...state,
        getNotification,
        markAsRead,
        sendNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
export default NotificationProvider
