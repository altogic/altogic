import { ChevronRightIcon } from "@heroicons/react/outline";
import cs from "classnames";
import _ from "lodash";
import { FirstGoalStatus, MatchStatus } from "../helpers/utils";
import Button from "./button";

function getButtonLabel(status, isPlayed) {
  switch (status) {
    case MatchStatus.NOT_STARTED:
      return isPlayed ? "Change Guessed Score" : "Guess Score";
    case MatchStatus.STARTED:
      return "Match Started";
    default:
      return "Match Played";
  }
}

function getFirstGoalTeam(firstGoal, homeName, awayName) {
  switch (firstGoal) {
    case FirstGoalStatus.HOME:
      return homeName;
    case FirstGoalStatus.AWAY:
      return awayName;
    default:
      return "";
  }
}

export default function PredictionBox({
  prediction,
  setSelectedPrediction,
  myPrediction,
}) {
  const match = prediction?.match;

  return (
    <div className="group relative">
      <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-md overflow-hidden">
        <div className="relative px-4 py-5 flex items-center space-x-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500">
          <ChevronRightIcon
            width={20}
            color={
              _.isNil(prediction?.firstGoal) || prediction?.firstGoal === "away"
                ? "#e5e7eb"
                : undefined
            }
          />
          <div className="flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full"
              src={match.homeLogo}
              alt={match.homeName}
            />
          </div>
          <div className="flex-1 min-w-0">
            {/* Extend touch target to entire panel */}
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900">
              {match.homeName}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {prediction?.homeScore}
          </div>
        </div>
        <div className="relative px-4 py-5 flex items-center space-x-3  focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500">
          <ChevronRightIcon
            width={20}
            color={
              _.isNil(prediction?.firstGoal) || prediction?.firstGoal === "home"
                ? "#e5e7eb"
                : undefined
            }
          />
          <div className="flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full"
              src={match.awayLogo}
              alt={match.awayName}
            />
          </div>
          <div className="flex-1 min-w-0">
            {/* Extend touch target to entire panel */}
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900">
              {match.awayName}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {prediction?.awayScore}
          </div>
        </div>
        <span className="inline-block text-sm text-yellow-700 text-center w-full">
          {match.status === MatchStatus.FINISHED &&
            `${match.homeName} ${match.homeScore} - ${match.awayScore} ${
              match.awayName
            } ${`${
              getFirstGoalTeam(
                match.firstGoal,
                match.homeName,
                match.awayName
              ) &&
              `(F.G: ${getFirstGoalTeam(
                match.firstGoal,
                match.homeName,
                match.awayName
              )})`
            }`}`}
        </span>
        <span className="inline-block text-sm text-green-700 text-center w-full">
          {match.status === MatchStatus.FINISHED &&
            `Earned Point: ${prediction?.earnedPoint || 0}`}
        </span>
        <div className="mt-2">
          {myPrediction && (
            <Button
              className={cs([
                "w-full bg-pink-600 border border-transparent py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-pink-700",
                prediction?.isPlayed && "bg-green-600 hover:bg-green-700",
                match.status !== MatchStatus.NOT_STARTED &&
                  "bg-gray-600 hover:bg-gray-700",
              ])}
              onClick={() => setSelectedPrediction(prediction)}
              disabled={match.status !== MatchStatus.NOT_STARTED}
            >
              {getButtonLabel(match.status, prediction?.isPlayed)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
