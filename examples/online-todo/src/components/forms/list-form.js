import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import functions from "../../helpers/functions";
import { myRouter } from "../../helpers/routes";
import { listActions } from "../../redux/list/listSlice";
import Button from "../button";
import Input from "../inputs/input";
import RadioToggle from "../inputs/radio-toggle";
import DeleteModal from "../modals/delete-modal";

export default function ListForm({ newList, setShow }) {
  const schema = new yup.ObjectSchema({
    name: yup
      .string()
      .required("Name is required ")
      .trim()
      .min(3, "name must be at least 3 characters")
      .max(40, "name must be at most 40 characters"),
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
  const navigate = useNavigate();
  const workspace = useSelector(({ workspace }) =>
    _.get(workspace.workspaceList, workspaceSlug)
  );
  const list = useSelector(({ list }) => _.get(list.lists, listSlug));
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (workspace) {
      if (workspace.isPublic !== true) {
        setIsPublic(false);
      }
    }
  }, [workspace]);

  useEffect(() => {
    if (list && !newList) {
      setValue("name", list?.name);
      setIsPublic(list?.isPublic);
    }
  }, [list]);

  const onSubmit = ({ name }) => {
    setIsLoading(true);
    if (newList) createList(name);
    else updateList(name);
  };

  const createList = (name) => {
    const body = {
      workspaceSlug,
      workspace: workspace?._id,
      isPublic,
      name,
    };
    dispatch(
      listActions.createListRequest({
        body,
        workspaceSlug,
        listSlug,
        onSuccess: (slug) => {
          setIsLoading(false);
          setShow(false);
          toast.success("List created successfully");
          navigate(myRouter.HOME(workspaceSlug, slug));
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

  const updateList = (name) => {
    const body = {
      listId: list?._id,
      slug: functions.createSlug(name, list?.index),
      isPublic,
      name,
    };
    dispatch(
      listActions.updateListRequest({
        body,
        listSlug,
        workspaceSlug,
        onSuccess: (slug) => {
          setIsLoading(false);
          setShow(false);
          navigate(myRouter.HOME(workspaceSlug, slug));
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

  const deleteList = () => {
    dispatch(
      listActions.deleteListRequest({
        listId: list?._id,
        listSlug,
        workspaceSlug,
        onSuccess: (slug) => {
          navigate(myRouter.HOME(workspaceSlug));
          setShow(false);
        },
      })
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="List Name"
        id="name"
        name="name"
        placeholder="Shopping List"
        register={register("name")}
        error={errors.name}
      />
      <div className="my-3">
        {newList && (
          <RadioToggle
            label="Public"
            enabled={isPublic}
            disabled={!workspace?.isPublic || !user?._id}
            setEnabled={setIsPublic}
          />
        )}
      </div>
      <Button
        type="submit"
        className="bg-indigo-600 border w-full border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-md font-medium text-white hover:bg-indigo-700"
        loading={isLoading}
      >
        {newList ? "Create" : "Save"}
      </Button>
      {!newList && (
        <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
          <div className="flex justify-center">
            <Button
              type="button"
              className="bg-red-600 border w-full border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-md font-medium text-white hover:bg-red-700 mt-auto"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete List
            </Button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteModal
          title="Remove List"
          description="Are you sure you would like to remove this list?"
          setDeleteModal={() => setShowDeleteModal(false)}
          clickDelete={deleteList}
        />
      )}
    </form>
  );
}
