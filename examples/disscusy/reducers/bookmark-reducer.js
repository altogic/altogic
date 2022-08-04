const bookmarkReducer = {
  initialState: {
    bookmarks: [],
    categories: [],
    loading: false,
    error: null,
    forumBookmarkCount: 0,
    replyBookmarkCount: 0,
    forumBookmarks: [],
    replyBookmarks: [],
    replyLoading: false,
    forumLoading: false,
  },
  reducer: (state, action) => {
    switch (action.type) {
      case 'FETCH_REPLY_BOOKMARKS_REQUEST':
        return {
          ...state,
          replyLoading: true,
          error: null,
        }

      case 'FETCH_REPLY_BOOKMARKS_SUCCESS':
        return {
          ...state,
          replyBookmarks: action.payload.data,
          replyBookmarkCount: action.payload.info.count,
          replyLoading: false,
          error: null,
        }
      case 'FETCH_REPLY_BOOKMARKS_FAILED':
        return {
          ...state,
          replyLoading: false,
          error: action.payload,
        }
      case 'FETCH_FORUM_BOOKMARKS_REQUEST':
        return {
          ...state,
          forumLoading: true,
          error: null,
        }

      case 'FETCH_FORUM_BOOKMARKS_SUCCESS':
        return {
          ...state,
          forumBookmarks: action.payload.data,
          forumBookmarkCount: action.payload.info.count,
          forumLoading: false,
          error: null,
        }
      case 'FETCH_FORUM_BOOKMARKS_FAILURE':
        return {
          ...state,
          forumLoading: false,
          error: action.payload,
        }
      case 'FILTER_BOOKMARKS_REQUEST':
        return {
          ...state,
          forumLoading: true,
          error: null,
        }
      case 'FILTER_BOOKMARKS_SUCCESS':
        return {
          ...state,
          bookmarks: action.payload,
          loading: false,
          error: null,
        }
      case 'FILTER_BOOKMARKS_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'FETCH_BOOKMARK_CATEGORIES_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'FETCH_BOOKMARK_CATEGORIES_SUCCESS':
        return {
          ...state,
          categories: action.payload,
          loading: false,
          error: null,
        }
      case 'FETCH_BOOKMARK_CATEGORIES_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'CHANGE_BOOKMARK_CATEGORY_NAME_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'CHANGE_BOOKMARK_CATEGORY_NAME_SUCCESS':
        return {
          ...state,
          categories: state.categories.map((category) => {
            if (category._id === action.payload.categoryId) {
              category.name = action.payload.categoryName
            }
            return category
          }),
          loading: false,
          error: null,
        }
      case 'CHANGE_BOOKMARK_CATEGORY_NAME_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'DELETE_BOOKMARK_CATEGORY_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'DELETE_BOOKMARK_CATEGORY_SUCCESS':
        return {
          ...state,
          categories: state.categories.filter((ct) => ct._id !== action.payload),
          loading: false,
          error: null,
        }
      case 'DELETE_BOOKMARK_CATEGORY_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'ADD_BOOKMARK_CATEGORY_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'ADD_BOOKMARK_CATEGORY_SUCCESS':
        return {
          ...state,
          categories: [...state.categories, action.payload],
          loading: false,
          error: null,
        }
      case 'ADD_BOOKMARK_CATEGORY_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'ADD_BOOKMARK_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'ADD_BOOKMARK_SUCCESS':
        var oldBookmarks = state.bookmarks.data ? state.bookmarks.data : state.bookmarks
        return {
          ...state,
          bookmarks: [...oldBookmarks, action.payload],
          loading: false,
          error: null,
        }
      case 'ADD_BOOKMARK_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'SORT_BOOKMARKS_REQUEST':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'SORT_BOOKMARKS_SUCCESS':
        return {
          ...state,
          bookmarks: action.payload,
          loading: false,
          error: null,
        }
      case 'SORT_BOOKMARKS_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'DELETE_BOOKMARK_REQUESTED':
        return {
          ...state,
          error: null,
        }
      case 'DELETE_BOOKMARK_SUCCESS':
        return {
          ...state,
          loading: false,
          error: null,
        }
      case 'DELETE_BOOKMARK_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'UPDATE_BOOKMARK_CATEGORY_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'UPDATE_BOOKMARK_CATEGORY_SUCCESS':
        return {
          ...state,
          loading: true,
        }
      case 'UPDATE_BOOKMARK_CATEGORY_FAILED':
        return {
          ...state,
          loading: true,
          error: action.payload,
        }
      case 'GET_REPLY_BOOKMARK_COUNT_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'GET_REPLY_BOOKMARK_COUNT_SUCCESS':
        return {
          ...state,
          loading: false,
          error: null,
          replyBookmarkCount: action.payload,
        }
      case 'GET_REPLY_BOOKMARK_COUNT_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'GET_FORUM_BOOKMARK_COUNT_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'GET_FORUM_BOOKMARK_COUNT_SUCCESS':
        return {
          ...state,
          loading: false,
          error: null,
          forumBookmarkCount: action.payload,
        }
      case 'GET_FORUM_BOOKMARK_COUNT_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }

      default:
        return state
    }
  },
}
export default bookmarkReducer
