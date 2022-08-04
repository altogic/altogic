const voteReducer = {
  initialState: {
    forumVotes: [],
    replyVotes: [],
    loading: false,
    error: null,
    replyCountInfo:{},
    forumCountInfo:{}
  },
  reducer: (state, action) => {
    switch (action.type) {
      case 'FORUM_VOTE_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'FORUM_VOTE_SUCCESS':
        return {
          ...state,
          forumVotes: action.payload,
          loading: false,
          error: null,
        }
      case 'FORUM_VOTE_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'REPLY_VOTE_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'REPLY_VOTE_SUCCESS':
        return {
          ...state,
          replyVotes: action.payload,
          loading: false,
          error: null,
        }
      case 'REPLY_VOTE_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'FETCH_FORUM_VOTES_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'FETCH_FORUM_VOTES_SUCCESS':
        return {
          ...state,
          forumVotes: action.payload.data,
          forumCountInfo: action.payload.info,
          loading: false,
          error: null,
        }
      case 'FETCH_FORUM_VOTES_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload,
        }
      case 'FETCH_REPLY_VOTES_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'FETCH_REPLY_VOTES_SUCCESS':
        return {
          ...state,
          replyVotes: action.payload.data,
          replyCountInfo: action.payload.info,
          loading: false,
          error: null,
        }
      default:
        return state
    }
  },
}
export default voteReducer
