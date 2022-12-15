import _ from "lodash";
import {
  all,
  call,
  debounce,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { TodoStatusTypes } from "../../helpers/utils";
import { listActions } from "../list/listSlice";
import { todoActions } from "../todo/todoSlice";
import { workspaceActions } from "../workspace/workspaceSlice";
import realtimeService from "./realtimeService";
import { realtimeActions } from "./realtimeSlice";

function* workspaceNameChangeSaga({ payload: { message, onSuccess } }) {
  const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
  const { sent, data } = message;
  if (realtimeKey === sent) return;

  if (_.isFunction(onSuccess)) onSuccess(data?.workspaceSlug);
}

function* joinedWorkspaceSaga({ payload: { message } }) {
  const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
  const { sent, data } = message;
  if (realtimeKey === sent) return;

  const workspaceSlug = yield select(({ realtime }) => realtime.workspaceSlug);
  const workspace = yield select(({ workspace }) =>
    _.get(workspace.workspaceList, workspaceSlug)
  );

  if (workspace) {
    yield put(
      workspaceActions.updateWorkspaceList({
        key: workspace.slug,
        value: {
          ...workspace,
          userProfilePictures: [...workspace.userProfilePictures, data],
        },
      })
    );
  }
}

function* leftWorkspaceSaga({ payload: { message, onSuccess } }) {
  const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
  const { sent, data: memberId } = message;
  if (realtimeKey === sent) return;

  const workspaceSlug = yield select(({ realtime }) => realtime.workspaceSlug);
  const workspace = yield select(({ workspace }) =>
    _.get(workspace.workspaceList, workspaceSlug)
  );
  const user = yield select(({ auth }) => auth.user);

  if (workspace) {
    if (memberId === user?._id) {
      if (_.isFunction(onSuccess)) onSuccess();
    } else {
      yield put(
        workspaceActions.updateWorkspaceList({
          key: workspace.slug,
          value: {
            ...workspace,
            userProfilePictures: _.reject(
              workspace.userProfilePictures,
              (profile) => profile.user === memberId
            ),
          },
        })
      );
    }
  }
}

function* newListSaga({ payload: { message } }) {
  const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
  const { sent, data } = message;
  if (realtimeKey === sent) return;

  const user = yield select(({ auth }) => auth.user);
  const workspaceSlug = yield select(({ realtime }) => realtime.workspaceSlug);

  if (data?.isPublic) {
    yield put(
      listActions.updateLists({
        key: data?.slug,
        value: data,
      })
    );
  } else if (user) {
    yield put(
      workspaceActions.getIsMemberWorkspaceRequest({
        slug: workspaceSlug,
        fromRealtime: { data },
      })
    );
  }
}

function* updateListSaga({ payload: { message, onSuccess } }) {
  const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
  const { sent, list, data } = message;
  if (realtimeKey === sent) return;

  const listSlug = yield select(({ realtime }) => realtime.listSlug);
  const workspaceSlug = yield select(({ realtime }) => realtime.workspaceSlug);

  yield put(
    listActions.removeLists({
      key: list,
    })
  );
  yield put(
    listActions.updateLists({
      key: data.slug,
      value: data,
    })
  );

  if (list === listSlug) {
    if (_.isFunction(onSuccess)) onSuccess(workspaceSlug, data.slug);
  }
}

function* deleteListSaga({ payload: { message, onSuccess } }) {
  const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
  const { sent, list } = message;
  if (realtimeKey === sent) return;

  const listSlug = yield select(({ realtime }) => realtime.listSlug);
  const workspaceSlug = yield select(({ realtime }) => realtime.workspaceSlug);

  yield put(
    listActions.removeLists({
      key: list,
    })
  );

  if (list === listSlug) {
    if (_.isFunction(onSuccess)) onSuccess(workspaceSlug);
  }
}

function* newTodoSaga({ payload: { message } }) {
  const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
  const { sent, status, list, data } = message;
  const listSlug = yield select(({ realtime }) => realtime.listSlug);
  const statusSlug = yield select(({ realtime }) => realtime.statusSlug);
  if (realtimeKey === sent || list !== listSlug) return;

  if (statusSlug === status) {
    yield put(
      todoActions.updateTodos({
        key: data?._id,
        value: data,
      })
    );
  }
  yield put(
    listActions.setTodoSize({
      key: data?.listSlug,
      type: "increase",
    })
  );
}

function* updateTodoSaga({ payload: { message } }) {
  const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
  const listSlug = yield select(({ realtime }) => realtime.listSlug);
  const statusSlug = yield select(({ realtime }) => realtime.statusSlug);
  const { sent, status, list, data } = message;
  if (realtimeKey === sent || list !== listSlug || statusSlug !== status)
    return;

  yield put(
    todoActions.updateTodos({
      key: data?._id,
      value: data,
    })
  );
}

function* changeStatusTodoSaga({ payload: { message } }) {
  const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
  const { sent, list, data } = message;
  const listSlug = yield select(({ realtime }) => realtime.listSlug);
  if (realtimeKey === sent || list !== listSlug) return;

  yield put(
    todoActions.updateTodos({
      key: data?._id,
      value: data,
    })
  );

  if (data?.status === TodoStatusTypes.TODO) {
    yield put(
      listActions.setTodoSize({
        key: data?.listSlug,
        type: "increase",
      })
    );
    yield put(
      listActions.setCompletedSize({
        key: data?.listSlug,
        type: "decrease",
      })
    );
  } else {
    yield put(
      listActions.setTodoSize({
        key: data?.listSlug,
        type: "decrease",
      })
    );
    yield put(
      listActions.setCompletedSize({
        key: data?.listSlug,
        type: "increase",
      })
    );
  }
}

function* deleteTodoSaga({ payload: { message } }) {
  const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
  const { sent, list, data } = message;
  const listSlug = yield select(({ realtime }) => realtime.listSlug);
  if (realtimeKey === sent || list !== listSlug) return;

  yield put(
    todoActions.removeTodos({
      key: data?._id,
    })
  );

  if (data?.status === TodoStatusTypes.TODO) {
    yield put(
      listActions.setTodoSize({
        key: data?.listSlug,
        type: "decrease",
      })
    );
  } else {
    yield put(
      listActions.setCompletedSize({
        key: data?.listSlug,
        type: "decrease",
      })
    );
  }
}

function* deletedWorkspaceSaga({ payload: { message, onSuccess } }) {
  const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
  const { sent } = message;
  if (realtimeKey === sent) return;

  if (_.isFunction(onSuccess)) onSuccess();
}

export default function* rootSaga() {
  yield all([
    takeEvery(
      realtimeActions.workspaceNameChangeRequest.type,
      workspaceNameChangeSaga
    ),
    takeEvery(realtimeActions.joinedWorkspaceRequest.type, joinedWorkspaceSaga),
    takeEvery(realtimeActions.leftWorkspaceRequest.type, leftWorkspaceSaga),
    takeEvery(realtimeActions.newListRequest.type, newListSaga),
    takeEvery(realtimeActions.updateListRequest.type, updateListSaga),
    takeEvery(realtimeActions.deleteListRequest.type, deleteListSaga),
    takeEvery(realtimeActions.newTodoRequest.type, newTodoSaga),
    takeEvery(realtimeActions.updateTodoRequest.type, updateTodoSaga),
    takeEvery(
      realtimeActions.changeStatusTodoRequest.type,
      changeStatusTodoSaga
    ),
    takeEvery(realtimeActions.deleteTodoRequest.type, deleteTodoSaga),
    takeEvery(
      realtimeActions.deletedWorkspaceRequest.type,
      deletedWorkspaceSaga
    ),
  ]);
}
