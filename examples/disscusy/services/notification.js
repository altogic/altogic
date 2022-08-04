import { db } from '@/utils/altogic'
const NotificationService = {
  getNotifications(userId, filter) {
    return db
      .model('notification')
      .filter(`user == '${userId}' ${filter ? `&& (${filter})` : '&& _id== "0"'}`)
      .limit(50)
      .sort('createdAt', 'desc')
      .get()
  },
  markAsRead(userId) {
    return db
      .model('notification')
      .filter(`user == '${userId}'`)
      .updateFields([
        {
          field: 'isSeen',
          value: true,
          updateType: 'set',
        },
      ])
  },
  addNotification(data) {
    return db.model('notification').create(data)
  },
}
export default NotificationService
