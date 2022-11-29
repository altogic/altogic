import _ from "lodash";
import { all, call, fork, put, select, takeLatest } from "redux-saga/effects";
import { setUserLocalSaga } from "../auth/authSaga";
import { createPredictionsSaga } from "../match/matchSaga";
import leagueService from "./leagueService";
import { leagueActions } from "./leagueSlice";

function* createSaga({
  payload: { teamName, leagueName, userName, onSuccess, onFailure },
}) {
  try {
    const { data, errors } = yield call(leagueService.create, {
      teamName,
      leagueName,
      userName,
    });
    if (errors) {
      throw errors;
    }

    const user = yield select((state) => state.auth.user);
    yield fork(setUserLocalSaga, {
      ...user,
      leagues: user.leagues
        ? [...user.leagues, data?.userLeague]
        : [data?.userLeague],
    });
    const { error } = yield call(
      createPredictionsSaga,
      data?.userLeague.team,
      data?.league._id
    );
    if (error) {
      throw error;
    }

    yield put(leagueActions.setLeague(data?.league));
    yield put(leagueActions.setTeamId(data?.userLeague.team));
    if (_.isFunction(onSuccess)) onSuccess(data?.league.slug);
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* checkLeagueNameSaga({
  payload: { leagueName, leagueId, onSuccess, onFailure },
}) {
  try {
    const { data, errors } = yield call(
      leagueService.checkLeagueName,
      leagueName,
      leagueId
    );
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess(data.isAvailable);
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* getLeagueBySlugSaga({
  payload: { leagueSlug, onSuccess, onFailure },
}) {
  try {
    const currentUser = yield select((state) => state.auth.user);

    const { data: teams, errors: teamErrors } = yield call(
      leagueService.getTeamsByLeagueSlug,
      leagueSlug
    );
    if (teamErrors) {
      throw teamErrors;
    }
    const userTeam = _.find(teams, (team) => team.user._id === currentUser._id);
    if (!userTeam) {
      throw new Error("The league has not user's team");
    }

    const { data: league, errors: leagueErrors } = yield call(
      leagueService.getLeagueBySlug,
      leagueSlug
    );
    if (leagueErrors) {
      throw leagueErrors;
    }

    yield put(leagueActions.setTeamId(userTeam._id));
    if (_.isFunction(onSuccess)) onSuccess(_.first(league));
    yield put(
      leagueActions.setLeague({
        ..._.first(league),
        teams,
      })
    );
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* checkleagueCodeSaga({
  payload: { leagueCode, onSuccess, onFailure },
}) {
  try {
    const { data, errors } = yield call(
      leagueService.checkLeagueCode,
      leagueCode
    );
    if (errors) {
      throw errors;
    }
    if (_.isFunction(onSuccess))
      onSuccess({
        isAvailable: data?.available?.isAvailable || data?.isAvailable,
        league: data?.league,
      });
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* joinSaga({
  payload: { teamName, leagueId, leagueSlug, onSuccess, onFailure },
}) {
  try {
    const { data: userLeague, errors } = yield call(leagueService.join, {
      teamName,
      leagueId,
      leagueSlug,
    });
    if (errors) {
      throw errors;
    }

    const user = yield select((state) => state.auth.user);
    yield fork(setUserLocalSaga, {
      ...user,
      leagues: user.leagues ? [...user.leagues, userLeague] : [userLeague],
    });

    const { error } = yield call(
      createPredictionsSaga,
      userLeague.team,
      leagueId
    );
    if (error) {
      throw error;
    }

    if (_.isFunction(onSuccess)) onSuccess(userLeague.slug);
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* changeLeagueNameSaga({
  payload: { leagueId, leagueName, onSuccess, onFailure },
}) {
  try {
    const { data: updatedLeague, errors } = yield call(
      leagueService.changeLeagueName,
      leagueId,
      leagueName
    );
    if (errors) {
      throw errors;
    }

    const teams = yield select((state) => state.league.league.teams);
    const user = yield select((state) => state.auth.user);
    const newUserLeagues = _.map(user.leagues, (league) =>
      league.league === leagueId
        ? {
            ...league,
            slug: updatedLeague?.slug,
          }
        : league
    );

    yield put(
      leagueActions.setLeague({
        ...updatedLeague,
        teams,
      })
    );
    yield fork(setUserLocalSaga, {
      ...user,
      leagues: newUserLeagues,
    });

    if (_.isFunction(onSuccess)) onSuccess(updatedLeague?.slug);
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* deleteTeamSaga({
  payload: { leagueId, teamId, userId, onSuccess, onFailure },
}) {
  try {
    const { errors } = yield call(
      leagueService.deleteTeam,
      leagueId,
      teamId,
      userId
    );
    if (errors) {
      throw errors;
    }

    const league = yield select((state) => state.league.league);

    yield put(
      leagueActions.setLeague({
        ...league,
        teams: _.reject(league.teams, (team) => team._id === teamId),
      })
    );
    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* removeLeagueSaga({ payload: { leagueId, onSuccess, onFailure } }) {
  try {
    const { errors } = yield call(leagueService.deleteLeague, leagueId);
    if (errors) {
      throw errors;
    }

    const user = yield select((state) => state.auth.user);
    yield fork(setUserLocalSaga, {
      ...user,
      leagues: _.reject(user?.leagues, (league) => league.league === leagueId),
    });
    yield put(leagueActions.setLeague(null));
    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(leagueActions.createRequest.type, createSaga),
    takeLatest(leagueActions.checkLeagueNameRequest.type, checkLeagueNameSaga),
    takeLatest(leagueActions.getLeagueBySlugRequest.type, getLeagueBySlugSaga),
    takeLatest(leagueActions.checkleagueCodeRequest.type, checkleagueCodeSaga),
    takeLatest(leagueActions.joinRequest.type, joinSaga),
    takeLatest(
      leagueActions.changeLeagueNameRequest.type,
      changeLeagueNameSaga
    ),
    takeLatest(leagueActions.deleteTeamRequest.type, deleteTeamSaga),
    takeLatest(leagueActions.removeLeagueRequest.type, removeLeagueSaga),
  ]);
}
