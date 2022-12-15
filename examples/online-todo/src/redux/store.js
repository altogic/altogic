import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSaga";

import { authSlice } from "./auth/authSlice";
import { workspaceSlice } from "./workspace/workspaceSlice";
import { listSlice } from "./list/listSlice";
import { invitationSlice } from "./invitation/invitationSlice";
import { todoSlice } from "./todo/todoSlice";
import { realtimeSlice } from "./realtime/realtimeSlice";

const sagaMiddleware = createSagaMiddleware();

const makeStore = () => {
  const store = configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      [workspaceSlice.name]: workspaceSlice.reducer,
      [listSlice.name]: listSlice.reducer,
      [invitationSlice.name]: invitationSlice.reducer,
      [todoSlice.name]: todoSlice.reducer,
      [todoSlice.name]: todoSlice.reducer,
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

export default makeStore;
