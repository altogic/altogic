import { Fragment, useContext } from "react";
import NotificationContext from "../../context/notificationContext";
import Header from "./Header";
import Notification from "../ui/Notification";
import AltogicBadge from "./AltogicBadge";
// This import prevents a server-side rendering bug causing Font Awesome icons,
// to flash from a large icon to where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
import Head from "next/head";
config.autoAddCss = false; /* eslint-disable import/first */

function Layout(props) {
  const notificationContext = useContext(NotificationContext);
  const activeNotification = notificationContext.notification;

  return (
    <Fragment>
      <Head>
        <title>Magic Link Authentication Demo App</title>
        <meta
          name="description"
          content=" This is an magic link authentication demo app created using the client API
          of Altogic."
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      {activeNotification && (
        <Notification
          title={activeNotification.title}
          message={activeNotification.message}
          status={activeNotification.status}
        />
      )}
      <main>{props.children}</main>
      <AltogicBadge></AltogicBadge>
    </Fragment>
  );
}
export default Layout;
