import { createContext, useReducer } from 'react'
import fileReducer from '@/reducers/file-reducer'
import fileService from '@/services/file'

export const FileContext = createContext()

const FileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(fileReducer.reducer, fileReducer.initialState)
  const uploadFile = async (file) => {
    dispatch({
      type: 'UPLOAD_FILE_REQUESTED',
    })
    const { data, errors } = await fileService.uploadFile(file)
    if (!errors) {
      dispatch({
        type: 'UPLOAD_FILE_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'UPLOAD_FILE_FAILED',
        payload: errors.items,
      })
    }
  }

  const uploadProfilePicture = async (file, fileName, existingImage) => {
    dispatch({
      type: 'UPLOAD_PROFILE_PICTURE_REQUESTED',
    })
    if (existingImage) {
      fileService.deleteFile(fileName)
    }
    const { data, errors } = await fileService.uploadFile(file, fileName)
    if (!errors) {
      dispatch({
        type: 'UPLOAD_PROFILE_PICTURE_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'UPLOAD_PROFILE_PICTURE_FAILED',
        payload: errors.items,
      })
    }
  }

  const uploadHeaderImage = async (file, fileName, existingImage) => {
    dispatch({
      type: 'UPLOAD_HEADER_IMAGE_REQUESTED',
    })
    if (existingImage) {
      fileService.deleteFile(fileName)
    }
    const { data, errors } = await fileService.uploadFile(file, fileName)
    if (!errors) {
      dispatch({
        type: 'UPLOAD_HEADER_IMAGE_SUCCESS',
        payload: data,
      })
    } else {
      dispatch({
        type: 'UPLOAD_HEADER_IMAGE_FAILED',
        payload: errors.items,
      })
    }
  }

  return (
    <FileContext.Provider value={{ ...state, uploadFile, uploadHeaderImage, uploadProfilePicture }}>
      {children}
    </FileContext.Provider>
  )
}
export default FileProvider
