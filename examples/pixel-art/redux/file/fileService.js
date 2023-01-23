import { storage } from "../../configs/altogic";

const fileService = {
  upload(name, file) {
    return storage.bucket("root").upload(name, file);
  },
  delete(fileNames) {
    return storage.bucket("root").deleteFiles(fileNames);
  },
};
export default fileService;
