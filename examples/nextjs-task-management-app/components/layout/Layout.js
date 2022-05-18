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
import ProjectTab from "../../components/tasks/ProjectTab";
import { SidebarContext } from "../../context/sidebarContext";
import { UserContext } from "../../context/userContext";
import Head from "next/head";
config.autoAddCss = false; /* eslint-disable import/first */

function Layout(props) {
  const notificationContext = useContext(NotificationContext);
  const activeNotification = notificationContext.notification;
  const sidebarContext = useContext(SidebarContext);
  const userContext = useContext(UserContext);

  return (
    <Fragment>
      <Head>
        <title>Task Management Demo App</title>
        <meta
          name="description"
          content=" This is a task management demo app created using the client API
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
      <div className="grid grid-cols-12 bg-slate-100 h-screen">
        {sidebarContext.isOpen && userContext.user ? (
          <>
            <div className="col-span-2">
              <ProjectTab />
            </div>
            <div className="lg:col-span-10 md:col-span-10 col-span-12">
              <main>{props.children}</main>
            </div>
          </>
        ) : (
          <div className="col-span-12">
            <main>{props.children}</main>
          </div>
        )}
      </div>
      <AltogicBadge></AltogicBadge>
    </Fragment>
  );
}
export default Layout;
