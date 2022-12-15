import _ from "lodash";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { EventType } from "../../helpers/useRealtime";
import { TodoStatusTypes } from "../../helpers/utils";
import { listActions } from "../list/listSlice";
import realtimeService from "../realtime/realtimeService";
import todoService from "./todoService";
import { todoActions } from "./todoSlice";

function* getTodosSaga({
  payload: { listSlug, status, searchText, isNewSearch, onSuccess, onFailure },
}) {
  try {
    const info = yield select(({ todo }) => todo.info);
    const searchedText = yield select(({ todo }) => todo.searchText);
    const page = _.isNil(info) || isNewSearch ? 1 : info.currentPage + 1;

    if (isNewSearch || _.isNil(info) || info?.currentPage < info?.totalPages) {
      const { data: todos, errors } = yield call(todoService.getTodoList, {
        listSlug,
        status,
        searchText: isNewSearch ? searchText : searchedText,
        page,
      });
      if (errors) {
        throw errors;
      }
      let newTodos = {};

      if (!_.isEmpty(todos?.result)) {
        for (const todo of todos?.result) {
          newTodos[todo._id] = todo;
        }
      }

      if (isNewSearch) {
        yield put(todoActions.setSearchText(searchText));
      }
      yield put(
        todoActions.setTodos({
          newTodos,
          page,
        })
      );
      yield put(todoActions.setInfo(todos?.countInfo));
    }

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* createTodoSaga({
  payload: { body, workspaceSlug, listSlug, status, onSuccess, onFailure },
}) {
  try {
    const { data: createdTodo, errors } = yield call(
      todoService.createTodo,
      body
    );
    if (errors) {
      throw errors;
    }

    yield put(
      todoActions.updateTodos({
        key: createdTodo?._id,
        value: createdTodo,
      })
    );
    yield put(
      listActions.setTodoSize({
        key: createdTodo?.listSlug,
        type: "increase",
      })
    );

    const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
    realtimeService.sendMessage(workspaceSlug, EventType.NEW_TODO, {
      sent: realtimeKey,
      list: listSlug,
      status,
      data: createdTodo,
    });
    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* updateTodoSaga({
  payload: { body, workspaceSlug, listSlug, status, onSuccess, onFailure },
}) {
  try {
    const { data: updatedTodo, errors } = yield call(
      todoService.updateTodo,
      body
    );
    if (errors) {
      throw errors;
    }

    yield put(
      todoActions.updateTodos({
        key: updatedTodo?._id,
        value: updatedTodo,
      })
    );

    const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
    realtimeService.sendMessage(workspaceSlug, EventType.UPDATE_TODO, {
      sent: realtimeKey,
      list: listSlug,
      status,
      data: updatedTodo,
    });
    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* updateFieldsTodoSaga({
  payload: { todoId, fields, onSuccess, onFailure },
}) {
  try {
    const { data: updatedTodo, errors } = yield call(
      todoService.updateFieldsTodo,
      todoId,
      fields
    );
    if (errors) {
      throw errors;
    }

    yield put(
      todoActions.updateTodos({
        key: updatedTodo?._id,
        value: updatedTodo,
      })
    );

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* changeStatusTodoSaga({
  payload: {
    todoId,
    newStatus,
    listSlug,
    workspaceSlug,
    currentStatus,
    onSuccess,
    onFailure,
  },
}) {
  try {
    const { data: updatedTodo, errors } = yield call(
      todoService.changeStatusTodo,
      todoId,
      newStatus
    );
    if (errors) {
      throw errors;
    }

    yield put(
      todoActions.updateTodos({
        key: updatedTodo?._id,
        value: updatedTodo,
      })
    );
    if (updatedTodo.status === TodoStatusTypes.TODO) {
      yield put(
        listActions.setTodoSize({
          key: updatedTodo?.listSlug,
          type: "increase",
        })
      );
      yield put(
        listActions.setCompletedSize({
          key: updatedTodo?.listSlug,
          type: "decrease",
        })
      );
    } else {
      yield put(
        listActions.setTodoSize({
          key: updatedTodo?.listSlug,
          type: "decrease",
        })
      );
      yield put(
        listActions.setCompletedSize({
          key: updatedTodo?.listSlug,
          type: "increase",
        })
      );
    }

    const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);

    realtimeService.sendMessage(workspaceSlug, EventType.CHANGE_STATUS_TODO, {
      sent: realtimeKey,
      list: listSlug,
      status: currentStatus,
      data: updatedTodo,
    });
    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* deleteTodoSaga({
  payload: { todoId, workspaceSlug, onSuccess, onFailure },
}) {
  try {
    const { data: deletedTodo, errors } = yield call(
      todoService.deleteTodo,
      todoId
    );
    if (errors) {
      throw errors;
    }

    yield put(
      todoActions.removeTodos({
        key: todoId,
      })
    );

    if (deletedTodo.status === TodoStatusTypes.TODO) {
      yield put(
        listActions.setTodoSize({
          key: deletedTodo?.listSlug,
          type: "decrease",
        })
      );
    } else {
      yield put(
        listActions.setCompletedSize({
          key: deletedTodo?.listSlug,
          type: "decrease",
        })
      );
    }

    const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
    realtimeService.sendMessage(workspaceSlug, EventType.DELETE_TODO, {
      sent: realtimeKey,
      list: deletedTodo?.listSlug,
      status: deletedTodo?.status,
      data: deletedTodo,
    });
    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(todoActions.getTodosRequest.type, getTodosSaga),
    takeLatest(todoActions.createTodoRequest.type, createTodoSaga),
    takeLatest(todoActions.updateTodoRequest.type, updateTodoSaga),
    takeLatest(todoActions.updateFieldsTodoRequest.type, updateFieldsTodoSaga),
    takeLatest(todoActions.changeStatusTodoRequest.type, changeStatusTodoSaga),
    takeLatest(todoActions.deleteTodoRequest.type, deleteTodoSaga),
  ]);
}
