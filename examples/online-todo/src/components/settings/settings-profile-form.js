import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";
import { authActions } from "../../redux/auth/authSlice";
import Button from "../button";
import Input from "../inputs/input";

export default function SettingsProfileForm() {
  const schema = new yup.ObjectSchema({
    name: yup
      .string()
      .required("Name is required ")
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(40, "Name must be at most 40 characters"),
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
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) setValue("name", user.name);
  }, [user]);

  const onSubmit = ({ name }) => {
    setIsLoading(true);
    dispatch(
      authActions.updateNameRequest({
        name,
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Profile updated successfully");
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
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Profile
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <Input
                label="Name"
                id="name"
                name="name"
                placeholder="John"
                register={register("name")}
                error={errors.name}
              />
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <Button
            type="submit"
            className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            loading={isLoading}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
