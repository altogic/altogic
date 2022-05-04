import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthRedirect from "./pages/AuthRedirect";
import Header from "./components/Header";
import ProviderSelector from "./pages/ProviderSelector";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AuthenticationProvider from "./context/AuthenticationContext";
import Sessions from "./pages/Sessions";
import NotFound from "./pages/NotFound";
import RequiresAuth from "./components/Routes/RequiresAuth";
import RequiresNotAuth from "./components/Routes/RequiresNotAuth";
import ModalProvider from "./context/ModalContext";
import Footer from "./components/Footer";
function App() {
  return (
    <div className="App h-screen bg-slate-100">
      <ModalProvider>
        <AuthenticationProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* The difference between /signin and /signup route is only their static text. Functionality is totally same. */}
            <Route
              path="/signin"
              element={
                <RequiresNotAuth>
                  <ProviderSelector type="Sign In" />
                </RequiresNotAuth>
              }
            />
            <Route
              path="/signup"
              element={
                <RequiresNotAuth>
                  <ProviderSelector type="Sign Up" />
                </RequiresNotAuth>
              }
            />

            {/* This the route the provier will redirect user after authorization */}
            <Route path="/auth-redirect" element={<AuthRedirect />} />

            <Route
              path="/profile"
              element={
                <RequiresAuth>
                  <Profile />
                </RequiresAuth>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthenticationProvider>
      </ModalProvider>
      <Footer />
    </div>
  );
}

export default App;
