import _ from "lodash";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { EventType } from "../../helpers/useRealtime";
import realtimeService from "../realtime/realtimeService";
import workspaceService from "../workspace/workspaceService";
import listService from "./listService";
import { listActions } from "./listSlice";

function* getListsSaga({
  payload: {
    workspaceSlug,
    userId,
    searchText,
    isNewSearch,
    onSuccess,
    onFailure,
  },
}) {
  try {
    const info = yield select(({ list }) => list.info);
    const page = _.isNil(info) || isNewSearch ? 1 : info.currentPage + 1;
    let isMember;

    if (isNewSearch || _.isNil(info) || info?.currentPage < info?.totalPages) {
      const { data: lists, errors } = yield call(listService.getLists, {
        workspaceSlug,
        userId,
        page,
      });
      if (errors) {
        throw errors;
      }

      if (userId) {
        const { data, errors } = yield call(
          workspaceService.isMemberWorkspace,
          workspaceSlug
        );
        if (errors) {
          throw errors;
        }
        isMember = data.isMember;
      }
      const result = _.filter(
        lists?.result,
        (result) => result.isPublic || isMember
      );
      let newLists = {};

      if (!_.isEmpty(result)) {
        for (const list of result) {
          newLists[list.slug] = list;
        }
      }

      if (isNewSearch) {
        yield put(listActions.setSearchText(searchText));
      }
      yield put(
        listActions.setLists({
          newLists,
          page,
        })
      );
      yield put(listActions.setInfo(lists?.countInfo));
    }

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* getListBySlugSaga({
  payload: { listSlug, userId, onSuccess, onFailure },
}) {
  try {
    const { data, errors } = yield call(
      listService.getListBySlug,
      listSlug,
      userId
    );
    if (errors) {
      throw errors;
    }

    yield put(
      listActions.updateLists({
        key: data.slug,
        value: data,
      })
    );

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* createListSaga({
  payload: { body, workspaceSlug, onSuccess, onFailure },
}) {
  try {
    const { data, errors } = yield call(listService.createList, body);
    if (errors) {
      throw errors;
    }

    yield put(
      listActions.updateLists({
        key: data.slug,
        value: data,
      })
    );

    const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
    realtimeService.sendMessage(workspaceSlug, EventType.NEW_LIST, {
      sent: realtimeKey,
      data,
    });
    if (_.isFunction(onSuccess)) onSuccess(data.slug);
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* deleteListSaga({
  payload: { listId, listSlug, workspaceSlug, onSuccess, onFailure },
}) {
  try {
    const { errors } = yield call(listService.deleteList, listId);
    if (errors) {
      throw errors;
    }

    yield put(
      listActions.removeLists({
        key: listSlug,
      })
    );

    const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
    realtimeService.sendMessage(workspaceSlug, EventType.DELETE_LIST, {
      sent: realtimeKey,
      list: listSlug,
    });
    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* updateListSaga({
  payload: { body, listSlug, workspaceSlug, onSuccess, onFailure },
}) {
  try {
    const { data: updatedList, errors } = yield call(
      listService.updateList,
      body
    );
    if (errors) {
      throw errors;
    }

    yield put(
      listActions.removeLists({
        key: listSlug,
      })
    );
    yield put(
      listActions.updateLists({
        key: updatedList.slug,
        value: updatedList,
      })
    );

    const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
    realtimeService.sendMessage(workspaceSlug, EventType.UPDATE_LIST, {
      sent: realtimeKey,
      list: listSlug,
      data: updatedList,
    });
    if (_.isFunction(onSuccess)) onSuccess(body.slug);
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(listActions.getListsRequest.type, getListsSaga),
    takeLatest(listActions.getListBySlugRequest.type, getListBySlugSaga),
    takeLatest(listActions.createListRequest.type, createListSaga),
    takeLatest(listActions.deleteListRequest.type, deleteListSaga),
    takeLatest(listActions.updateListRequest.type, updateListSaga),
  ]);
}
