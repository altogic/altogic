import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";

import AuthProvider from "./contexts/Auth.context";
import PrivateRoute from "./components/PrivateRoutes";
import IndexView from "./pages/index";
import MagicLinkView from "./pages/magic-link";
import SignInView from "./pages/sign-in";
import SignUpView from "./pages/sign-up";
import AuthRedirectView from "./pages/auth-redirect";
import ProfileView from "./pages/profile";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Public Routes */}
          <Route exact path="/" component={IndexView} />
          <Route exact path="/magic-link" component={MagicLinkView} />
          <Route exact path="/sign-in" component={SignInView} />
          <Route exact path="/sign-up" component={SignUpView} />
          <Route exact path="/auth-redirect" component={AuthRedirectView} />
          {/* Private Routes */}
          <Route exact path="/profile" component={AuthRedirectView}>
            <PrivateRoute>
              <ProfileView />
            </PrivateRoute>
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;
