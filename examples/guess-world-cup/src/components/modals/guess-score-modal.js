/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";
import functions from "../../helpers/functions";
import { matchActions } from "../../redux/match/matchSlice";
import Button from "../button";
import Input from "../inputs/input";
import RadioButtons from "../inputs/radio-buttons";

export default function GuessScoreModal({ prediction, setPrediction }) {
  const schema = new yup.ObjectSchema({
    homeScore: yup
      .number("Score must be number")
      .transform((cv, ov) => {
        return ov === "" ? undefined : cv;
      })
      .max(15, "Score must be less than or equal to 15.")
      .min(0, "Score must be greater than or equal to 0.")
      .required("Score is required."),
    awayScore: yup
      .number("Score must be number")
      .transform((cv, ov) => {
        return ov === "" ? undefined : cv;
      })
      .max(15, "Score must be less than or equal to 15.")
      .min(0, "Score must be greater than or equal to 0.")
      .required("Score is required."),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      homeScore: prediction?.homeScore || undefined,
      awayScore: prediction?.awayScore || undefined,
    },
  });

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [firstGoal, setFirstGoal] = useState(prediction?.firstGoal || "home");

  const onSubmit = ({ homeScore, awayScore }) => {
    setIsLoading(true);
    dispatch(
      matchActions.guessScoreRequest({
        prediction: {
          ...prediction,
          isPlayed: true,
          result: functions.getResult(homeScore, awayScore),
          firstGoal: homeScore === 0 && awayScore === 0 ? "none" : firstGoal,
          homeScore,
          awayScore,
        },
        onSuccess: () => {
          setIsLoading(false);
          setPrediction(null);
          toast.success("You guessed successfully.");
        },
        onFailure: (errorList) => {
          toast.error(_.get(errorList, "items[0].message"));
          setIsLoading(false);
        },
      })
    );
  };

  return (
    <Transition.Root show={!_.isNil(prediction)} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => setPrediction(null)}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
            >
              <Input
                label={prediction?.match.homeName}
                id="homeScore"
                type="number"
                max={15}
                min={0}
                name="homeScore"
                placeholder="Enter your score"
                register={register("homeScore")}
                error={errors.homeScore}
              />
              <Input
                label={prediction?.match.awayName}
                id="awayScore"
                type="number"
                max={15}
                min={0}
                name="awayScore"
                placeholder="Enter your score"
                register={register("awayScore")}
                error={errors.awayScore}
              />
              {!(watch("homeScore") === "0" && watch("awayScore") === "0") && (
                <div className="mt-3">
                  <RadioButtons
                    options={_.map([
                      {
                        label: functions.getCutName(prediction?.match.homeName),
                        value: "home",
                      },
                      {
                        label: functions.getCutName(prediction?.match.awayName),
                        value: "away",
                      },
                    ])}
                    value={firstGoal}
                    setValue={setFirstGoal}
                  />
                </div>
              )}
              <div className="mt-5 sm:mt-6">
                <Button
                  type="submit"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 sm:text-sm"
                  loading={isLoading}
                >
                  Confirm
                </Button>
              </div>
            </form>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
