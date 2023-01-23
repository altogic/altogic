import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { createWrapper } from "next-redux-wrapper";
import rootSaga from "./rootSaga";

import { authSlice } from "./auth/authSlice";
import { pixelSlice } from "./pixel/pixelSlice";
import { realtimeSlice } from "./realtime/realtimeSlice";

const sagaMiddleware = createSagaMiddleware();

const makeStore = () => {
  const store = configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      [pixelSlice.name]: pixelSlice.reducer,
      [realtimeSlice.name]: realtimeSlice.reducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
      }).prepend(sagaMiddleware),
  });
  sagaMiddleware.run(rootSaga);
  return store;
};

export const wrapper = createWrapper(makeStore);
