import { db, endpoint } from "../../configs/altogic";

const leagueService = {
  create({ teamName, leagueName, userName }) {
    return endpoint.put("league", {
      teamName,
      leagueName,
      userName,
    });
  },
  checkLeagueName(leagueName, leagueId) {
    return endpoint.post("/league/leagueName", { leagueName, leagueId });
  },
  getLeagueBySlug(leagueSlug) {
    return db.model("leagues").filter(`slug == '${leagueSlug}'`).get();
  },
  getTeamsByLeagueSlug(leagueSlug) {
    return db
      .model("user_teams")
      .filter(`leagueSlug == '${leagueSlug}'`)
      .sort("point", "desc")
      .lookup({ field: "user" })
      .get();
  },
  checkLeagueCode(leagueCode) {
    return endpoint.post("/league/leagueCode", { leagueCode });
  },
  join({ teamName, leagueId, leagueSlug }) {
    return endpoint.post("/league/join", {
      teamName,
      leagueId,
      leagueSlug,
    });
  },
  changeLeagueName(leagueId, leagueName) {
    return endpoint.post("/league/changeLeagueName", {
      leagueId,
      leagueName,
    });
  },
  deleteTeam(leagueId, teamId, userId) {
    return endpoint.delete("/league/team", {
      leagueId,
      teamId,
      userId,
    });
  },
  deleteLeague(leagueId) {
    return endpoint.delete("/league", {
      leagueId,
    });
  },
};

export default leagueService;
