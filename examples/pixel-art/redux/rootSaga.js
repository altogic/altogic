import { all, fork } from "redux-saga/effects";

import authSaga from "./auth/authSaga";
import pixelSaga from "./pixel/pixelSaga";
import realtimeSaga from "./realtime/realtimeSaga";

function* rootSaga() {
  yield all([fork(authSaga), fork(pixelSaga), fork(realtimeSaga)]);
}

export default rootSaga;
