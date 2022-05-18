import Head from "next/head";
import { Fragment } from "react";
import Layout from "../components/layout/Layout";
import { NotificationContextProvider } from "../context/notificationContext";
import SidebarProvider from "../context/sidebarContext";
import TaskProvider from "../context/taskContext";
import { UserContextProvider } from "../context/userContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <SidebarProvider>
        <NotificationContextProvider>
          <UserContextProvider>
            <TaskProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </TaskProvider>
          </UserContextProvider>
        </NotificationContextProvider>
      </SidebarProvider>
    </Fragment>
  );
}

export default MyApp;
