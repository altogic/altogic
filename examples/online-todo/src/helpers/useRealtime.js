import _ from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { listActions } from "../redux/list/listSlice";
import realtimeService from "../redux/realtime/realtimeService";
import { realtimeActions } from "../redux/realtime/realtimeSlice";
import { todoActions } from "../redux/todo/todoSlice";
import { workspaceActions } from "../redux/workspace/workspaceSlice";
import { myRouter } from "./routes";
import useQuery from "./useQuery";
import { TodoStatusTypes } from "./utils";

export const EventType = {
  WORKSPACE_NAME_CHANGED: "WORKSPACE_NAME_CHANGED",
  WORKSPACE_DELETED: "WORKSPACE_DELETED",
  JOINED_WORKSPACE: "JOINED_WORKSPACE",
  LEAVED_WORKSPACE: "LEAVED_WORKSPACE",

  NEW_LIST: "NEW_LIST",
  UPDATE_LIST: "UPDATE_LIST",
  DELETE_LIST: "DELETE_LIST",

  NEW_TODO: "NEW_TODO",
  UPDATE_TODO: "UPDATE_TODO",
  CHANGE_STATUS_TODO: "CHANGE_STATUS_TODO",
  DELETE_TODO: "DELETE_TODO",
};

export default function useListenRealtime() {
  const { workspaceSlug, listSlug } = useParams();
  const statusSlug = useQuery("status");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const newList = ({ message }) => {
    dispatch(
      realtimeActions.newListRequest({
        message,
      })
    );
  };

  const workspaceNameChange = ({ message }) => {
    dispatch(
      realtimeActions.workspaceNameChangeRequest({
        message,
        onSuccess: (workspaceSlug) => navigate(myRouter.HOME(workspaceSlug)),
      })
    );
  };

  const deletedWorkspace = ({ message }) => {
    dispatch(
      realtimeActions.deletedWorkspaceRequest({
        message,
        onSuccess: () => navigate("/"),
      })
    );
  };

  const updateList = ({ message }) => {
    dispatch(
      realtimeActions.updateListRequest({
        message,
        onSuccess: (workspaceSlug, listSlug) =>
          navigate(myRouter.HOME(workspaceSlug, listSlug)),
      })
    );
  };

  const joinedWorkspace = ({ message }) => {
    dispatch(
      realtimeActions.joinedWorkspaceRequest({
        message,
      })
    );
  };

  const leftWorkspace = ({ message }) => {
    dispatch(
      realtimeActions.leftWorkspaceRequest({
        message,
        onSuccess: () => navigate("/"),
      })
    );
  };

  const deleteList = ({ message }) => {
    dispatch(
      realtimeActions.deleteListRequest({
        message,
        onSuccess: (workspaceSlug) => navigate(myRouter.HOME(workspaceSlug)),
      })
    );
  };

  const newTodo = ({ message }) => {
    dispatch(
      realtimeActions.newTodoRequest({
        message,
      })
    );
  };

  const updateTodo = ({ message }) => {
    dispatch(
      realtimeActions.updateTodoRequest({
        message,
      })
    );
  };

  const changeStatusTodo = ({ message }) => {
    dispatch(
      realtimeActions.changeStatusTodoRequest({
        message,
      })
    );
  };

  const deleteTodo = ({ message }) => {
    dispatch(
      realtimeActions.deleteTodoRequest({
        message,
      })
    );
  };

  const listen = () => {
    realtimeService.listen(
      EventType.WORKSPACE_NAME_CHANGED,
      workspaceNameChange
    );
    realtimeService.listen(EventType.WORKSPACE_DELETED, deletedWorkspace);
    realtimeService.listen(EventType.JOINED_WORKSPACE, joinedWorkspace);
    realtimeService.listen(EventType.LEAVED_WORKSPACE, leftWorkspace);
    realtimeService.listen(EventType.NEW_LIST, newList);
    realtimeService.listen(EventType.UPDATE_LIST, updateList);
    realtimeService.listen(EventType.DELETE_LIST, deleteList);
    realtimeService.listen(EventType.NEW_TODO, newTodo);
    realtimeService.listen(EventType.UPDATE_TODO, updateTodo);
    realtimeService.listen(EventType.CHANGE_STATUS_TODO, changeStatusTodo);
    realtimeService.listen(EventType.DELETE_TODO, deleteTodo);
  };

  const removeListen = () => {
    realtimeService.removeListen(
      EventType.WORKSPACE_NAME_CHANGED,
      workspaceNameChange
    );
    realtimeService.removeListen(EventType.WORKSPACE_DELETED, deletedWorkspace);
    realtimeService.removeListen(EventType.JOINED_WORKSPACE, joinedWorkspace);
    realtimeService.removeListen(EventType.LEAVED_WORKSPACE, leftWorkspace);
    realtimeService.removeListen(EventType.NEW_LIST, newList);
    realtimeService.removeListen(EventType.UPDATE_LIST, updateList);
    realtimeService.removeListen(EventType.DELETE_LIST, deleteList);
    realtimeService.removeListen(EventType.NEW_TODO, newTodo);
    realtimeService.removeListen(EventType.UPDATE_TODO, updateTodo);
    realtimeService.removeListen(
      EventType.CHANGE_STATUS_TODO,
      changeStatusTodo
    );
    realtimeService.removeListen(EventType.DELETE_TODO, deleteTodo);
  };

  useEffect(() => {
    dispatch(realtimeActions.setWorkspaceSlug(workspaceSlug));
  }, [workspaceSlug]);
  useEffect(() => {
    dispatch(realtimeActions.setListSlug(listSlug));
  }, [listSlug]);
  useEffect(() => {
    const currentStatus =
      statusSlug === TodoStatusTypes.COMPLETED
        ? TodoStatusTypes.COMPLETED
        : TodoStatusTypes.TODO;
    dispatch(realtimeActions.setStatusSlug(currentStatus));
  }, [statusSlug]);

  useEffect(() => {
    realtimeService.join(workspaceSlug);

    listen();

    return () => {
      realtimeService.leave(workspaceSlug);
      removeListen();
    };
  }, [workspaceSlug]);
}
