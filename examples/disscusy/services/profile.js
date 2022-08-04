import { auth, db } from '@/utils/altogic'

const ProfileServices = {
  getVisitCount: () => {
    return auth.getUser().visitCount
  },
  getTotalView: async (userId) => {
    return db
      .model('forum')
      .filter(`user == '${userId}'`)
      .compute({ name: 'viewCount', type: 'sum', expression: 'viewCount' })
  },

  getVotesGivenToReply: async (userId) => {
    return await db
      .model('reply_votes')
      .filter(`user == '${userId}'`)
      .compute({ name: 'count', type: 'count' })
  },

  getVotesGivenToForum: async (userId) => {
    return await db
      .model('forum_votes')
      .filter(`user == '${userId}'`)
      .compute({ name: 'count', type: 'count' })
  },
  getForumCount: async (userId) => {
    return await db
      .model('forum')
      .filter(`user == '${userId}'`)
      .compute({ name: 'count', type: 'count' })
  },
  getReplyCount: async (userId) => {
    return await db
      .model('reply')
      .filter(`user == '${userId}'`)
      .compute({ name: 'count', type: 'count' })
  },
  getVotesReceived: async (userId) => {
    const forum = await db
      .model('forum')
      .filter(`user == '${userId}'`)
      .compute({ name: 'count', type: 'sum', expression: 'voteCount' })

    const reply = await db
      .model('reply')
      .filter(`user == '${userId}'`)
      .compute({ name: 'count', type: 'sum', expression: 'voteCount' })
    return {
      forum,
      reply,
    }
  },

  getFollowers: async (userId, page, pageSize) => {
    return await db
      .model('follower_connection')
      .filter(`followingUser == "${userId}" && isDeleted == false`)
      .limit(pageSize)
      .page(page)
      .get({ returnCountInfo: true })
  },
  getFollowings: async (userId, page, pageSize) => {
    return await db
      .model('follower_connection')
      .filter(`followerUser == "${userId}" && isDeleted == false`)
      .limit(pageSize)
      .page(page)
      .get({ returnCountInfo: true })
  },
  getFollowConnection: async (follower, following) => {
    return await db
      .model('follower_connection')
      .filter(
        `followerUser == "${follower}" && followingUser == "${following}" && isDeleted == false`,
      )
      .get()
  },

  getProfile: async (userId) => {
    return await db.model('users').object(userId).get()
  },

  followProfile: async (followerUser, followingUser) => {
    return db.model('follower_connection').create({
      followerName: `${followerUser.name} ${followerUser.surname}`,
      followerUsername: followerUser.username,
      followerUserProfilePicture: followerUser.profilePicture,
      followerUser: followerUser?._id,
      followerUserAbout: followerUser.about,
      followingName: `${followingUser.name} ${followingUser.surname}`,
      followingUsername: followingUser.username,
      followingUserProfilePicture: followingUser.profilePicture,
      followingUser: followingUser?._id,
      followingUserAbout: followingUser.about,
    })
  },

  unfollowProfile: async (followerUser, followingUser) => {
    return db
      .model('follower_connection')
      .filter(
        'followerUser == "' +
          followerUser?._id +
          '" && followingUser == "' +
          followingUser?._id +
          '"',
      )
      .delete()
  },
}

export default ProfileServices
