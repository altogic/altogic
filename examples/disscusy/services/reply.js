import { db, endpoint } from '@/utils/altogic'

const ReplyService = {
  fetchTopReplies: async (userId) => {
    return await db
      .model('reply')
      .filter(`user == '${userId}' && isDeleted == false`)
      .sort('voteCount', 'desc')
      .lookup({ field: 'forum' })
      .limit(10)
      .get()
  },
  fetchRepliesByUser: async (userId, page, pageSize) => {
    return await db
      .model('reply')
      .filter(`user == '${userId}' && isDeleted == false`)
      .lookup({ field: 'forum' })
      .page(page)
      .limit(pageSize)
      .get({ returnCountInfo: true })
  },

  addComment: async (replyData) => {
    return await db.model('reply_comments').create(replyData)
  },

  getComments: async (forumId) => {
    return await endpoint.get(`/reply_comments`, {
      filter: `this.forum == '${forumId}' && this.isDeleted == false`,
    })
  },

  updateReplyLastComment: async (replyId, lastComment) => {
    return await db.model('reply.lastComments').append(lastComment, lastComment._parent)
  },

  getForumReplies: async (forumId, page, pageSize) => {
    return await endpoint.get(`/reply`, {
      sort: 'voteCount:desc',
      page,
      size: pageSize,
      filter: `this.forum._id == '${forumId}' && this.isDeleted == false`,
    })
  },

  increaseReplyShareCounter: async (replyId) => {
    return db
      .model('reply')
      .object(replyId)
      .updateFields([
        {
          field: 'shareCount',
          value: 1,
          updateType: 'increment',
        },
      ])
  },
}

export default ReplyService
