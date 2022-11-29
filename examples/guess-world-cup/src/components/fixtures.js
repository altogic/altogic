import _ from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Container from "./container";
import GuessScoreModal from "./modals/guess-score-modal";
import PredictionBox from "./prediction-box";

export default function Fixtures() {
  const { leagueSlug } = useParams();

  const user = useSelector((state) => state.auth.user);
  const predictions = useSelector((state) => state.match.predictions);
  const selectedTeamId = useSelector((state) => state.league.teamId);

  const [selectedPrediction, setSelectedPrediction] = React.useState(null);

  const myTeamId = _.find(
    user?.leagues,
    (userLeague) => userLeague.slug === leagueSlug
  )?.team;
  const myPrediction = myTeamId === selectedTeamId;

  return (
    <Container className="mt-16">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        This Week Fixtures
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
        {_.map(predictions, (prediction) => (
          <div key={prediction._id}>
            <PredictionBox
              prediction={prediction}
              setSelectedPrediction={setSelectedPrediction}
              myPrediction={myPrediction}
            />
          </div>
        ))}
      </div>
      {selectedPrediction && (
        <GuessScoreModal
          prediction={selectedPrediction}
          setPrediction={setSelectedPrediction}
        />
      )}
    </Container>
  );
}
