import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";
import { pixelActions } from "../../redux/pixel/pixelSlice";
import { MyRouter } from "../../routes";
import Button from "../button";
import Input from "../input";
import RadioButtons from "../radio-buttons";

export default function NewPixelForm(params) {
  const schema = new yup.ObjectSchema({
    name: yup
      .string()
      .required("Name is required ")
      .trim()
      .min(3, "Name must be at least 2 characters")
      .max(40, "Name must be at most 120 characters"),
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
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [size, setSize] = useState(16);

  const onSubmit = ({ name }) => {
    setIsLoading(true);
    dispatch(
      pixelActions.createRequest({
        name,
        size,
        onSuccess: (pixelSlug) => {
          toast.success("Art created successfully");
          setIsLoading(false);
          router.push(MyRouter.pixel(pixelSlug));
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
        placeholder="My Art"
        register={register("name")}
        error={errors.name}
      />
      <div className="mt-3">
        <RadioButtons
          options={_.map([
            {
              label: "16x16",
              value: 16,
            },
            {
              label: "32x32",
              value: 32,
            },
            {
              label: "48x48",
              value: 48,
            },
            // {
            //   label: "64x64",
            //   value: 64,
            // },
          ])}
          setValue={setSize}
          value={size}
        />
      </div>

      <div className="flex justify-center mt-6">
        <Button
          type="submit"
          className="bg-violet-600 border w-full border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-md font-medium text-white hover:bg-violet-700"
          loading={isLoading}
        >
          Create
        </Button>
      </div>
    </form>
  );
}
