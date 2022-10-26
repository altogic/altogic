import { Notification } from '../types';
import altogic from '../libs/altogic';

class NotificationService {
	static async getNotifications(userId: string) {
		const { data, errors } = await altogic.db.model('notifications').filter(`belongsTo == '${userId}'`).get();
		return {
			notifications: data as Notification[],
			errors,
		};
	}
	static createNotification(notification: Partial<Notification>) {
		return altogic.db.model('notifications').create(notification);
	}
	static updateNotification(notificationId: string, notification: Partial<Notification>) {
		return altogic.db.model('notifications').object(notificationId).update(notification);
	}
	static markAllAsRead(userId: string) {
		return altogic.db.model('notifications').filter(`belongsTo == '${userId}'`).update({ isRead: true });
	}
}

export default NotificationService;
