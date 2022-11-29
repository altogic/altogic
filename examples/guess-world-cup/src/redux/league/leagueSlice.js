import { createSlice } from "@reduxjs/toolkit";
// Initial state
const initialState = {
  league: undefined,
  teamId: undefined,
};

export const leagueSlice = createSlice({
  name: "league",
  initialState,
  reducers: {
    createRequest() {},
    checkLeagueNameRequest() {},
    getLeagueBySlugRequest() {},
    checkleagueCodeRequest() {},
    joinRequest() {},
    changeLeagueNameRequest() {},
    deleteTeamRequest() {},
    removeLeagueRequest() {},

    setLeague(state, action) {
      state.league = action.payload;
    },
    setTeamId(state, action) {
      state.teamId = action.payload;
    },
  },
});

export const leagueActions = leagueSlice.actions;

export default leagueSlice.reducer;
