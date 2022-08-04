import { createContext, useReducer } from 'react'
import credentialReducer from '@/reducers/credential-reducer'
import credentialService from '@/services/credential'
export const CredentialContext = createContext('')

const CredentialProvider = ({ children }) => {
  const [state, dispatch] = useReducer(credentialReducer.reducer, credentialReducer.initialState)

  const changePassword = async (newPassword, oldPassword) => {
    dispatch({
      type: 'CHANGE_PASSWORD_REQUESTED',
    })

    const { errors } = await credentialService.changePassword(newPassword, oldPassword)

    if (!errors) {
      dispatch({
        type: 'CHANGE_PASSWORD_SUCCESS',
      })
    } else {
      dispatch({
        type: 'CHANGE_PASSWORD_FAILED',
        payload: errors.items,
      })
    }
  }

  const updateProfile = async (formData) => {
    dispatch({
      type: 'PROFILE_UPDATE_REQUESTED',
    })
    const { errors } = await credentialService.updateProfile(formData)
    if (!errors) {
      dispatch({ type: 'PROFILE_UPDATE_SUCCESS' })
      await credentialService.setUserInfoFromDatabase()
    } else {
      dispatch({ type: 'PROFILE_UPDATE_FAILED', payload: errors.items })
    }
  }

  const deleteUserFromDatabase = async () => {
    dispatch({
      type: 'REQUESTED',
    })

    const { errors } = await credentialService.deleteUser()
    if (!errors) {
      dispatch({ type: 'DELETE_USER_SUCCESS' })
    } else {
      dispatch({ type: 'DELETE_USER_FAILED', payload: errors.items })
    }
  }
  const checkUsername = async (username) => {
    dispatch({
      type: 'CHECK_USERNAME_REQUESTED',
    })
    const { data, errors } = await credentialService.checkIfUsernameExists(username)
    if (!errors) {
      dispatch({
        type: 'CHECK_USERNAME_SUCCESS',
        payload: data.length ? false : true,
      })
    } else {
      dispatch({
        type: 'CHECK_USERNAME_FAILED',
        payload: errors.items,
      })
    }
  }

  return (
    <CredentialContext.Provider
      value={{
        ...state,
        changePassword,
        updateProfile,
        deleteUserFromDatabase,
        checkUsername,
      }}
    >
      {children}
    </CredentialContext.Provider>
  )
}
export default CredentialProvider
