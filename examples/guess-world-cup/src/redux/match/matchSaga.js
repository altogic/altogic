import _ from "lodash";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import matchService from "./matchService";
import { matchActions } from "./matchSlice";

function* getPredictionsSaga({ payload: { teamId, onSuccess, onFailure } }) {
  try {
    const {
      data: { week },
      errors: weekError,
    } = yield call(matchService.getCurrentWeek);
    if (weekError) {
      throw weekError;
    }

    const { data, errors } = yield call(
      matchService.getPredictions,
      teamId,
      week
    );
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess();
    yield put(matchActions.setPredictions(data));
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* guessScoreSaga({ payload: { prediction, onSuccess, onFailure } }) {
  try {
    const { errors } = yield call(matchService.guessScore, {
      ...prediction,
      match: prediction?.match._id,
    });
    if (errors) {
      throw errors;
    }

    const predictions = yield select((state) => state.match.predictions);
    const newPredictions = _.map(predictions, (pred) =>
      pred._id === prediction._id ? prediction : pred
    );
    yield put(matchActions.setPredictions(newPredictions));
    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

export function* createPredictionsSaga(userTeamId, leagueId) {
  try {
    const {
      data: { week },
      errors: weekError,
    } = yield call(matchService.getCurrentWeek);
    if (weekError) {
      throw weekError;
    }

    const { data: matches, errors: matchesError } = yield call(
      matchService.getWeekMatches,
      week
    );
    if (matchesError) {
      throw matchesError;
    }

    const predictions = _.map(matches, (match) => ({
      match: match._id,
      userTeam: userTeamId,
      week,
      league: leagueId,
    }));
    const { errors: predError } = yield call(
      matchService.createPredictions,
      predictions
    );
    if (predError) {
      throw predError;
    }

    return { data: true, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(matchActions.getPredictionsRequest.type, getPredictionsSaga),
    takeLatest(matchActions.guessScoreRequest.type, guessScoreSaga),
  ]);
}
