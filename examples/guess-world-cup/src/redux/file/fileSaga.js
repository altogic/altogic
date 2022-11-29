import { call } from "redux-saga/effects";
import fileService from "./fileService";

export function* uploadFileSaga({ name, file }) {
  yield call(fileService.delete, [name]);
  try {
    const { data, errors: fileErrors } = yield call(
      fileService.upload,
      name,
      file
    );
    if (fileErrors) {
      throw fileErrors;
    }

    return { data, errors: null };
  } catch (e) {
    return { data: null, errors: e };
  }
}

export function* deleteFileSaga({ name }) {
  try {
    const { errors } = yield call(fileService.delete, [name]);
    if (errors) {
      throw errors;
    }

    return { errors: null };
  } catch (e) {
    return { errors: e };
  }
}
