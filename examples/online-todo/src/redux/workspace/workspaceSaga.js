import _ from "lodash";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { EventType } from "../../helpers/useRealtime";
import { listActions } from "../list/listSlice";
import realtimeService from "../realtime/realtimeService";
import workspaceService from "./workspaceService";
import { workspaceActions } from "./workspaceSlice";

function* getWorkspaceListSaga({
  payload: { searchText, isNewSearch, onSuccess, onFailure },
}) {
  try {
    const info = yield select(({ workspace }) => workspace.info);
    const searchedText = yield select(({ workspace }) => workspace.searchText);
    const page = _.isNil(info) || isNewSearch ? 1 : info.currentPage + 1;

    if (isNewSearch || _.isNil(info) || info?.currentPage < info?.totalPages) {
      const user = yield select((state) => state.auth.user);
      const { data: workspaceConncectionList, errors } = yield call(
        workspaceService.getWorkspaceList,
        {
          userId: user?._id,
          searchText: isNewSearch ? searchText : searchedText,
          page,
        }
      );
      if (errors) {
        throw errors;
      }
      let newWorkspaces = {};
      let newWorkspaceList = {};

      if (!_.isEmpty(workspaceConncectionList?.data)) {
        for (const workspace of workspaceConncectionList?.data) {
          newWorkspaces[workspace.workspaceSlug] = workspace;
          newWorkspaceList[workspace.workspaceSlug] = workspace.workspace;
        }
      }
      if (isNewSearch) {
        yield put(workspaceActions.setSearchText(searchText));
      }
      yield put(
        workspaceActions.setWorkspaces({
          newWorkspaces,
          page,
        })
      );
      yield put(workspaceActions.setInfo(workspaceConncectionList?.info));
      yield put(
        workspaceActions.setWorkspaceList({
          newWorkspaceList,
        })
      );
    }

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* createWorkspaceSaga({
  payload: { name, description, isPublic, onSuccess, onFailure },
}) {
  try {
    const user = yield select((state) => state.auth.user);
    const body = {
      name,
      description,
      isPublic,
      userName: user.name,
      userProfilePicture: user.profilePicture,
    };

    const {
      data: { workspaceSlug },
      errors,
    } = yield call(workspaceService.createWorkspace, body);
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess(workspaceSlug);
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* getWorkspaceBySlugSaga({
  payload: { userId, slug, onSuccess, onFailure },
}) {
  try {
    const { data: workspaceConnection, errors } = yield call(
      workspaceService.getWorkspaceBySlug,
      userId,
      slug
    );
    if (errors) {
      throw errors;
    }

    yield put(
      workspaceActions.updateWorkspaces({
        key: workspaceConnection.workspaceSlug,
        value: workspaceConnection,
      })
    );
    if (_.isFunction(onSuccess)) onSuccess(workspaceConnection.isOwner);
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* updateWorkspaceSaga({
  payload: { slug, body, onSuccess, onFailure },
}) {
  try {
    const { errors } = yield call(workspaceService.updateWorkspace, body);
    if (errors) {
      throw errors;
    }

    const workspace = yield select(({ workspace }) =>
      _.get(workspace.workspaces, slug)
    );
    const slugChanged = slug !== body.slug;

    const updatedWorkspace = {
      ...workspace,
      workspaceName: body.name,
      workspaceSlug: body.slug,
      workspace: {
        ...workspace.workspace,
        description: body.description,
        slug: body.slug,
      },
    };
    yield put(
      workspaceActions.updateWorkspaces({
        key: updatedWorkspace.workspaceSlug,
        value: updatedWorkspace,
      })
    );

    if (slugChanged) {
      const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
      realtimeService.sendMessage(slug, EventType.WORKSPACE_NAME_CHANGED, {
        sent: realtimeKey,
        data: updatedWorkspace,
      });
    }
    if (_.isFunction(onSuccess))
      onSuccess(slugChanged, updatedWorkspace.workspaceSlug);
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* deleteWorkspaceSaga({
  payload: { workspaceId, workspaceSlug, onSuccess, onFailure },
}) {
  try {
    const { errors } = yield call(
      workspaceService.deleteWorkspace,
      workspaceId
    );
    if (errors) {
      throw errors;
    }

    yield put(
      workspaceActions.removeWorkspaces({
        key: workspaceSlug,
      })
    );
    const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
    realtimeService.sendMessage(workspaceSlug, EventType.WORKSPACE_DELETED, {
      sent: realtimeKey,
    });
    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* getWorkspaceMembersSaga({
  payload: { workspaceSlug, searchText, isNewSearch, onSuccess, onFailure },
}) {
  try {
    const info = yield select(({ workspace }) => workspace.memberInfo);
    const searchedText = yield select(
      ({ workspace }) => workspace.memberSearchText
    );
    const page = _.isNil(info) || isNewSearch ? 1 : info.currentPage + 1;

    if (isNewSearch || _.isNil(info) || info?.currentPage < info?.totalPages) {
      const { data: workspaceConnectionList, errors } = yield call(
        workspaceService.getWorkspaceMembers,
        {
          workspaceSlug,
          searchText: isNewSearch ? searchText : searchedText,
          page,
        }
      );
      if (errors) {
        throw errors;
      }
      let newMembers = {};

      if (!_.isEmpty(workspaceConnectionList?.data)) {
        for (const { user } of workspaceConnectionList?.data) {
          newMembers[user._id] = user;
        }
      }

      if (isNewSearch) {
        yield put(workspaceActions.setMemberSearchText(searchText));
      }
      yield put(
        workspaceActions.setMembers({
          newMembers,
          page,
        })
      );
      yield put(workspaceActions.setMemberInfo(workspaceConnectionList?.info));
    }

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* deleteMemberSaga({
  payload: { workspaceId, workspaceSlug, memberId, onSuccess, onFailure },
}) {
  try {
    const { errors } = yield call(
      workspaceService.deleteMember,
      workspaceId,
      memberId
    );
    if (errors) {
      throw errors;
    }

    const user = yield select(({ auth }) => auth.user);
    if (user._id === memberId) {
      yield put(
        workspaceActions.removeWorkspaces({
          key: workspaceSlug,
        })
      );
    } else {
      yield put(
        workspaceActions.removeMembers({
          key: memberId,
        })
      );
    }
    const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
    realtimeService.sendMessage(workspaceSlug, EventType.LEAVED_WORKSPACE, {
      sent: realtimeKey,
      data: memberId,
    });
    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* getWorkspaceListBySlugSaga({
  payload: { userId, slug, onSuccess, onFailure },
}) {
  try {
    const { data: workspace, errors } = yield call(
      workspaceService.getWorkspaceListBySlug,
      slug,
      userId
    );
    if (errors) {
      throw errors;
    }

    yield put(
      workspaceActions.updateWorkspaceList({
        key: workspace.slug,
        value: workspace,
      })
    );
    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* getIsMemberWorkspaceSaga({
  payload: { slug, fromRealtime, onSuccess, onFailure },
}) {
  try {
    const { data, errors } = yield call(
      workspaceService.isMemberWorkspace,
      slug
    );
    if (errors) {
      throw errors;
    }

    if (data.isMember && fromRealtime) {
      yield put(
        listActions.updateLists({
          key: fromRealtime.data?.slug,
          value: fromRealtime.data,
        })
      );
    }
    if (_.isFunction(onSuccess)) onSuccess(data.isMember);
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(
      workspaceActions.getWorkspaceListRequest.type,
      getWorkspaceListSaga
    ),
    takeLatest(
      workspaceActions.createWorkspaceRequest.type,
      createWorkspaceSaga
    ),
    takeLatest(
      workspaceActions.getWorkspaceBySlugRequest.type,
      getWorkspaceBySlugSaga
    ),
    takeLatest(
      workspaceActions.updateWorkspaceRequest.type,
      updateWorkspaceSaga
    ),
    takeLatest(
      workspaceActions.deleteWorkspaceRequest.type,
      deleteWorkspaceSaga
    ),
    takeLatest(
      workspaceActions.getWorkspaceMembersRequest.type,
      getWorkspaceMembersSaga
    ),
    takeLatest(workspaceActions.deleteMemberRequest.type, deleteMemberSaga),
    takeLatest(
      workspaceActions.getWorkspaceListBySlugRequest.type,
      getWorkspaceListBySlugSaga
    ),
    takeLatest(
      workspaceActions.getIsMemberWorkspaceRequest.type,
      getIsMemberWorkspaceSaga
    ),
  ]);
}
