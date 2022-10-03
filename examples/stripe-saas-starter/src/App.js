import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Pricing } from "./components/Pricing";
import { Signup } from "./components/Signup";
import { Verification } from "./components/Verification";

import { Login } from "./components/Login";
import { PrivateRoute } from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/Auth";
import { Profile } from "./components/Profile";
import { ResetPassword } from "./components/ResetPassword";
import { Success } from "./components/Success";
import { Cancel } from "./components/Cancel";
import { Invoices } from "./components/Invoices";
import { Subscriptions } from "./components/Subscriptions";
import Redirect from "./components/Redirect";
import { Account } from "./components/Account";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path="/reset-password"
              element={
                <PrivateRoute>
                  <ResetPassword />
                </PrivateRoute>
              }
            />
            <Route
              path="/pricing"
              element={
                <PrivateRoute>
                  <Pricing />
                </PrivateRoute>
              }
            />
            <Route
              path="/cancel"
              element={
                <PrivateRoute>
                  <Cancel />
                </PrivateRoute>
              }
            />
            <Route
              path="/success"
              element={
                <PrivateRoute>
                  <Success />
                </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            />
            <Route
              path="/subscriptions"
              element={
                <PrivateRoute>
                  <Subscriptions />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <PrivateRoute>
                  <Invoices />
                </PrivateRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth-redirect" element={<Redirect />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
