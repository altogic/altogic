import { auth, db, queue } from '@/utils/altogic'
import { randomInt } from '@/utils/utils'

const credentialService = {
  changePassword: async (newPassword, oldPassword) => {
    return await auth.changePassword(newPassword, oldPassword)
  },

  updateProfile: async (data) => {
    return await queue.submitMessage('62d5cdd2c419b5cec3b0440e', {
      entry: {
        ...data,
      },
    })
  },

  setUserInfoFromDatabase: async () => {
    const { user, errors } = await auth.getUserFromDB()
    if (!errors) {
      auth.setUser(user)
    }
  },

  checkIfUsernameExists: async (username) => {
    return await db.model('users').filter(`username == '${username}'`).compute({
      name: 'count',
      type: 'count',
    })
  },

  deleteUser: async () => {
    Promise.all([
      db
        .model('follower_connection')
        .filter(`followingUser == '${auth.getUser()._id}'`)
        .update({ isDeleted: true }),
      db
        .model('follower_connection')
        .filter(`followerUser == '${auth.getUser()._id}'`)
        .update({ isDeleted: true }),
      db.model('forum_votes').filter(`user == '${auth.getUser()._id}'`).update({ isDeleted: true }),
      db.model('reply_votes').filter(`user == '${auth.getUser()._id}'`).update({ isDeleted: true }),
      db.model('bookmark').filter(`user == '${auth.getUser()._id}'`).update({ isDeleted: true }),
      db
        .model('bookmark_category')
        .filter(`user == '${auth.getUser()._id}'`)
        .update({ isDeleted: true }),
      db
        .model('forum')
        .filter(`user == '${auth.getUser()._id}'`)
        .update({ userProfilePicture: '', username: 'anonymous' }),
      db
        .model('reply')
        .filter(`user == '${auth.getUser()._id}'`), 
      db
        .model('reply.lastComments')
        .filter(`user == '${auth.getUser()._id}'`)
        .update({username: 'anonymous' }),
      db
        .model('reply_comments')
        .filter(`user == '${auth.getUser()._id}'`)
        .update({ username: 'anonymous' }),

      db.model('forum.recentUsers').filter(`user == '${auth.getUser()._id}'`).delete(),
    ])

    return await db
      .model('users')
      .object(auth.getUser()._id)
      .update({
        isDeleted: true,
        name: 'Anonymous',
        surname: 'User',
        email: `${randomInt(10000, 999999)}@email.com`,
        provider: 'deleted',
        providerUserId: randomInt(10000, 999999),
        username: `anonymous${randomInt(10000, 999999)}`,
      })
  },
}

export default credentialService
