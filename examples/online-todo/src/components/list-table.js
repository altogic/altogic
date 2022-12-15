import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import useArraySelector from "../helpers/useArraySelector";
import useQuery from "../helpers/useQuery";
import { TodoStatusTypes } from "../helpers/utils";
import { todoActions } from "../redux/todo/todoSlice";
import Button from "./button";
import TodoInlineCreateForm from "./forms/todo-inline-create-form";
import TodoInlineForm from "./forms/todo-inline-form";
import ListObserver from "./list-observer";
import DeleteModal from "./modals/delete-modal";

export default function TodoList() {
  const status = useQuery("status");
  const { listSlug, workspaceSlug } = useParams();
  const dispatch = useDispatch();
  const todoList = useArraySelector(({ todo }) => todo.todos);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [deletedTodo, setDeletedTodo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const selectedStatus =
    status === TodoStatusTypes.COMPLETED
      ? TodoStatusTypes.COMPLETED
      : TodoStatusTypes.TODO;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTodoList("", true);
  }, [listSlug, status]);

  useEffect(() => {
    return () => {
      dispatch(todoActions.setInfo(null));
    };
  }, []);

  const getTodoList = (searchText, isNewSearch = false) => {
    setLoading(true);
    dispatch(
      todoActions.getTodosRequest({
        listSlug,
        status:
          status === TodoStatusTypes.COMPLETED
            ? TodoStatusTypes.COMPLETED
            : TodoStatusTypes.TODO,
        searchText: searchText || isNewSearch ? searchText.trim() : null,
        isNewSearch,
        onSuccess: () => setLoading(false),
        onFailure: () => setLoading(false),
      })
    );
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(_.trim(value));

    if (_.size(value) > 2) {
      _.debounce(() => {
        getTodoList(value, true);
      }, 500)();
    } else if (_.size(value) === 0) {
      getTodoList("", true);
    }
  };

  const changeStatusTodo = (todoId, currentStatus) => {
    setIsLoadingStatus(true);
    dispatch(
      todoActions.changeStatusTodoRequest({
        todoId,
        listSlug,
        workspaceSlug,
        currentStatus:
          currentStatus === TodoStatusTypes.COMPLETED
            ? TodoStatusTypes.COMPLETED
            : TodoStatusTypes.TODO,
        newStatus:
          currentStatus === TodoStatusTypes.COMPLETED
            ? TodoStatusTypes.TODO
            : TodoStatusTypes.COMPLETED,
        onSuccess: () => {
          setIsLoadingStatus(false);
        },
        onFailure: () => setIsLoadingStatus(false),
      })
    );
  };

  const deleteTodo = () => {
    dispatch(
      todoActions.deleteTodoRequest({
        workspaceSlug,
        todoId: deletedTodo?._id,
        onSuccess: () => {
          toast.success("Todo removed successfully");
          setDeletedTodo(null);
        },
      })
    );
  };

  return (
    <>
      <fieldset className="space-y-5">
        {/* <div className="flex justify-between items-center">
          <div className="grow">
            <Input
              autoMargin={false}
              placeholder="Search Todo"
              onChange={handleSearch}
              value={searchText}
            />
          </div>
        </div> */}

        <>
          {status !== TodoStatusTypes.COMPLETED && <TodoInlineCreateForm />}
          {loading ? (
            <div className="items-center flex flex-col mt-12">
              <ClipLoader color="#4f47e6" loading={loading} size={60} />
            </div>
          ) : (
            <ListObserver onEnd={getTodoList}>
              {_(todoList)
                .filter((todo) => todo.status === selectedStatus)
                .orderBy(["updatedAt"], ["desc"])
                .valueOf()
                .map((todo) => (
                  <div key={todo?._id}>
                    {selectedTodo?._id === todo._id ? (
                      <TodoInlineForm
                        selectedTodo={selectedTodo}
                        setSelectedTodo={setSelectedTodo}
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div
                          key={todo._id}
                          className="relative flex items-center"
                        >
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              className="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 rounded cursor-pointer"
                              onChange={() =>
                                changeStatusTodo(todo?._id, todo?.status)
                              }
                              checked={
                                todo?.status === TodoStatusTypes.COMPLETED
                              }
                              disabled={isLoadingStatus}
                            />
                          </div>
                          <div
                            className="ml-3 text-sm w-full p-2 cursor-pointer"
                            onClick={() =>
                              changeStatusTodo(todo?._id, todo?.status)
                            }
                          >
                            <label
                              htmlFor="comments"
                              className="font-medium text-gray-700 cursor-pointer"
                            >
                              {todo.title}
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center px-2 py-2 text-sm font-medium rounded-md">
                          <Button onClick={() => setSelectedTodo(todo)}>
                            <PencilIcon
                              className="mr-3 flex-shrink-0 h-5 w-5"
                              aria-hidden="true"
                            />
                          </Button>
                          <Button onClick={() => setDeletedTodo(todo)}>
                            <TrashIcon
                              className="lex-shrink-0 h-5 w-5"
                              aria-hidden="true"
                            />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </ListObserver>
          )}
        </>
        {deletedTodo && (
          <DeleteModal
            title="Remove Todo"
            description="Are you sure you would like to remove this todo?"
            setDeleteModal={() => setDeletedTodo(null)}
            clickDelete={deleteTodo}
          />
        )}
      </fieldset>
    </>
  );
}
