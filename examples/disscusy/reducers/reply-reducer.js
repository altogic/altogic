const replyReducer = {
  initialState: {
    replies: [],
    countInfo: {},
    topReplies: [],
    loading: false,
    error: null,
    comment: null,
    comments: [],
    commentLoading: false,
  },
  reducer: (state, action) => {
    switch (action.type) {
      case 'FETCH_TOP_REPLIES_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'FETCH_TOP_REPLIES_SUCCESS':
        return {
          ...state,
          topReplies: action.payload,
          loading: false,
          error: null,
        }

      case 'ADD_COMMENT_REQUESTED':
        return {
          ...state,
          commentLoading: true,
          error: null,
        }
      case 'ADD_COMMENT_SUCCESS':
        return {
          ...state,
          comments: [...state.comments, action.payload],
          commentLoading: false,
          error: null,
        }
      case 'ADD_COMMENT_FAILED':
        return {
          ...state,
          commentLoading: false,
          error: action.payload,
        }
      case 'ADD_LAST_COMMENT_SUCCESS':
        return {
          ...state,
          replies: state.replies.map((reply) => {
            if (reply._id === action.payload._parent) {
              reply.lastComments.push(action.payload)
            }

            return reply
          }),
          commentLoading: false,
          error: null,
        }
      case 'ADD_LAST_COMMENT_FAILED':
        return {
          ...state,
          commentLoading: false,
          error: action.payload,
        }
      case 'GET_COMMENTS_SUCCESS':
        return {
          ...state,
          comments: action.payload,
          commentLoading: false,
          error: null,
        }
      case 'GET_COMMENTS_FAILED':
        return {
          ...state,
          commentLoading: false,
          error: action.payload,
        }
      case 'REPLIES_GET_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }

      case 'REPLIES_GET_SUCCESS':
        return {
          ...state,
          replies: action.payload.data,
          countInfo: action.payload.countInfo,
          loading: false,
          error: null,
        }
      case 'REPLIES_GET_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'FETCH_TOP_REPLIES_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'FETCH_REPLY_BY_USER_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'FETCH_REPLY_BY_USER_SUCCESS':
        return {
          ...state,
          replies: action.payload.data,
          countInfo: action.payload.info,
          loading: false,
          error: null,
        }
      case 'FETCH_REPLY_BY_USER_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'INCREASE_REPLY_SHARE_COUNT_REQUESTED':
        return {
          ...state,
          error: null,
        }
      case 'INCREASE_REPLY_SHARE_COUNT_SUCCESS':
        return {
          ...state,
          replies: state.replies.map((reply) => {
            if (reply._id === action.payload._id) {
              reply.shareCount = action.payload.shareCount
            }
            return reply
          }),
          error: null,
        }
      case 'INCREASE_REPLY_SHARE_COUNT_FAILED':
        return {
          ...state,
          error: action.payload,
        }

      default:
        return state
    }
  },
}
export default replyReducer
