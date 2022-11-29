import { createSlice } from "@reduxjs/toolkit";
// Initial state
const initialState = {
  predictions: undefined,
  predictionsList: {},
};

export const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    getPredictionsRequest() {},
    guessScoreRequest() {},

    setPredictions(state, action) {
      state.predictions = action.payload;
      // state.predictionsList = {
      //   [action.payload[0]._id]: action.payload,
      // };
    },
  },
});

export const matchActions = matchSlice.actions;

export default matchSlice.reducer;
