import _ from "lodash";
import { all, call, fork, put, select, takeLatest } from "redux-saga/effects";
import { deleteFileSaga, uploadFileSaga } from "../file/fileSaga";
import authService from "./authService";
import { authActions } from "./authSlice";

function* registerSaga({ payload: { userReq, onSuccess, onFailure } }) {
  try {
    const { errors } = yield call(authService.register, userReq);
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* checkUserNameSaga({
  payload: { userName, userId, onSuccess, onFailure },
}) {
  try {
    const { data, errors } = yield call(
      authService.checkUserName,
      userName,
      userId
    );
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess(data.isAvailable);
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* signInSaga({ payload: { email, password, onSuccess, onFailure } }) {
  try {
    const { user, errors } = yield call(authService.signIn, email, password);
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess();
    yield put(authActions.setUser(user));
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* forgotPasswordSaga({ payload: { email, onSuccess, onFailure } }) {
  try {
    const { errors } = yield call(authService.forgotPassword, email);
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* signInWithTokenSaga({
  payload: { accessToken, onSuccess, onFailure },
}) {
  try {
    const { user, errors } = yield call(
      authService.signInWithToken,
      accessToken
    );
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess(user);
    yield put(authActions.setUser(user));
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* signOutSaga({ payload: { onSuccess, onFailure } }) {
  try {
    const { errors } = yield call(authService.signOut);
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess();
    yield put(authActions.setUser(null));
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* getUserFromDBSaga() {
  const user = yield select((state) => state.auth.user);

  if (!_.isNil(user)) {
    try {
      const { user: fetchedUser, errors } = yield call(
        authService.getUserFromDB
      );
      if (errors) {
        throw errors;
      }

      authService.setUser(fetchedUser);
      yield put(authActions.setUser(fetchedUser));
    } catch (e) {}
  }
}

function* updateUserFieldsSaga({
  payload: { userId, fields, onSuccess, onFailure },
}) {
  try {
    const { data: updatedUser, errors } = yield call(
      authService.updateUserFields,
      userId,
      fields
    );
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess();
    authService.setUser(updatedUser);
    yield put(authActions.setUser(updatedUser));
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* uploadProfilePictureSaga({
  payload: { userId, file, onSuccess, onFailure },
}) {
  try {
    const {
      data: { publicPath },
      errors: fileErrors,
    } = yield call(uploadFileSaga, { name: `user_${userId}`, file });
    if (fileErrors) {
      throw fileErrors;
    }

    const { data: updatedUser, errors } = yield call(
      authService.updateUserFields,
      userId,
      { profilePicture: publicPath }
    );
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess();
    authService.setUser(updatedUser);
    yield put(authActions.setUser(updatedUser));
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* deleteProfilePictureSaga({
  payload: { userId, onSuccess, onFailure },
}) {
  try {
    const { errors: fileErrors } = yield call(deleteFileSaga, {
      name: `user_${userId}`,
    });
    if (fileErrors) {
      throw fileErrors;
    }

    const { data: updatedUser, errors } = yield call(
      authService.updateUserFields,
      userId,
      { profilePicture: null }
    );
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess();
    authService.setUser(updatedUser);
    yield put(authActions.setUser(updatedUser));
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* changeEmailSaga({
  payload: { newEmail, password, onSuccess, onFailure },
}) {
  try {
    const { errors } = yield call(authService.changeEmail, newEmail, password);
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* resendVerificationEmailSaga({
  payload: { email, onSuccess, onFailure },
}) {
  try {
    const { errors } = yield call(authService.resendVerificationEmail, email);
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* changePasswordSaga({
  payload: { currentPassword, newPassword, onSuccess, onFailure },
}) {
  try {
    const { errors } = yield call(
      authService.changePassword,
      currentPassword,
      newPassword
    );
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

export function* setUserLocalSaga(user) {
  authService.setUser(user);
  yield put(authActions.setUser(user));
}

export default function* rootSaga() {
  yield all([
    fork(getUserFromDBSaga),
    takeLatest(authActions.registerRequest.type, registerSaga),
    takeLatest(authActions.checkUserNameRequest.type, checkUserNameSaga),
    takeLatest(authActions.signInRequest.type, signInSaga),
    takeLatest(authActions.forgotPasswordRequest.type, forgotPasswordSaga),
    takeLatest(authActions.signInWithTokenRequest.type, signInWithTokenSaga),
    takeLatest(authActions.signOutRequest.type, signOutSaga),
    takeLatest(authActions.updateUserFieldsRequest.type, updateUserFieldsSaga),
    takeLatest(
      authActions.uploadProfilePictureRequest.type,
      uploadProfilePictureSaga
    ),
    takeLatest(
      authActions.deleteProfilePictureRequest.type,
      deleteProfilePictureSaga
    ),
    takeLatest(authActions.changeEmailRequest.type, changeEmailSaga),
    takeLatest(
      authActions.resendVerificationEmailRequest.type,
      resendVerificationEmailSaga
    ),
    takeLatest(authActions.changePasswordRequest.type, changePasswordSaga),
  ]);
}
