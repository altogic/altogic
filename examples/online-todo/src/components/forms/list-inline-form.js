import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import functions from "../../helpers/functions";
import { myRouter } from "../../helpers/routes";
import { listActions } from "../../redux/list/listSlice";
import Input from "../inputs/input";

export default function ListInlineForm({ selectedList, setSelectedList }) {
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
    if (selectedList) setValue("name", selectedList?.name);
  }, [selectedList]);

  const handleEscape = (event) => {
    if (event.key === "Escape") {
      setSelectedList(null);
    }
  };

  const handleFocus = (e) => {
    if (
      !document.getElementById("list-inline-form").contains(e.target) &&
      !document.getElementById("send-button").contains(e.target)
    ) {
      // Clicked outside the box
      if (!stateRef.current) {
        setSelectedList(null);
      }
      setDidMount(false);
    }
  };

  const onSubmit = ({ name }) => {
    if (!isLoading) {
      setIsLoading(true);
      const body = {
        listId: selectedList?._id,
        isPublic: selectedList?.isPublic,
        slug: functions.createSlug(name, selectedList?.index),
        name,
      };
      dispatch(
        listActions.updateListRequest({
          body,
          listSlug: selectedList?.slug,
          workspaceSlug,
          onSuccess: (slug) => {
            setIsLoading(false);
            toast.success("List updated successfully");
            if (listSlug === selectedList?.slug) {
              navigate(myRouter.HOME(workspaceSlug, slug));
            }
            setSelectedList(null);
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
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="list-inline-form"
        name="name"
        className="flex items-center w-full justify-between px-2 py-2 text-sm font-medium rounded-md bg-indigo-800 text-white"
        autoMargin={false}
        newStyle
        autoFocus
        register={register("name")}
        error={errors.name}
        rightButton
      />
    </form>
  );
}
