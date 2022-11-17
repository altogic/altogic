import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import AuthProvider from "./contexts/Auth.context";
import AuthRedirectView from "./pages/auth-redirect";
import IndexView from "./pages/index";
import MagicLinkView from "./pages/magic-link";
import ProfileView from "./pages/profile";
import SignInView from "./pages/sign-in";
import SignUpView from "./pages/sign-up";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<IndexView />} />
          <Route path="/auth-redirect" element={<AuthRedirectView />} />
          <Route path="/magic-link" element={<MagicLinkView />} />
          <Route path="/sign-in" element={<SignInView />} />
          <Route path="/sign-up" element={<SignUpView />} />
          {/* Private Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfileView />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
