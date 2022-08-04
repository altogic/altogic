import { useReducer, createContext } from 'react'
import BookmarkService from '@/services/bookmark'
import bookmarkReducer from '@/reducers/bookmark-reducer'

export const BookmarkContext = createContext()

const BookmarkProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookmarkReducer.reducer, bookmarkReducer.initialState)

  const fetchReplyBookmarks = async (
    userId,
    page,
    pageSize,
    catId = '',
    sortingField = 'createdAt',
    sortingMethod = 'desc',
  ) => {
    dispatch({
      type: 'FETCH_REPLY_BOOKMARKS_REQUEST',
    })
    const { data, errors } = await BookmarkService.fetchBookmarks(
      userId,
      page,
      pageSize,
      'reply',
      catId,
      sortingField,
      sortingMethod,
    )

    if (!errors) {
      dispatch({
        type: 'FETCH_REPLY_BOOKMARKS_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FETCH_REPLY_BOOKMARKS_FAILED',
        payload: errors.items,
      })
    }
  }
  const fetchForumBookmarks = async (
    userId,
    page,
    pageSize,
    catId = '',
    sortingField = 'createdAt',
    sortingMethod = 'desc',
  ) => {
    dispatch({
      type: 'FETCH_FORUM_BOOKMARKS_REQUEST',
    })
    const { data, errors } = await BookmarkService.fetchBookmarks(
      userId,
      page,
      pageSize,
      'forum',
      catId,
      sortingField,
      sortingMethod,
    )

    if (!errors) {
      dispatch({
        type: 'FETCH_FORUM_BOOKMARKS_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FETCH_FORUM_BOOKMARKS_FAILED',
        payload: errors.items,
      })
    }
  }
  const fetchBookmarkCategories = async (userId) => {
    dispatch({
      type: 'FETCH_BOOKMARK_CATEGORIES_REQUESTED',
    })
    const { data, errors } = await BookmarkService.fetchBookmarkCategories(userId)
    if (!errors) {
      if (!data.some((category) => category.name === 'Unlisted')) {
        const { data: unlisted } = await BookmarkService.addBookmarkCategory(userId, 'Unlisted')
        dispatch({
          type: 'FETCH_BOOKMARK_CATEGORIES_SUCCESS',
          payload: [...data, unlisted],
        })
        return
      }

      dispatch({
        type: 'FETCH_BOOKMARK_CATEGORIES_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FETCH_BOOKMARK_CATEGORIES_FAILED',
        payload: errors.items,
      })
    }
  }
  const filterBookmarkByCategory = async (userId, categoryId) => {
    dispatch({
      type: 'FILTER_BOOKMARKS_REQUEST',
    })
    const { data, errors } = await BookmarkService.filterBookmarkByCategory(userId, categoryId)
    if (!errors) {
      dispatch({
        type: 'FILTER_BOOKMARKS_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FILTER_BOOKMARKS_FAILED',
        payload: errors.items,
      })
    }
  }
  const changeBookmarkCategoryName = async (categoryId, categoryName) => {
    dispatch({
      type: 'CHANGE_BOOKMARK_CATEGORY_NAME_REQUEST',
    })
    const { errors } = await BookmarkService.changeBookmarkCategoryName(categoryId, categoryName)
    if (!errors) {
      dispatch({
        type: 'CHANGE_BOOKMARK_CATEGORY_NAME_SUCCESS',
        payload: {
          categoryId,
          categoryName,
        },
      })
    } else {
      dispatch({
        type: 'CHANGE_BOOKMARK_CATEGORY_NAME_FAILED',
        payload: errors.items,
      })
    }
  }
  const deleteBookmarkCategory = async (categoryId, unlistedId) => {
    dispatch({
      type: 'DELETE_BOOKMARK_CATEGORY_REQUEST',
    })
    const { errors } = await BookmarkService.deleteBookmarkCategory(categoryId, unlistedId)
    if (!errors) {
      dispatch({
        type: 'DELETE_BOOKMARK_CATEGORY_SUCCESS',
        payload: categoryId,
      })
    } else {
      dispatch({
        type: 'DELETE_BOOKMARK_CATEGORY_FAILED',
        payload: errors.items,
      })
    }
  }
  const addBookmarkCategory = async (userId, categoryName) => {
    dispatch({
      type: 'ADD_BOOKMARK_CATEGORY_REQUEST',
    })
    const { data, errors } = await BookmarkService.addBookmarkCategory(userId, categoryName)
    if (!errors) {
      dispatch({
        type: 'ADD_BOOKMARK_CATEGORY_SUCCESS',
        payload: data,
      })
      return data._id
    } else {
      dispatch({
        type: 'ADD_BOOKMARK_CATEGORY_FAILED',
        payload: errors.items,
      })
    }
  }
  const addBookmark = async (bookmark) => {
    dispatch({
      type: 'ADD_BOOKMARK_REQUEST',
    })
    const { data, errors } = await BookmarkService.addBookmark(bookmark)
    if (!errors) {
      dispatch({
        type: 'ADD_BOOKMARK_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'ADD_BOOKMARK_FAILED',
        payload: errors.items,
      })
    }
  }
  const sortBookmarks = async (userId, categoryId, sortBy) => {
    dispatch({
      type: 'SORT_BOOKMARKS_REQUEST',
    })
    const { data, errors } = await BookmarkService.sortBookmarks(userId, categoryId, sortBy)
    if (!errors) {
      dispatch({
        type: 'SORT_BOOKMARKS_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'SORT_BOOKMARKS_FAILED',
        payload: errors.items,
      })
    }
  }
  const deleteBookmark = async (userId, targetId, type) => {
    dispatch({
      type: 'DELETE_BOOKMARK_REQUESTED',
    })
    const { errors } = await BookmarkService.deleteBookmark(userId, targetId, type)
    if (!errors) {
      dispatch({
        type: 'DELETE_BOOKMARK_SUCCESS',
        payload: targetId,
      })
      BookmarkService.decreaseBookmarkCount(type, targetId)
    } else {
      dispatch({
        type: 'DELETE_BOOKMARK_FAILED',
        payload: errors.items,
      })
    }
  }
  const changeBookmarkCategory = async (userId, targetId, type, catId) => {
    dispatch({
      type: 'UPDATE_BOOKMARK_CATEGORY_REQUESTED',
    })
    const { errors } = await BookmarkService.changeBookmarkCategory(userId, targetId, type, catId)
    if (!errors) {
      dispatch({
        type: 'UPDATE_BOOKMARK_CATEGORY_SUCCESS',
      })
    } else {
      dispatch({
        type: 'UPDATE_BOOKMARK_CATEGORY_FAILED',
        payload: errors.items,
      })
    }
  }

  return (
    <BookmarkContext.Provider
      value={{
        ...state,
        fetchReplyBookmarks,
        fetchForumBookmarks,
        fetchBookmarkCategories,
        filterBookmarkByCategory,
        changeBookmarkCategoryName,
        deleteBookmarkCategory,
        addBookmarkCategory,
        addBookmark,
        sortBookmarks,
        deleteBookmark,
        changeBookmarkCategory,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  )
}
export default BookmarkProvider
