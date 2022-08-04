import { useReducer, createContext } from 'react'
import VoteService from '@/services/vote'
import voteReducer from '@/reducers/vote-reducer'

export const VoteContext = createContext()

const VoteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(voteReducer.reducer, voteReducer.initialState)
  const vote = async (vote) => {
    dispatch({
      type: 'FORUM_VOTE_REQUESTED',
    })
    const { data, errors } = await VoteService.vote(vote)
    if (!errors) {
      dispatch({
        type: 'FORUM_VOTE_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FORUM_VOTE_FAILED',
        payload: errors.items,
      })
    }
  }
  const fetchForumVotesByUser = async (userId, page, pageSize) => {
    dispatch({
      type: 'FETCH_FORUM_VOTES_REQUESTED',
    })
    const { data, errors } = await VoteService.getForumVotesByUser(userId, page, pageSize)
    if (!errors) {
      dispatch({
        type: 'FETCH_FORUM_VOTES_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FETCH_FORUM_VOTES_FAILED',
        payload: errors.items,
      })
    }
  }
  const fetchReplyVotesByUser = async (userId, page, pageSize) => {
    dispatch({
      type: 'FETCH_REPLY_VOTES_REQUESTED',
    })
    const { data, errors } = await VoteService.getReplyVotesByUser(userId, page, pageSize)
    if (!errors) {
      dispatch({
        type: 'FETCH_REPLY_VOTES_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FETCH_REPLY_VOTES_FAILED',
        payload: errors.items,
      })
    }
  }
  const addReplyVote = async (vote) => {
    dispatch({
      type: 'ADD_REPLY_VOTE_REQUESTED',
    })
    const { data, errors } = await VoteService.addReplyVote(vote)
    if (!errors) {
      dispatch({
        type: 'ADD_REPLY_VOTE_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'ADD_REPLY_VOTE_FAILED',
        payload: errors.items,
      })
    }
  }
  const addForumVote = async (vote) => {
    dispatch({
      type: 'ADD_FORUM_VOTE_REQUESTED',
    })
    const { data, errors } = await VoteService.addForumVote(vote)
    if (!errors) {
      dispatch({
        type: 'ADD_FORUM_VOTE_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'ADD_FORUM_VOTE_FAILED',
        payload: errors.items,
      })
    }
  }
  return (
    <VoteContext.Provider
      value={{
        ...state,
        vote,
        fetchForumVotesByUser,
        fetchReplyVotesByUser,
        addForumVote,
        addReplyVote,
      }}
    >
      {children}
    </VoteContext.Provider>
  )
}
export default VoteProvider
