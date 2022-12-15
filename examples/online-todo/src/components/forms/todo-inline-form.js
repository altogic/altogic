import { yupResolver } from "@hookform/resolvers/yup";
import classNames from "classnames";
import _ from "lodash";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import useQuery from "../../helpers/useQuery";
import { TodoStatusTypes } from "../../helpers/utils";
import { todoActions } from "../../redux/todo/todoSlice";
import Input from "../inputs/input";

export default function TodoInlineForm({
  create,
  selectedTodo,
  setSelectedTodo,
}) {
  const schema = new yup.ObjectSchema({
    title: yup
      .string()
      .required("Title is required ")
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(180, "Title must be at most 180 characters"),
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

  const { workspaceSlug, listSlug } = useParams();
  const status = useQuery("status");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [didMount, setDidMount] = useState(true);
  const stateRef = useRef();
  stateRef.current = didMount;

  useEffect(() => {
    document.addEventListener("keydown", handleEscape, false);
    window.addEventListener("click", handleFocus, false);

    return () => {
      document.removeEventListener("keydown", handleEscape, false);
      window.removeEventListener("click", handleFocus, false);
    };
  }, []);

  useEffect(() => {
    if (selectedTodo) setValue("title", selectedTodo?.title);
  }, [selectedTodo]);

  const handleEscape = (event) => {
    if (event.key === "Escape") {
      setSelectedTodo(null);
    }
  };

  const handleFocus = (e) => {
    if (
      !document.getElementById("todo-inline-form").contains(e.target) &&
      !document.getElementById("sent-todo-button").contains(e.target)
    ) {
      // Clicked outside the box
      if (!stateRef.current) {
        setSelectedTodo(null);
      }
      setDidMount(false);
    }
  };

  const onSubmit = ({ title }) => {
    if (!isLoading) {
      setIsLoading(true);
      updateTodo(title);
    }
  };

  const updateTodo = (title) => {
    const body = {
      ...selectedTodo,
      title,
    };
    dispatch(
      todoActions.updateTodoRequest({
        body,
        workspaceSlug,
        listSlug,
        status:
          status === TodoStatusTypes.COMPLETED
            ? TodoStatusTypes.COMPLETED
            : TodoStatusTypes.TODO,
        onSuccess: (slug) => {
          setIsLoading(false);
          setSelectedTodo(null);
          setIsLoading(false);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="todo-inline-form"
        name="title"
        className="flex items-center w-full justify-between px-2 py-2 text-sm font-medium rounded-md border-2"
        autoMargin={false}
        newStyle
        autoFocus
        register={register("title")}
        error={errors.title}
        rightButton
        rightButtonProps={{
          id: "sent-todo-button",
          className: "absolute top-[6.5px] right-0 px-2",
        }}
      />
    </form>
  );
}
