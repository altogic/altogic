import { storage } from '@/utils/altogic'
const FileService = {
  uploadFile: async (file, fileName) => {
    return await storage.bucket('root').upload(fileName, file)
  },
  deleteFile: async (fileName) => {
    return await storage.bucket('root').file(fileName).delete()
  },
}
export default FileService
