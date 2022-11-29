import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Fixtures from "../components/fixtures";
import LeagueTable from "../components/leaugue-table";
import Template from "../components/template";
import { leagueActions } from "../redux/league/leagueSlice";
import { matchActions } from "../redux/match/matchSlice";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { leagueSlug } = useParams();

  const teamId = useSelector((state) => state.league.teamId);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFixture, setIsLoadingFixture] = useState(false);

  useEffect(() => {
    if (leagueSlug)
      dispatch(
        leagueActions.getLeagueBySlugRequest({
          leagueSlug,
          onFailure: () => {
            navigate("/");
          },
        })
      );
  }, [leagueSlug]);

  useEffect(() => {
    if (teamId) {
      setIsLoadingFixture(true);
      dispatch(
        matchActions.getPredictionsRequest({
          teamId,
          onSuccess: () => {
            setIsLoadingFixture(false);
            setIsLoading(false);
          },
        })
      );
    }
  }, [teamId]);

  useEffect(() => {
    return () => {
      dispatch(leagueActions.setTeamId(undefined));
    };
  }, []);

  return (
    <Template>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <ClipLoader color="red" loading={isLoading} size={100} />
        </div>
      ) : (
        <>
          <LeagueTable />
          {isLoadingFixture ? (
            <div className="flex justify-center items-center">
              <ClipLoader
                className="mt-12"
                color="red"
                loading={isLoadingFixture}
                size={100}
              />
            </div>
          ) : (
            <Fixtures />
          )}
        </>
      )}
    </Template>
  );
}
