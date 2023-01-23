import _ from "lodash";
import { eventChannel } from "redux-saga";
import {
  all,
  apply,
  call,
  fork,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { ArtEventType } from "../../functions/constants";
import pixelService from "../pixel/pixelService";
import { pixelActions } from "../pixel/pixelSlice";
import realtimeService from "./realtimeService";
import { realtimeActions } from "./realtimeSlice";

function* drawSaga({ payload: { pixelSlug, x, y, drawColor } }) {
  const sent = yield select((state) => state.realtime.realtimeKey);
  yield apply(realtimeService, realtimeService.sendMessage, [
    pixelSlug,
    ArtEventType.DRAW,
    { data: { x, y, drawColor }, sent },
  ]);
}

function* listenSocket(socketChannel) {
  while (true) {
    try {
      const { data, sent, type } = yield take(socketChannel);

      switch (type) {
        case "join":
          const { id, data: member } = data;
          yield put(
            pixelActions.updateMembers({
              key: id,
              value: { id, ...member },
            })
          );
          break;
        case "leave":
          yield put(
            pixelActions.removeMembers({
              key: data.id,
            })
          );
          break;
        case ArtEventType.DELETED:
          window.location.href = "/";
          break;
        case ArtEventType.UPDATED_NAME:
          const pixelConn = yield select((state) =>
            _.get(state.pixel.pixelConnections, data.data.pixelSlug)
          );
          const pixel = yield select((state) =>
            _.get(state.pixel.pixels, data.data.pixelSlug)
          );
          yield put(
            pixelActions.updatePixelConnections({
              key: data.data.pixelSlug,
              value: {
                ...pixelConn,
                pixelName: data.data.name,
                pixel: {
                  ...pixel,
                  name: data.data.name,
                },
              },
            })
          );
          yield put(
            pixelActions.updatePixels({
              key: data.data.pixelSlug,
              value: {
                ...pixel,
                name: data.data.name,
              },
            })
          );
          break;
        case ArtEventType.REMOVE_MEMBER:
          const user = yield select((state) => state.auth.user);
          if (data.data === user?._id) {
            realtimeService.updateProfile({
              userId: user._id,
              name: user.name,
              profilePicture: user.profilePicture,
              slug: user.slug,
              role: "viewer",
            });
          }
          break;

        default:
          const realtimeKey = yield select(
            (state) => state.realtime.realtimeKey
          );
          if (sent !== realtimeKey) {
            yield put(pixelActions.drawPixel(data));
          }
          break;
      }
    } catch (err) {
      console.error("socket error:", err);
    }
  }
}

function* joinSaga({ payload: { pixelSlug } }) {
  realtimeService.join(pixelSlug);
  yield put(realtimeActions.setPixelSlug(pixelSlug));

  const socketChannel = yield call(createSocketChannel);
  yield fork(listenSocket, socketChannel);
  yield fork(leaveSaga, socketChannel);
  yield fork(joinMemberSaga, pixelSlug);
}

function* joinMemberSaga(pixelSlug) {
  try {
    const user = yield select((state) => state.auth.user);
    if (user) {
      const {
        data: { role },
        errors,
      } = yield call(pixelService.getRole, pixelSlug);
      if (errors) {
        throw errors;
      }

      realtimeService.updateProfile({
        userId: user._id,
        name: user.name,
        profilePicture: user.profilePicture,
        slug: user.slug,
        role,
      });
    }
  } catch (e) {
    console.error(e);
  }
}

function* leaveSaga(socketChannel) {
  while (true) {
    const {
      payload: { pixelSlug },
    } = yield take(realtimeActions.leaveRequest.type);
    realtimeService.leave(pixelSlug);
    yield put(realtimeActions.setPixelSlug(null));
    socketChannel.close();
  }
}

function createSocketChannel() {
  return eventChannel((emit) => {
    const drawHandler = (event) => {
      emit(event.message);
    };
    const joinHandler = (event) => {
      emit({ type: "join", data: event.message });
    };
    const leaveHandler = (event) => {
      emit({ type: "leave", data: event.message });
    };
    const deleteHandler = (event) => {
      emit({ type: ArtEventType.DELETED, data: event.message });
    };
    const updatedNameHandler = (event) => {
      emit({ type: ArtEventType.UPDATED_NAME, data: event.message });
    };
    const removeMemberHandler = (event) => {
      emit({ type: ArtEventType.REMOVE_MEMBER, data: event.message });
    };

    // setup the subscription
    realtimeService.listen(ArtEventType.DRAW, drawHandler);
    realtimeService.listen("channel:join", joinHandler);
    realtimeService.listen("channel:update", joinHandler);
    realtimeService.listen("channel:leave", leaveHandler);
    realtimeService.listen(ArtEventType.DELETED, deleteHandler);
    realtimeService.listen(ArtEventType.UPDATED_NAME, updatedNameHandler);
    realtimeService.listen(ArtEventType.REMOVE_MEMBER, removeMemberHandler);

    const unsubscribe = () => {
      realtimeService.removeListen(ArtEventType.DRAW);
      realtimeService.removeListen("channel:join");
      realtimeService.removeListen("channel:update");
      realtimeService.removeListen("channel:leave");
      realtimeService.removeListen(ArtEventType.DELETED);
      realtimeService.removeListen(ArtEventType.UPDATED_NAME);
      realtimeService.removeListen(ArtEventType.REMOVE_MEMBER);
    };

    return unsubscribe;
  });
}

function* getMembersSaga({ payload: { pixelSlug } }) {
  try {
    const { data, errors } = yield call(realtimeService.getMembers, pixelSlug);
    if (errors) {
      throw errors;
    }
    let newMembers = {};

    if (!_.isEmpty(data)) {
      for (const { id, data: member } of data) {
        newMembers[id] = { id, ...member };
      }
      yield put(pixelActions.setMembers(newMembers));
    }
  } catch (e) {
    console.error(e);
  }
}

export default function* realtimeSaga() {
  yield all([
    takeEvery(realtimeActions.joinRequest.type, joinSaga),
    takeEvery(realtimeActions.drawRequest.type, drawSaga),
    takeLatest(realtimeActions.getMembersRequest.type, getMembersSaga),
  ]);
}
