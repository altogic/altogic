import { all, fork } from "redux-saga/effects";

import authSaga from "./auth/authSaga";
import workspaceSaga from "./workspace/workspaceSaga";
import listSaga from "./list/listSaga";
import invitationSaga from "./invitation/invitationSaga";
import todoSaga from "./todo/todoSaga";
import realtimeSaga from "./realtime/realtimeSaga";

function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(workspaceSaga),
    fork(listSaga),
    fork(invitationSaga),
    fork(todoSaga),
    fork(realtimeSaga),
  ]);
}

export default rootSaga;
