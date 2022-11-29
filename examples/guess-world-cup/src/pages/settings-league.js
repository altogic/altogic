import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import Avatar from "../components/avatar";
import Button from "../components/button";
import Input from "../components/inputs/input";
import DeleteModal from "../components/modals/delete-modal";
import functions from "../helpers/functions";
import useQuery from "../helpers/useQuery";
import { leagueActions } from "../redux/league/leagueSlice";

export default function SettingsLeague() {
  const schema = new yup.ObjectSchema({
    leagueName: yup
      .string()
      .required("League Name is required.")
      .trim()
      .min(3, "League Name must be at least 3 characters.")
      .max(15, "League Name must be at most 15 characters."),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leagueSlug = useQuery("tab");

  const [formAvailable, setFormAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [deletedTeam, setDeletedTeam] = useState(null);
  const [deleteLeague, setDeleteLeague] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const league = useSelector((state) => state.league.league);

  const leagueTeams = _.reject(
    league?.teams,
    (team) => team.user._id === user._id
  );

  useEffect(() => {
    if (leagueSlug)
      dispatch(
        leagueActions.getLeagueBySlugRequest({
          leagueSlug,
          onSuccess: ({ owner }) => {
            if (owner !== user?._id) {
              navigate("/");
            }
          },
          onFailure: () => {
            navigate("/");
          },
        })
      );
  }, [leagueSlug]);

  useEffect(() => {
    if (league) setValue("leagueName", league?.name);
  }, [league]);

  const copyCode = () => {
    toast.success("Invation code copied to clipboard");
    navigator.clipboard.writeText(league?.code);
  };

  const checkLeagueName = (e) => {
    const leagueName = e.target.value;
    dispatch(
      leagueActions.checkLeagueNameRequest({
        leagueName,
        leagueId: league?._id,
        onSuccess: (isAvailable) => {
          if (isAvailable) {
            clearErrors("leagueName");
            setFormAvailable(true);
          } else {
            setError("leagueName", {
              type: "manuel",
              message: "This name already exists.",
            });
            setFormAvailable(false);
          }
        },
      })
    );
  };

  const onSubmit = ({ leagueName }) => {
    setIsLoading(true);
    dispatch(
      leagueActions.changeLeagueNameRequest({
        leagueId: league?._id,
        leagueName,
        onSuccess: (newSlug) => {
          setIsLoading(false);
          toast.success("League Name updated successfully");
          navigate(`/settings?tab=${newSlug}`);
        },
        onFailure: (errorList) => {
          _.forEach(errorList.items, (err) => {
            setError("leagueName", {
              type: "manuel",
              message: "This league name already exists.",
            });
          });
          setIsLoading(false);
        },
      })
    );
  };

  const removeTeam = () => {
    dispatch(leagueActions.deleteTeamRequest(deletedTeam));
  };

  const removeLeague = () => {
    dispatch(
      leagueActions.removeLeagueRequest({
        leagueId: league?._id,
        onSuccess: () => {
          navigate("/");
        },
        onFailure: (errorList) => {
          toast.error(_.get(errorList, "items[0].message"));
        },
      })
    );
  };

  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {functions.convertToTitle(league?.name)}
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <Input
                  label="League Name"
                  id="leagueName"
                  name="leagueName"
                  placeholder="World League"
                  onBlur={checkLeagueName}
                  register={register("leagueName")}
                  error={errors.leagueName}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <div onClick={copyCode}>
                  <Input
                    label="Invitation Code"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm cursor-pointer"
                    value={league?.code}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <Button
              type={formAvailable ? "submit" : "button"}
              className="bg-pink-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              loading={isLoading}
            >
              Save
            </Button>
          </div>
        </div>
      </form>

      {leagueTeams && !_.isEmpty(leagueTeams) && (
        <table className="min-w-full">
          <thead>
            <tr className="border-t border-gray-200">
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="lg:pl-2">TEAMS</span>
              </th>
              <th className="py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {_.map(leagueTeams, (team) => (
              <tr className="group group-hover:bg-gray-50" key={team.user._id}>
                <td className="relative px-6 py-5 flex items-center space-x-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500">
                  <div className="flex-shrink-0">
                    <Avatar anotherUser={team.user} size={10} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      {team.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {team.user.userName}
                    </p>
                  </div>
                </td>
                <td className="py-3 text-sm text-gray-500 font-medium">
                  <Button
                    className="bg-pink-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    onClick={() =>
                      setDeletedTeam({
                        leagueId: league?._id,
                        teamId: team?._id,
                        userId: team?.user?._id,
                      })
                    }
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Delete League
            </h3>
          </div>

          <div className="flex justify-center">
            <Button
              className="bg-pink-600 border w-4/12 border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-md font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              onClick={() => setDeleteLeague(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {deleteLeague && (
        <DeleteModal
          title="Delete League"
          description="Are you sure you would like to delete the league?"
          setDeleteModal={() => setDeleteLeague(false)}
          clickDelete={removeLeague}
        />
      )}
      {deletedTeam && (
        <DeleteModal
          title="Remove Team"
          description="Are you sure you would like to remove this team?"
          setDeleteModal={() => setDeletedTeam(null)}
          clickDelete={removeTeam}
        />
      )}
    </div>
  );
}
