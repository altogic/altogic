const fileReducer = {
  initialState: {
    file: {},
    fileUrl: '',
    profilePicture: {},
    profilePictureUrl: '',
    headerImage: {},
    headerImageUrl: '',
    ppLoading: false,
    headerLoading: false,
    error: null,
  },
  reducer: (state, action) => {
    switch (action.type) {
      case 'UPLOAD_FILE_REQUESTED':
        return {
          ...state,
          loading: true,
          error: null,
        }
      case 'UPLOAD_FILE_SUCCESS':
        return {
          ...state,
          file: action.payload,
          fileUrl: action.payload.publicPath,
          loading: false,
          error: null,
        }
      case 'UPLOAD_FILE_FAILED':
        return {
          ...state,
          ppLoading: false,
          error: action.payload,
        }
      case 'UPLOAD_PROFILE_PICTURE_REQUESTED':
        return {
          ...state,
          ppLoading: true,
          error: null,
        }

      case 'UPLOAD_PROFILE_PICTURE_SUCCESS':
        return {
          ...state,
          profilePicture: action.payload,
          profilePictureUrl: action.payload.publicPath,
          ppLoading: false,
          error: null,
        }
      case 'UPLOAD_PROFILE_PICTURE_FAILED':
        return {
          ...state,
          ppLoading: false,
          error: action.payload,
        }
      case 'UPLOAD_HEADER_IMAGE_REQUESTED':
        return {
          ...state,
          headerLoading: true,
          error: null,
        }

      case 'UPLOAD_HEADER_IMAGE_SUCCESS':
        return {
          ...state,
          headerImage: action.payload,
          headerImageUrl: action.payload.publicPath,
          headerLoading: false,
          error: null,
        }
      case 'UPLOAD_HEADER_IMAGE_FAILED':
        return {
          ...state,
          headerLoading: false,
          error: action.payload,
        }

      default:
        return state
    }
  },
}
export default fileReducer
