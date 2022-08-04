import { db, endpoint } from '@/utils/altogic'
const VoteService = {
  async addReplyVote(request) {
    return await endpoint.post('/reply_votes', request)
  },
  async getReplyVotes(replyId) {
    return await db.model('reply_votes').filter(`reply == '${replyId}' && isDeleted == false`).get()
  },
  async getReplyVotesByUser(userId, page, pageSize) {
    return await db
      .model('reply_votes')
      .filter(`user == '${userId}' && isDeleted == false`)
      .lookup({ field: 'forum' })
      .lookup({ field: 'reply' })
      .page(page)
      .limit(pageSize)
      .get({ returnCountInfo: true })
  },
  async addForumVote(request) {
    return await endpoint.post('/forum_votes', request)
  },
  async getForumVotes(replyId) {
    return await db.model('forum_votes').filter(`reply == '${replyId}' && isDeleted == false`).get()
  },
  async getForumVotesByUser(userId, page, pageSize) {
    return await db
      .model('forum_votes')
      .filter(`user == '${userId}' && isDeleted == false`)
      .lookup({ field: 'forum' })
      .page(page)
      .limit(pageSize)
      .get({ returnCountInfo: true })
  },
}
export default VoteService
