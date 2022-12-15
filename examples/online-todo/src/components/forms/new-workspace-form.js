import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { myRouter } from "../../helpers/routes";
import { workspaceActions } from "../../redux/workspace/workspaceSlice";
import Button from "../button";
import Input from "../inputs/input";
import RadioToggle from "../inputs/radio-toggle";

export default function NewWorkspaceForm(params) {
  const schema = new yup.ObjectSchema({
    name: yup
      .string()
      .required("Title is required ")
      .trim()
      .min(3, "title must be at least 3 characters")
      .max(40, "Title must be at most 40 characters"),
    description: yup
      .string()
      .trim()
      .max(180, "Description must be at most 180 characters"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = ({ name, description }) => {
    setIsLoading(true);
    dispatch(
      workspaceActions.createWorkspaceRequest({
        name,
        description,
        isPublic,
        onSuccess: (slug) => {
          toast.success("Workspace created successfully");
          setIsLoading(false);
          navigate(myRouter.HOME(slug));
        },
        onFailure: (errorList) => {
          setError("name", {
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
        label="Name"
        id="name"
        name="name"
        placeholder="Business"
        register={register("name")}
        error={errors.name}
      />
      <Input
        label="Description"
        id="description"
        name="description"
        placeholder="This is business workspace."
        textArea
        register={register("description")}
        error={errors.description}
      />
      <div className="my-3">
        <RadioToggle
          label="Public"
          enabled={isPublic}
          setEnabled={setIsPublic}
        />
      </div>

      <div className="flex justify-center mt-6">
        <Button
          type="submit"
          className="bg-indigo-600 border w-full border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-md font-medium text-white hover:bg-indigo-700"
          loading={isLoading}
        >
          Create
        </Button>
      </div>
    </form>
  );
}
