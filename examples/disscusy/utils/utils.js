export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
export function randomString(length) {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
export function lowerCaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1)
}
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export function getUniqueListBy(arr) {
  return [...new Map(arr.map((item) => [item?._id, item])).values()]
}
export function notificationQueryBuilder(notificationPreferences) {
  let query = ''
  notificationPreferences?.forEach((pref, index) => {
    if (index === 0) {
      query += `type == '${pref}'`
    } else query += ` || type == '${pref}'`
  })
  return query
}
export function replaceTurkishChars(str) {
  return str
    .replace(/[Ç]/g, 'C')
    .replace(/[Ğ]/g, 'G')
    .replace(/[İ]/g, 'I')
    .replace(/[Ö]/g, 'O')
    .replace(/[Ş]/g, 'S')
    .replace(/[Ü]/g, 'U')
}
