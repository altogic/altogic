import { useReducer, createContext } from 'react'
import replyReducer from '@/reducers/reply-reducer'
import replyService from '@/services/reply'
export const ReplyContext = createContext()

const ReplyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(replyReducer.reducer, replyReducer.initialState)
  const fetchTopReplies = async (userId) => {
    dispatch({
      type: 'FETCH_TOP_REPLIES_REQUESTED',
    })
    const { data, errors } = await replyService.fetchTopReplies(userId)
    if (!errors) {
      dispatch({
        type: 'FETCH_TOP_REPLIES_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FETCH_TOP_REPLIES_FAILED',
        payload: errors.items,
      })
    }
  }
  const fetchReplyByUser = async (userId, page, pageSize) => {
    dispatch({
      type: 'FETCH_REPLY_BY_USER_REQUESTED',
    })

    const { data, errors } = await replyService.fetchRepliesByUser(userId, page, pageSize)
    if (!errors) {
      dispatch({
        type: 'FETCH_REPLY_BY_USER_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FETCH_REPLY_BY_USER_FAILED',
        payload: errors.items,
      })
    }
  }
  const addComment = async (replyData) => {
    dispatch({ type: 'ADD_COMMENT_REQUESTED' })

    const { data, errors } = await replyService.addComment(replyData)
    if (!errors) {
      dispatch({
        type: 'ADD_COMMENT_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'ADD_COMMENT_FAILED',
        payload: errors.items,
      })
    }
  }

  const getComments = async (forumComment) => {
    dispatch({ type: 'GET_COMMENT_REQUESTED' })

    const { data, errors } = await replyService.getComments(forumComment)
    if (!errors) {
      dispatch({
        type: 'GET_COMMENTS_SUCCESS',

        payload: data.result,
      })
    } else {
      dispatch({
        type: 'GET_COMMENTS_FAILED',
        payload: errors.items,
      })
    }
  }

  const getForumReplies = async (forumId, page, pageSize) => {
    dispatch({
      type: 'REPLIES_GET_REQUESTED',
    })

    const { data, errors } = await replyService.getForumReplies(forumId, page, pageSize)
    if (!errors) {
      dispatch({
        type: 'REPLIES_GET_SUCCESS',
        payload: {
          data: data.result,
          countInfo: data.countInfo,
        },
      })
    } else {
      dispatch({
        type: 'REPLIES_GET_FAILED',
        payload: errors.items,
      })
    }
  }
  const updateReplyLastComment = async (replyId, lastComment) => {
    dispatch({ type: 'ADD_LAST_COMMENT_REQUESTED' })

    const { data, errors } = await replyService.updateReplyLastComment(replyId, lastComment)
    if (!errors) {
      dispatch({
        type: 'ADD_LAST_COMMENT_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'ADD_LAST_COMMENT_FAILED',
        payload: errors.items,
      })
    }
  }
  const increaseReplyShareCounter = async (replyId) => {
    dispatch({ type: 'INCREASE_REPLY_SHARE_COUNT_REQUESTED' })

    const { data, errors } = await replyService.increaseReplyShareCounter(replyId)
    if (!errors) {
      dispatch({
        type: 'INCREASE_REPLY_SHARE_COUNT_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'INCREASE_REPLY_SHARE_COUNT_FAILED',
        payload: errors.items,
      })
    }
  }

  return (
    <ReplyContext.Provider
      value={{
        ...state,
        fetchTopReplies,
        fetchReplyByUser,
        addComment,
        getComments,
        getForumReplies,
        updateReplyLastComment,
        increaseReplyShareCounter,
      }}
    >
      {children}
    </ReplyContext.Provider>
  )
}
export default ReplyProvider
