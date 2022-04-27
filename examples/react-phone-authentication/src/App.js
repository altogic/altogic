import "./App.css";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Verification from "./pages/Verification";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AuthenticationProvider from "./context/AuthenticationContext";
import NotVerified from "./pages/NotVerified";
import Sessions from "./pages/Sessions";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordCode from "./pages/ResetPasswordCode";
import NotFound from "./pages/NotFound";
import RequiresAuth from "./components/Routes/RequiresAuth";
import RequiresNotAuth from "./components/Routes/RequiresNotAuth";
import ModalProvider from "./context/ModalContext";
import CounterProvider from "./context/CounterContext";

// App will be displayed as <Header - Routes - Footer order>
// RequiresAuth and RequiresNotAuth components are route restriction component to protecting components.
function App() {
  return (
    <div className="App h-screen bg-slate-100">
      <CounterProvider>
        <ModalProvider>
          <AuthenticationProvider>
            <Header />
            <Routes>
              <Route
                path="/signin"
                element={
                  <RequiresNotAuth>
                    <SignIn />
                  </RequiresNotAuth>
                }
              />
              <Route
                path="/signup"
                element={
                  <RequiresNotAuth>
                    <SignUp />
                  </RequiresNotAuth>
                }
              />
              <Route
                path="/verification"
                element={
                  <RequiresNotAuth>
                    <Verification isAuth={false} />
                  </RequiresNotAuth>
                }
              />
              <Route path="/" element={<Home />} />
              <Route
                path="/profile"
                element={
                  <RequiresAuth>
                    <Profile />
                  </RequiresAuth>
                }
              />
              <Route
                path="/changePhoneNumber"
                element={
                  <RequiresAuth>
                    <Verification isAuth={true} />
                  </RequiresAuth>
                }
              />
              <Route
                path="/phone_not_verified"
                element={
                  <RequiresNotAuth>
                    <NotVerified />
                  </RequiresNotAuth>
                }
              />
              <Route
                path="/sessions"
                element={
                  <RequiresAuth>
                    <Sessions />
                  </RequiresAuth>
                }
              />
              <Route
                path="/resetPassword"
                element={
                  <RequiresNotAuth>
                    <ResetPassword />
                  </RequiresNotAuth>
                }
              />
              <Route
                path="/resetPassword/code"
                element={
                  <RequiresNotAuth>
                    <ResetPasswordCode />
                  </RequiresNotAuth>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthenticationProvider>
        </ModalProvider>
      </CounterProvider>
      <Footer />
    </div>
  );
}

export default App;
