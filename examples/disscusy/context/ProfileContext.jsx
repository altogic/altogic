import profileReducer from '@/reducers/profile-reducer'
import profileService from '@/services/profile'
import { auth } from '@/utils/altogic'
import { createContext, useReducer } from 'react'

export const ProfileContext = createContext()

const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer.reducer, profileReducer.initialState)
  const user = auth.getUser()
  const getVisitCount = async () => {
    dispatch({
      type: 'GET_VISIT_COUNT',
      payload: profileService.getVisitCount(),
    })
  }

  const getTotalView = async () => {
    const { data, errors } = await profileService.getTotalView(user?._id)
    if (!errors) {
      dispatch({
        type: 'GET_TOTAL_VIEW_SUCCESS',
        payload: data[0]?.viewCount ?? 0,
      })
    } else {
      dispatch({
        type: 'GET_TOTAL_VIEW_FAILED',
        payload: errors.items,
      })
    }
  }

  const getVotesGiven = async (userId) => {
    const replyResult = await profileService.getVotesGivenToReply(userId ?? user?._id)
    const forumResult = await profileService.getVotesGivenToForum(userId ?? user?._id)

    if (!replyResult.errors && !forumResult.errors) {
      const result = (forumResult.data[0]?.count ?? 0) + (replyResult.data[0]?.count ?? 0)
      dispatch({
        type: 'GET_VOTES_GIVEN_SUCCESS',
        payload: result,
      })
    } else {
      dispatch({
        type: 'GET_VOTES_GIVEN_FAILED',
        payload: replyResult.errors ? replyResult.errors.items : forumResult.errors.items,
      })
    }
  }
  const getForumCount = async (userId) => {
    const { data, errors } = await profileService.getForumCount(userId ?? user?._id)
    if (!errors) {
      dispatch({
        type: 'GET_FORUM_COUNT_SUCCESS',
        payload: data[0]?.count ?? 0,
      })
    } else {
      dispatch({
        type: 'GET_FORUM_COUNT_FAILED',
        payload: errors.items,
      })
    }
  }
  const getReplyCount = async (userId) => {
    const { data, errors } = await profileService.getReplyCount(userId ?? user?._id)

    if (!errors) {
      dispatch({
        type: 'GET_REPLY_COUNT_SUCCESS',
        payload: data[0]?.count ?? 0,
      })
    } else {
      dispatch({
        type: 'GET_REPLY_COUNT_FAILED',
        payload: errors.items,
      })
    }
  }
  const getVotesReceived = async (userId) => {
    const { forum, reply } = await profileService.getVotesReceived(userId ?? user?._id)
    if (!forum.errors && !reply.errors) {
      const result = (forum.data[0]?.count ?? 0) + (reply.data[0]?.count ?? 0)
      dispatch({
        type: 'GET_VOTES_RECEIVED_SUCCESS',
        payload: result,
      })
    } else {
      dispatch({
        type: 'GET_VOTES_RECEIVED_FAILED',
        payload: forum.errors ? forum.errors.items : reply.errors.items,
      })
    }
  }

  const getAllStats = async () => {
    dispatch({ type: 'REQUESTED' })
    await Promise.all([
      getVisitCount(),
      getTotalView(),
      getVotesGiven(),
      getForumCount(),
      getReplyCount(),
      getVotesReceived(),
    ])
  }

  const getFollowers = async (userId, page, pageSize) => {
    dispatch({ type: 'REQUESTED' })

    const { data, errors } = await profileService.getFollowers(userId, page, pageSize)
    if (!errors) {
      dispatch({
        type: 'GET_FOLLOWERS_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'GET_FOLLOWERS_FAILED',
        payload: errors.items,
      })
    }
  }

  const getFollowings = async (userId, page, pageSize) => {
    dispatch({ type: 'REQUESTED' })

    const { data, errors } = await profileService.getFollowings(userId, page, pageSize)

    if (!errors) {
      dispatch({
        type: 'GET_FOLLOWINGS_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'GET_FOLLOWINGS_FAILED',
        payload: errors.items,
      })
    }
  }
  const getFollowConnection = async (follower, following) => {
    dispatch({ type: 'REQUESTED' })
    const { data, errors } = await profileService.getFollowConnection(follower, following)
    if (!errors) {
      dispatch({
        type: 'GET_FOLLOWINGS_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'GET_FOLLOWINGS_FAILED',
        payload: errors.items,
      })
    }
  }

  const getProfile = async (userId) => {
    dispatch({ type: 'REQUESTED' })

    const { data, errors } = await profileService.getProfile(userId)
    if (!errors) {
      dispatch({
        type: 'GET_PROFILE_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'GET_PROFILE_FAILED',
        payload: errors.items,
      })
    }
  }

  const followProfile = async (followerUser, followingUser) => {
    const { data, errors } = await profileService.followProfile(followerUser, followingUser)

    if (!errors) {
      dispatch({
        type: 'FOLLOW_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FOLLOW_FAILED',
        payload: errors.items,
      })
    }
  }
  const unfollowProfile = async (followerUser, followingUser) => {
    const { data, errors } = await profileService.unfollowProfile(followerUser, followingUser)

    if (!errors) {
      dispatch({
        type: 'UNFOLLOW_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'UNFOLLOW_FAILED',
        payload: errors.items,
      })
    }
  }

  return (
    <ProfileContext.Provider
      value={{
        ...state,
        getVisitCount,
        getTotalView,
        getAllStats,
        getFollowers,
        getFollowings,
        getProfile,
        unfollowProfile,
        followProfile,
        getForumCount,
        getReplyCount,
        getVotesReceived,
        getFollowConnection,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}
export default ProfileProvider
