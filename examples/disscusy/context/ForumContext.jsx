import forumReducer from '@/reducers/forum-reducers'
import forumService from '@/services/forum'
import { useRouter } from 'next/router'
import { createContext, useReducer } from 'react'

export const ForumContext = createContext()

const ForumProvider = ({ children }) => {
  const [state, dispatch] = useReducer(forumReducer.reducer, forumReducer.initialState)
  const router = useRouter()
  const searchForum = async (search) => {
    dispatch({
      type: 'FORUM_SEARCH_REQUESTED',
    })
    const { data, errors } = await forumService.searchForum(search)
    if (!errors) {
      dispatch({
        type: 'FORUM_SEARCH_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FORUM_SEARCH_FAILED',
        payload: errors.items,
      })
    }
  }
  const createForum = async (forum) => {
    dispatch({
      type: 'CREATE_FORUM_REQUESTED',
    })
    const { data, errors } = await forumService.createForum(forum)
    if (!errors) {
      dispatch({
        type: 'CREATE_FORUM_SUCCESS',
        payload: data,
      })
      forumService.increaseCategoryForumCount(forum.categoryName)
      router.push('/')
    } else {
      dispatch({
        type: 'CREATE_FORUM_FAILED',
        payload: errors.items,
      })
    }
  }

  const getForum = async (forumId) => {
    dispatch({
      type: 'SINGLE_FORUM_GET_REQUESTED',
    })

    const { data, errors } = await forumService.getForum(forumId)

    if (!errors) {
      dispatch({
        type: 'SINGLE_FORUM_GET_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'SINGLE_FORUM_GET_FAILED',
        payload: errors.items,
      })
    }
  }

  const fetchCategories = async () => {
    dispatch({
      type: 'FETCH_CATEGORIES_REQUESTED',
    })

    const { data, errors } = await forumService.fetchCategories()

    if (!errors) {
      dispatch({
        type: 'FETCH_CATEGORIES_SUCCESS',
        payload: data.result,
      })
    } else {
      dispatch({
        type: 'FETCH_CATEGORIES_FAILED',
        payload: errors.items,
      })
    }
  }

  const fetchForums = async (
    page,
    pageLimit,
    categoryName = '',
    tags = [],
    sort = 'createdAt:desc',
  ) => {
    dispatch({
      type: 'FORUMS_FETCH_REQUESTED',
    })
    const { data, errors } = await forumService.fetchForums(
      page,
      pageLimit,
      categoryName,
      tags,
      sort,
    )
    const { data: count, errors: countErrors } = await forumService.getForumCount()
    if (!errors && !countErrors) {
      dispatch({
        type: 'FORUMS_FETCH_SUCCESS',
        payload: {
          forums: data.result,
          countInfo: data.countInfo,
          totalForumCount: count.totalForumCount,
        },
      })
    } else {
      dispatch({
        type: 'FORUMS_FETCH_FAILED',
        payload:
          errors?.items && countErrors?.items
            ? [...errors.items, ...countErrors.items]
            : errors?.items || countErrors?.items,
      })
    }
  }

  const filterByCategory = async (categoryName) => {
    dispatch({
      type: 'FILTER_BY_CATEGORY_REQUESTED',
    })

    const { data, errors } = await forumService.filterByCategory(categoryName)
    if (!errors) {
      dispatch({
        type: 'FILTER_BY_CATEGORY_SUCCESS',
        payload: {
          data,
          categoryName,
        },
      })
    } else {
      dispatch({ type: 'FILTER_BY_CATEGORY_FAILED', payload: errors.items })
    }
  }

  const sortForums = async (sortingItem, method) => {
    dispatch({ type: 'SORT_FORUMS_REQUESTED' })

    const { data, errors } = await forumService.sortForums(sortingItem, method, state.categoryName)

    if (!errors) {
      dispatch({
        type: 'SORT_FORUMS_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'SORT_FORUMS_FAILED',
        payload: errors.items,
      })
    }
  }

  const increaseForumShareCounter = async (forumId) => {
    dispatch({ type: 'INCREASE_SHARE_COUNTER_REQUESTED' })

    const { data, errors } = await forumService.increaseForumShareCounter(forumId)

    if (!errors) {
      dispatch({
        type: 'INCREASE_SHARE_COUNTER_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'INCREASE_SHARE_COUNTER_FAILED',
        payload: errors.items,
      })
    }
  }

  const fetchTopForums = async (userId) => {
    dispatch({ type: 'FETCH_TOP_FORUMS_REQUESTED' })
    const { data, errors } = await forumService.fetchTopForums(userId)
    if (!errors) {
      dispatch({
        type: 'FETCH_TOP_FORUMS_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FETCH_TOP_FORUMS_FAILED',
        payload: errors.items,
      })
    }
  }
  const fetchForumsByUser = async (userId, page, pageSize) => {
    dispatch({ type: 'FETCH_FORUMS_BY_USER_REQUESTED' })
    const { data, errors } = await forumService.fetchForumsByUser(userId, page, pageSize)

    if (!errors) {
      dispatch({
        type: 'FETCH_FORUMS_BY_USER_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'FETCH_FORUMS_BY_USER_FAILED',
        payload: errors.items,
      })
    }
  }
  const addBookmark = async (forumId, user) => {
    dispatch({ type: 'SORT_FORUMS_REQUESTED' })

    const { data, errors } = await forumService.addBookmarkB(forumId, user)

    if (!errors) {
      dispatch({
        type: 'SORT_FORUMS_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'SORT_FORUMS_FAILED',
        payload: errors.items,
      })
    }
  }

  const searchByTag = async (searchArray) => {
    dispatch({ type: 'SEARCH_BY_TAG_REQUESTED' })

    const { data, errors } = await forumService.searchByTag(searchArray)

    if (!errors) {
      dispatch({
        type: 'SEARCH_BY_TAG_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'SEARCH_BY_TAG_FAILED',
        payload: errors.items,
      })
    }
  }

  const updateForumActivity = async (forumId) => {
    dispatch({ type: 'UPDATE_FORUM_REQUESTED' })

    const { data, errors } = await forumService.updateForumActivity(forumId)
    if (!errors) {
      dispatch({
        type: 'UPDATE_FORUM_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'UPDATE_FORUM_FAILED',
        payload: errors.items,
      })
    }
  }

  const increaseForumVisitCount = async (forumId) => {
    dispatch({ type: 'UPDATE_FORUM_VISIT_COUNT_REQUESTED' })

    const { data, errors } = await forumService.increaseForumVisitCount(forumId)
    if (!errors) {
      dispatch({
        type: 'UPDATE_FORUM_VISIT_COUNT_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'UPDATE_FORUM_VISIT_COUNT_FAILED',
        payload: errors.items,
      })
    }
  }

  const replyToForum = async (replyData) => {
    dispatch({ type: 'REPLY_FORUM_REQUESTED' })
    const { data, errors } = await forumService.replyToForum(replyData)

    if (!errors) {
      dispatch({
        type: 'REPLY_FORUM_SUCCESS',
        payload: data,
      })
      await forumService.increaseReplyCount(replyData.forum)
    } else {
      dispatch({
        type: 'REPLY_FORUM_FAILED',
        payload: errors.items,
      })
    }
  }
  const updateForumRecentUser = async (recentUser) => {
    dispatch({ type: 'ADD_RECENT_USER_REQUESTED' })

    const { data, errors } = await forumService.updateForumRecentUser(recentUser)
    if (!errors) {
      dispatch({
        type: 'ADD_RECENT_USER_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'ADD_RECENT_USER_FAILED',
        payload: errors.items,
      })
    }
  }
  return (
    <ForumContext.Provider
      value={{
        ...state,
        searchForum,
        getForum,
        fetchForums,
        filterByCategory,
        sortForums,
        fetchCategories,
        createForum,
        addBookmark,
        increaseForumShareCounter,
        fetchTopForums,
        fetchForumsByUser,
        searchByTag,
        updateForumActivity,
        replyToForum,
        increaseForumVisitCount,
        updateForumRecentUser,
      }}
    >
      {children}
    </ForumContext.Provider>
  )
}
export default ForumProvider
