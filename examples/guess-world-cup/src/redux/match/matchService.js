import { db, endpoint } from "../../configs/altogic";

const matchService = {
  getPredictions(teamId, week) {
    return db
      .model("predictions")
      .filter(`userTeam == '${teamId}' && week == ${week}`)
      .lookup({ field: "match" })
      .sort("match.date", "asc")
      .get();
  },
  guessScore(prediction) {
    return endpoint.post("/prediction/guessScore", prediction);
  },
  getCurrentWeek() {
    return db.model("game_settings").filter("isCurrent").getSingle();
  },
  getWeekMatches(week) {
    return db.model("matches").filter(`week == ${week}`).limit(50).get();
  },
  createPredictions(predictions) {
    return db.model("predictions").create(predictions);
  },
};

export default matchService;
