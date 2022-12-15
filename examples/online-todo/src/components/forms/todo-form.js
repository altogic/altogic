import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import useQuery from "../../helpers/useQuery";
import { TodoStatusTypes } from "../../helpers/utils";
import { todoActions } from "../../redux/todo/todoSlice";
import Button from "../button";
import Input from "../inputs/input";
import DeleteModal from "../modals/delete-modal";

export default function TodoForm({ selectedTodo, setSelectedTodo }) {
  const schema = new yup.ObjectSchema({
    title: yup
      .string()
      .required("Title is required ")
      .trim()
      .min(3, "title must be at least 3 characters")
      .max(40, "Title must be at most 40 characters"),
    description: yup
      .string()
      .trim()
      .max(40, "Description must be at most 180 characters"),
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const { listSlug, workspaceSlug } = useParams();
  const status = useQuery("status");
  const workspace = useSelector(({ workspace }) =>
    _.get(workspace.workspaceList, workspaceSlug)
  );
  const list = useSelector(({ list }) => _.get(list.lists, listSlug));

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (selectedTodo?._id) {
      setValue("title", selectedTodo?.title);
      setValue("description", selectedTodo?.description);
    }
  }, [selectedTodo]);

  const onSubmit = ({ title, description }) => {
    setIsLoading(true);
    if (!selectedTodo?._id) createTodo(title, description);
    else updateTodo(title, description);
  };

  const createTodo = (title, description) => {
    const body = {
      listSlug,
      workspace: workspace?._id,
      list: list?._id,
      status: "todo",
      title,
      description,
    };
    dispatch(
      todoActions.createTodoRequest({
        body,
        workspaceSlug,
        listSlug,
        status:
          status === TodoStatusTypes.COMPLETED
            ? status === TodoStatusTypes.COMPLETED
            : TodoStatusTypes.TODO,
        onSuccess: (slug) => {
          setIsLoading(false);
          setSelectedTodo(null);
        },
        onFailure: (errorList) => {
          setError("title", {
            type: "manuel",
            message: _.get(errorList, "items[0].message"),
          });
          setIsLoading(false);
        },
      })
    );
  };

  const updateTodo = (title, description) => {
    const body = {
      ...selectedTodo,
      title,
      description,
    };
    dispatch(
      todoActions.updateTodoRequest({
        body,
        workspaceSlug,
        listSlug,
        status:
          status === TodoStatusTypes.COMPLETED
            ? status === TodoStatusTypes.COMPLETED
            : TodoStatusTypes.TODO,
        onSuccess: (slug) => {
          setIsLoading(false);
          setSelectedTodo(null);
        },
        onFailure: (errorList) => {
          setError("title", {
            type: "manuel",
            message: _.get(errorList, "items[0].message"),
          });
          setIsLoading(false);
        },
      })
    );
  };

  const deleteTodo = () => {
    dispatch(
      todoActions.deleteTodoRequest({
        todoId: selectedTodo?._id,
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedTodo(null);
        },
      })
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Title"
        id="title"
        name="title"
        placeholder="Tomato"
        register={register("title")}
        error={errors.title}
      />
      <Input
        label="Description"
        id="description"
        name="description"
        placeholder="You should buy it."
        textArea
        register={register("description")}
        error={errors.description}
      />
      <Button
        type="submit"
        className="bg-indigo-600 border w-full border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-md font-medium text-white hover:bg-indigo-700"
        loading={isLoading}
      >
        {!selectedTodo?._id ? "Create" : "Save"}
      </Button>

      {selectedTodo?._id && (
        <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
          <div className="flex justify-center">
            <Button
              type="button"
              className="bg-red-600 border w-full border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-md font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Todo
            </Button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteModal
          title="Remove Todo"
          description="Are you sure you would like to remove this todo?"
          setDeleteModal={() => setShowDeleteModal(false)}
          clickDelete={deleteTodo}
        />
      )}
    </form>
  );
}
