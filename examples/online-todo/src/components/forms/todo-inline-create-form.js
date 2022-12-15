import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import useQuery from "../../helpers/useQuery";
import { TodoStatusTypes } from "../../helpers/utils";
import { todoActions } from "../../redux/todo/todoSlice";
import Input from "../inputs/input";

export default function TodoInlineCreateForm() {
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
  const workspace = useSelector(({ workspace }) =>
    _.get(workspace.workspaceList, workspaceSlug)
  );
  const list = useSelector(({ list }) => _.get(list.lists, listSlug));
  const status = useQuery("status");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = ({ title }) => {
    if (!isLoading) {
      setIsLoading(true);
      createTodo(title);
    }
  };

  const createTodo = (title) => {
    const body = {
      listSlug,
      workspace: workspace?._id,
      list: list?._id,
      status: "todo",
      title,
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
          setValue("title", "");
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
        name="title"
        className="flex items-center w-full justify-between px-2 py-2 text-sm font-medium rounded-md border-2 border-dashed"
        placeholder="Create Todo"
        autoMargin={false}
        newStyle
        register={register("title")}
        error={errors.title}
        rightButton
        rightButtonProps={{
          className: "absolute top-[6.5px] right-0 px-2",
        }}
      />
    </form>
  );
}
