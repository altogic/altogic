import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { leagueActions } from "../../redux/league/leagueSlice";
import Button from "../button";
import Input from "../inputs/input";

export default function JoinLeagueForm() {
  const schema = new yup.ObjectSchema({
    leagueCode: yup
      .string()
      .required("League Code is required.")
      .matches(/^[a-zA-Z0-9_]+$/, "Only alphabets are allowed for this field ")
      .length(5, "League Code must be at 5 characters."),
    teamName: yup
      .string()
      .required("Team Name is required.")
      .trim()
      .min(3, "Team Name must be at least 3 characters.")
      .max(15, "Team Name must be at most 15 characters."),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [codeAvailable, setCodeAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [joinLeague, setJoinLeague] = useState(null);

  const checkleagueCode = (e) => {
    const leagueCode = e.target.value;
    dispatch(
      leagueActions.checkleagueCodeRequest({
        leagueCode,
        onSuccess: ({ isAvailable, league }) => {
          if (isAvailable) {
            clearErrors("leagueCode");
            setCodeAvailable(true);
            setJoinLeague(league);
          } else {
            setError("leagueCode", {
              type: "manuel",
              message: "This league doesn't exist.",
            });
            setCodeAvailable(false);
            setJoinLeague(null);
          }
        },
      })
    );
  };

  const onSubmit = ({ teamName }) => {
    setIsLoading(true);
    dispatch(
      leagueActions.joinRequest({
        teamName,
        leagueId: joinLeague?._id,
        leagueSlug: joinLeague?.slug,
        onSuccess: (leagueSlug) => {
          navigate(`/league/${leagueSlug}`);
          setIsLoading(false);
        },
        onFailure: (errorList) => {
          toast.error(_.get(errorList, "items[0].message"));
          setIsLoading(false);
        },
      })
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="League Code"
        id="leagueCode"
        name="leagueCode"
        placeholder="00000"
        onBlur={checkleagueCode}
        register={register("leagueCode")}
        error={errors.leagueCode}
      />
      <Input
        label="Team Name"
        id="teamName"
        name="teamName"
        placeholder="Brazil"
        register={register("teamName")}
        disabled={!codeAvailable || errors.leagueCode}
        error={errors.teamName}
      />
      <Button
        type={codeAvailable ? "submit" : "button"}
        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 sm:text-sm mt-5 sm:mt-6"
        loading={isLoading}
      >
        Join
      </Button>
    </form>
  );
}
