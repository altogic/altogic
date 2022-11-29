import { all, fork } from "redux-saga/effects";
import authSaga from "./auth/authSaga";
import leagueSaga from "./league/leagueSaga";
import matchSaga from "./match/matchSaga";

function* rootSaga() {
  yield all([fork(authSaga), fork(leagueSaga), fork(matchSaga)]);
}

export default rootSaga;
