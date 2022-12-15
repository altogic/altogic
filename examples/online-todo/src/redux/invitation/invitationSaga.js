import _ from "lodash";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { InvitationEventType } from "../../helpers/useInivitationRealtime";
import { EventType } from "../../helpers/useRealtime";
import realtimeService from "../realtime/realtimeService";
import { workspaceActions } from "../workspace/workspaceSlice";
import invitationService from "./invitationService";
import { invitationActions } from "./invitationSlice";

function* sendInvitationSaga({
  payload: { workspaceId, email, workspaceName, onSuccess, onFailure },
}) {
  try {
    const { errors } = yield call(
      invitationService.sendInvitation,
      workspaceId,
      email
    );
    if (errors) {
      throw errors;
    }

    realtimeService.sendMessage(email, InvitationEventType.INVITE_MEMBER, {
      invitedEmail: email,
      workspaceId,
      workspaceName,
    });
    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* joinWorkspaceSaga({
  payload: { workspaceId, email, onSuccess, onFailure },
}) {
  try {
    const { data, errors } = yield call(
      invitationService.joinWorkspace,
      workspaceId,
      email
    );
    if (errors) {
      throw errors;
    }

    yield put(
      workspaceActions.updateWorkspaces({
        key: data.workspaceConnection.workspaceSlug,
        value: {
          ...data.workspaceConnection,
          workspace: {
            ...data.workspace,
          },
        },
      })
    );
    if (_.isFunction(onSuccess))
      onSuccess(data.workspaceConnection.workspaceSlug);

    const user = yield select(({ auth }) => auth.user);
    const realtimeKey = yield select(({ realtime }) => realtime.realtimeKey);
    realtimeService.sendMessage(
      data.workspaceConnection.workspaceSlug,
      EventType.JOINED_WORKSPACE,
      {
        sent: realtimeKey,
        data: {
          _parent: workspaceId,
          user: user?._id,
          userName: user?.name,
          profilePicture: user?.profilePicture,
        },
      }
    );
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(
      invitationActions.sendInvitationRequest.type,
      sendInvitationSaga
    ),
    takeLatest(invitationActions.joinWorkspaceRequest.type, joinWorkspaceSaga),
  ]);
}
