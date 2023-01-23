import { wrapper } from "../redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import NoSSR from "react-no-ssr";
import WrapApp from "../components/wrap-app";

function App({ Component, pageProps }) {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (
      user &&
      [
        "/sign-in",
        "/create-an-account",
        "/forgot-password",
        "/forgot-password-email",
        "/reset-password-successful",
      ].includes(router.asPath)
    ) {
      router.push("/");
    } else if (!user && ["/settings", "/s"].includes(router.asPath)) {
      router.push("/sign-in");
    }
  }, [router.asPath, user]);

  return (
    <>
      {Component.name == "Pixel" ? (
        <WrapApp>
          <Component {...pageProps} />
        </WrapApp>
      ) : (
        <NoSSR>
          <WrapApp>
            <Component {...pageProps} />
          </WrapApp>
        </NoSSR>
      )}

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
    </>
  );
}

export default wrapper.withRedux(App);
