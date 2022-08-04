import { DateTime } from 'luxon'

export const diffForumDate = (date) => {
  const now = DateTime.local()
  const dateTime = DateTime.fromISO(date)
  const diff = now.diff(dateTime, ['days', 'hours', 'minutes', 'seconds'])
  if (diff.days > 10) {
    return `${dateTime.toFormat('dd LLL yyyy')}`
  }
  if (diff.days >= 1) {
    return `${diff.days} days ago`
  } else if (diff.hours > 0) {
    return `${diff.hours} hours ago`
  } else if (diff.minutes > 0) {
    return `${diff.minutes} minutes ago`
  } else if (diff.seconds > 0) {
    return `${Math.floor(diff.seconds)} seconds ago`
  } else {
    return 'just now'
  }
}
export const formatDate = (date, format) => {
  const dateTime = DateTime.fromISO(date)
  return `${dateTime.toFormat(format)}`
}
