import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import makeStore from "./redux/store";

import _ from "lodash";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as ProtectedRoute from "./components/core/protected-route";
import ScrollToTop from "./components/scroll-top";
import myRoutes from "./helpers/routes";
import WrapApp from "./components/core/wrap-app";

const store = makeStore();

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <Routes>
          {_.map(myRoutes, (route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.needAuth ? (
                  <ProtectedRoute.Private>
                    <WrapApp>
                      <route.component />
                    </WrapApp>
                  </ProtectedRoute.Private>
                ) : route.needAuth === null ? (
                  <WrapApp>
                    <route.component />
                  </WrapApp>
                ) : (
                  <ProtectedRoute.Public>
                    <WrapApp>
                      <route.component />
                    </WrapApp>
                  </ProtectedRoute.Public>
                )
              }
            />
          ))}
        </Routes>
      </Router>

      <ToastContainer
        position="top-center"
        autoClose={700}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Provider>
  );
}
