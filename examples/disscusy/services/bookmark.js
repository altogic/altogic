import { db, endpoint } from '@/utils/altogic'
const BookmarkService = {
  fetchBookmarks: async (
    userId,
    page,
    pageSize,
    type,
    categoryId = '',
    sortingField = 'createdAt',
    sortingMethod = 'desc',
  ) => {
    return await db
      .model('bookmark')
      .lookup({ field: 'forum' })
      .lookup({ field: 'reply' })
      .lookup({ field: 'reply_forum' })
      .filter(
        `user == '${userId}' && isDeleted == false && type == '${type}' ${
          categoryId ? `&& bookmark_category == '${categoryId}'` : ''
        }`,
      )
      .limit(pageSize)
      .page(page)
      .sort(sortingField, sortingMethod)
      .get({ returnCountInfo: true })
  },
  fetchBookmarkCategories: async (userId) => {
    return await db
      .model('bookmark_category')
      .filter(`user == '${userId}' && isDeleted == false`)
      .sort('name', 'asc')
      .get()
  },
  filterBookmarkByCategory: async (userId, categoryId) => {
    return await db
      .model('bookmark')
      .filter(
        `user == '${userId}' ${
          categoryId
            ? `&& bookmark_category == '${categoryId}'`
            : `bookmark_category == '${categoryId}'`
        }`,
      )
      .sort('createdAt', 'desc')
      .lookup({ field: 'forum' })
      .lookup({ field: 'reply_forum' })
      .get({ returnCountInfo: true })
  },
  changeBookmarkCategoryName: async (categoryId, name) => {
    return await db
      .model('bookmark_category')
      .object(categoryId)
      .updateFields([{ field: 'name', updateType: 'set', value: name }])
  },
  deleteBookmarkCategory: async (categoryId, unlistedId) => {
    await db
      .model('bookmark')
      .filter(`bookmark_category == '${categoryId}'`)
      .updateFields([{ field: 'bookmark_category', updateType: 'set', value: unlistedId }])
    return await db.model('bookmark_category').object(categoryId).delete()
  },
  addBookmarkCategory: async (userId, name) => {
    return await endpoint.post('/bookmark_category', { user: userId, name })
  },
  addBookmark: async (bookmark) => {
    return await endpoint.post('/bookmark', bookmark)
  },
  sortBookmarks: async (userId, categoryId, sortBy) => {
    return await db
      .model('bookmark')
      .filter(`user == '${userId}' ${categoryId ? `&& bookmark_category == '${categoryId}'` : ``}`)
      .sort('createdAt', sortBy)
      .lookup({ field: 'reply_forum' })
      .lookup({ field: 'forum' })
      .get({ returnCountInfo: true })
  },
  deleteBookmark: async (userId, targetId, type) => {
    return await db
      .model('bookmark')
      .filter(`user == '${userId}' && ${type} == '${targetId}'`)
      .delete()
  },

  changeBookmarkCategory: async (userId, targetId, type, catId) => {
    return await db
      .model('bookmark')
      .filter(`user == '${userId}' && ${type} == '${targetId}'`)
      .updateFields([
        {
          field: 'bookmark_category',
          updateType: 'set',
          value: catId,
        },
      ])
  },
  decreaseBookmarkCount: async (type, id) => {
    return await db
      .model(type)
      .object(id)
      .updateFields([
        {
          field: 'bookmarkCount',
          updateType: 'decrement',
          value: 1,
        },
      ])
  },
}
export default BookmarkService
