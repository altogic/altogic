import { auth, db, endpoint } from '@/utils/altogic'
import { lowerCaseFirstLetter, randomInt, replaceTurkishChars } from '@/utils/utils'
import BookmarkService from './bookmark'

const AuthService = {
  user: auth.getUser(),
  async login({ email, password }) {
    return await auth.signInWithEmail(email, password)
  },

  async signUp(formData) {
    const data = await auth.signUpWithEmail(formData.email, formData.password)
    if (data.user) {
      const response = await endpoint.put(`users/${data.user?._id}`, {
        ...formData,
        visitCount: 1,
        followingCount: 0,
        followerCount: 0,
        notification_preferences: ['follow', 'reply', 'comment', 'bookmark', 'vote', 'share'],
      })
      if (response.errors) {
        endpoint.delete(`/users/delete/${data.user?._id}`)
        return {
          ...response,
        }
      }
    }
    return data
  },

  async forgotPassword({ email }) {
    return await auth.sendResetPwdEmail(email)
  },

  async resetPassword({ accessToken, newPassword }) {
    return await auth.resetPwdWithToken(accessToken, newPassword)
  },
  async logout() {
    return await auth.signOut()
  },
  getUser() {
    return auth.getUser()
  },

  async changeEmail(password, email) {
    return await auth.changeEmail(password, email)
  },
  async getAuthGrant(accessToken) {
    return await auth.getAuthGrant(accessToken)
  },
  async authenticateWithProvider(provider) {
    return await auth.signInWithProvider(provider)
  },
  authStateChange(session, user) {
    auth.setSession(session)
    auth.setUser(user)
  },

  async updateVisitCount() {
    if (this.user) {
      return await db
        .model('users')
        .object(this.user._id)
        .update({ visitCount: auth?.getUser().visitCount + 1 })
    }
  },

  async getUserFromDb() {
    const data = await auth.getUserFromDB()
    if (!data.errors) {
      auth.setUser(data.user)
      return data.user
    }
  },

  async setUsernameForProvider() {
    const name = auth.getUser().name
    const nameArray = name && name.split(' ')
    let firstName = name ? nameArray.slice(0, nameArray.length - 1).join(' ') : 'Unnamed'
    let surname = name ? nameArray[nameArray.length - 1] : 'User'

    let username = `${lowerCaseFirstLetter(replaceTurkishChars(surname))}${randomInt(
      10000,
      999999,
    )}`
    BookmarkService.addBookmarkCategory(auth.getUser()._id, 'Unlisted')

    return await db
      .model('users')
      .object(auth.getUser()._id)
      .update({
        name: firstName,
        username: username,
        surname,
        visitCount: 0,
        followingCount: 0,
        followerCount: 0,
        notification_preferences: ['follow', 'reply', 'comment', 'bookmark', 'vote', 'share'],
      })
  },
}

export default AuthService
