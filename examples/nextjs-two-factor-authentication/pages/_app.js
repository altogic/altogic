import Head from "next/head";
import { Fragment } from "react";
import Layout from "../components/layout/Layout";
import { NotificationContextProvider } from "../context/notificationContext";
import { UserContextProvider } from "../context/userContext";
import { CounterContextProvider } from "../context/CounterContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <CounterContextProvider>
        <NotificationContextProvider>
          <UserContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </UserContextProvider>
        </NotificationContextProvider>
      </CounterContextProvider>
    </Fragment>
  );
}

export default MyApp;
