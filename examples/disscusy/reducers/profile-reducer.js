const profileReducer = {
  initialState: {
    totalView: null,
    visitCount: null,
    votesGiven: null,
    votesReceived: null,
    forumCount: null,
    replyCount: null,
    error: null,
    profile: null,
    followers: [],
    loading: false,
    followings: [],
  },
  reducer: (state, action) => {
    switch (action.type) {
      case 'REQUESTED':
        return {
          ...state,
          error: null,
          loading: true,
        }

      case 'GET_TOTAL_VIEW_SUCCESS':
        return {
          ...state,
          error: null,
          totalView: action.payload,
          loading: false,
        }
      case 'GET_VISIT_COUNT':
        return {
          ...state,
          error: null,
          visitCount: action.payload,
        }
      case 'GET_VOTES_GIVEN_SUCCESS':
        return {
          ...state,
          error: null,
          votesGiven: action.payload,
        }
      case 'GET_VOTES_RECEIVED_SUCCESS':
        return {
          ...state,
          error: null,
          votesReceived: action.payload,
          loading: false,
        }

      case 'GET_FORUM_COUNT_SUCCESS':
        return {
          ...state,
          error: null,
          forumCount: action.payload,
        }
      case 'GET_REPLY_COUNT_SUCCESS':
        return {
          ...state,
          error: null,
          replyCount: action.payload,
        }

      case 'GET_FOLLOWERS_SUCCESS':
        return {
          ...state,
          error: null,
          followers: action.payload,
        }

      case 'GET_FOLLOWERS_FAILED':
        return {
          ...state,
          error: action.payload,
        }

      case 'GET_FOLLOWINGS_SUCCESS':
        return {
          ...state,
          error: null,
          followings: action.payload,
        }

      case 'GET_FOLLOWINGS_FAILED':
        return {
          ...state,
          error: action.payload,
        }
      case 'FOLLOW_SUCCESS':
        return {
          ...state,
          error: null,
        }

      case 'FOLLOW_FAILED':
        return {
          ...state,
          error: action.payload,
        }

      case 'GET_PROFILE_SUCCESS':
        return {
          ...state,
          error: null,
          profile: action.payload,
        }

      case 'GET_PROFILE_FAILED':
        return {
          ...state,
          error: action.payload,
        }

      case 'GET_TOTAL_VIEW_FAILED':
        return {
          ...state,
          error: action.payload,
          loading: false,
        }
      case 'GET_VOTES_GIVEN_FAILED':
        return {
          ...state,
          error: action.payload,
          loading: false,
        }
      case 'GET_VOTES_RECEIVED_FAILED':
        return {
          ...state,
          error: action.payload,
          loading: false,
        }
      case 'GET_FORUM_COUNT_FAILED':
        return {
          ...state,
          error: action.payload,
          loading: false,
        }
      case 'GET_REPLY_COUNT_FAILED':
        return {
          ...state,
          error: action.payload,
          loading: false,
        }
      default:
        return state
    }
  },
}

export default profileReducer
