const forumReducer = {
  initialState: {
    forums: [],
    countInfo: {},
    forum: {},
    topForums: [],
    categoryName: null,
    searchedForums: [],
    categories: [],
    loading: false,
    searchLoading: false,
    error: null,
    totalForumCount: 0,
  },
  reducer: (state, action) => {
    switch (action.type) {
      case 'FORUM_SEARCH_REQUESTED':
        return {
          ...state,
          searchLoading: true,
          error: null,
        }
      case 'FORUM_SEARCH_SUCCESS':
        return {
          ...state,
          searchedForums: action.payload,
          searchLoading: false,
          error: null,
        }
      case 'FORUM_SEARCH_FAILED':
        return {
          ...state,
          searchLoading: false,
          error: action.payload,
        }
      case 'SINGLE_FORUM_GET_REQUESTED':
        return {
          forum: null,
          ...state,
          loading: true,
          error: null,
        }

      case 'SINGLE_FORUM_GET_SUCCESS':
        return {
          ...state,
          forum: action.payload,
          loading: false,
          error: null,
        }
      case 'SINGLE_FORUM_GET_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }

      case 'FORUM_FETCH_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'FORUM_FETCH_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'FORUM_FETCH_SUCCESS':
        return {
          ...state,
          forums: action.payload,
          loading: false,
          error: null,
        }

      case 'CREATE_FORUM_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'CREATE_FORUM_SUCCESS':
        return {
          ...state,
          forum: action.payload,
          loading: false,
          error: null,
        }
      case 'CREATE_FORUM_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'FORUMS_FETCH_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'FORUMS_FETCH_SUCCESS':
        return {
          ...state,
          forums: action.payload.forums,
          countInfo: action.payload.countInfo,
          totalForumCount: action.payload.totalForumCount,
          loading: false,
          error: null,
        }
      case 'FORUMS_FETCH_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'FETCH_CATEGORIES_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'FETCH_CATEGORIES_SUCCESS':
        return {
          ...state,
          categories: action.payload,
          loading: false,
          error: null,
        }
      case 'FETCH_CATEGORIES_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'SORT_FORUMS_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'SORT_FORUMS_SUCCESS':
        return {
          ...state,
          loading: false,
          forums: action.payload.result,
          countInfo: action.payload.countInfo,
          error: null,
        }
      case 'SORT_FORUMS_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'FILTER_BY_CATEGORY_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'FILTER_BY_CATEGORY_SUCCESS':
        return {
          ...state,
          forums: action.payload.data.result,
          categoryName: action.categoryName,
          countInfo: action.payload.data.countInfo,
          loading: false,
          error: null,
        }
      case 'FILTER_BY_CATEGORY_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'FETCH_TOP_FORUMS_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'FETCH_TOP_FORUMS_SUCCESS':
        return {
          ...state,
          topForums: action.payload,
          loading: false,
          error: null,
        }
      case 'FETCH_TOP_FORUMS_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'FETCH_FORUMS_BY_USER_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'FETCH_FORUMS_BY_USER_SUCCESS':
        return {
          ...state,
          forums: action.payload.data,
          countInfo: action.payload.info,

          loading: false,
          error: null,
        }
      case 'FETCH_FORUMS_BY_USER_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'UPDATE_FORUM_REQUESTED':
        return {
          ...state,
          error: null,
          loading: true,
        }

      case 'UPDATE_FORUM_SUCCESS':
        return {
          ...state,
          loading: false,
          error: null,
        }
      case 'UPDATE_FORUM_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }

      case 'UPDATE_FORUM_VISIT_COUNT_REQUESTED':
        return {
          ...state,
          error: null,
          loading: true,
        }

      case 'UPDATE_FORUM_VISIT_COUNT_SUCCESS':
        return {
          ...state,
          loading: false,
          error: null,
        }
      case 'UPDATE_FORUM_VISIT_COUNT_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'SEARCH_BY_TAG_REQUESTED':
        return {
          ...state,
          error: null,
          loading: true,
        }

      case 'SEARCH_BY_TAG_SUCCESS':
        return {
          ...state,
          loading: false,
          error: null,
          forums: action.payload,
        }

      case 'SEARCH_BY_TAG_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }

      case 'REPLY_FORUM_SUCCESS':
        return {
          ...state,
          loading: false,
          error: null,
        }
      case 'REPLY_FORUM_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'REPLY_FORUM_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'ADD_RECENT_USER_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'ADD_RECENT_USER_SUCCESS':
        return {
          ...state,
          loading: false,
          error: null,
        }
      case 'ADD_RECENT_USER_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'INCREASE_SHARE_COUNTER_REQUESTED':
        return {
          ...state,
          error: null,
        }
      case 'INCREASE_SHARE_COUNTER_SUCCESS':
        state.forum.shareCount = action.payload.shareCount
        return {
          ...state,
          error: null,
        }
      case 'INCREASE_SHARE_COUNTER_FAILED':
        return {
          ...state,
          error: action.payload,
        }

      default:
        return state
    }
  },
}
export default forumReducer
