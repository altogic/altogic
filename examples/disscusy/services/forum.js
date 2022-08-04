import { db, endpoint } from '@/utils/altogic'

const ForumService = {
  searchForum: async (searchTerm) => {
    return await endpoint.post('forum/search', { text: searchTerm })
  },

  fetchForums: async (
    page = null,
    pageLimit = null,
    categoryName = '',
    tags = [],
    sortExp = 'createdAt:desc',
  ) => {
    let queryString = ''
    if (tags.length) {
      tags.forEach((el, index) => {
        queryString += `IN(this.tags, '${el}')`
        if (index != tags.length - 1) {
          queryString += ' || '
        }
      })
    }
    return await endpoint.get('/forum', {
      page: page,
      size: pageLimit,
      filter: `this.isDeleted == false ${
        categoryName ? `&& this.categoryName == "${categoryName}"` : ''
      } ${tags.length ? `&& ${queryString}` : ''}`,
      sort: sortExp,
    })
  },

  sortForums: async (sortingItem, method) => {
    return await endpoint.get(`/forum`, {
      sort: `${sortingItem}:${method}`,
    })
  },

  fetchCategories: async () => {
    return await endpoint.get('/category')
  },
  getForum: async (forumId) => {
    return await endpoint.get(`/forum/${forumId}`, {
      isDeleted: false,
    })
  },

  createForum: async (forum) => {
    return db.model('forum').create(forum)
  },
  increaseForumShareCounter: async (forumId) => {
    return db
      .model('forum')
      .object(forumId)
      .updateFields([
        {
          field: 'shareCount',
          value: 1,
          updateType: 'increment',
        },
      ])
  },
  fetchTopForums: async (userId) => {
    return await db
      .model('forum')
      .filter(`user == '${userId}' && isDeleted == false`)
      .sort('viewCount', 'desc')
      .limit(10)
      .get()
  },
  fetchForumsByUser: async (userId, page, pageSize) => {
    return await db
      .model('forum')
      .filter(`user == '${userId}'`)
      .page(page)
      .limit(pageSize)
      .get({ returnCountInfo: true })
  },
  updateForumActivity: async (forumId) => {
    return await db
      .model('forum')
      .object(forumId)
      .updateFields([
        {
          field: 'lastActivityAt',
          updateType: 'set',
          value: new Date(),
        },
      ])
  },
  updateForumVisitCount: async (forumId, viewCount) => {
    return await db.model('forum').object(forumId).update({ viewCount: viewCount })
  },
  replyToForum: async (replyData) => {
    return await db.model('reply').create({ ...replyData })
  },
  increaseReplyCount: async (forumId) => {
    return await db
      .model('forum')
      .object(forumId)
      .updateFields([
        {
          field: 'replyCount',
          value: 1,
          updateType: 'increment',
        },
      ])
  },
  increaseCategoryForumCount(categoryName) {
    return db
      .model('category')
      .filter(`name == '${categoryName}'`)
      .updateFields([
        {
          field: 'forumCount',
          value: 1,
          updateType: 'increment',
        },
      ])
  },
  updateForumRecentUser: async (recentUser) => {
    return await endpoint.post(`/forum/${recentUser._parent}/recent`, recentUser)
  },
  increaseForumVisitCount: async (forumId) => {
    return await db
      .model('forum')
      .object(forumId)
      .updateFields([
        {
          field: 'viewCount',
          value: 1,
          updateType: 'increment',
        },
      ])
  },
  getForumCount: async () => {
    return await endpoint.get('/forum/count')
  },
}

export default ForumService
