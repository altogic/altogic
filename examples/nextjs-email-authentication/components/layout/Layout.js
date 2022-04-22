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
config.autoAddCss = false; /* eslint-disable import/first */

function Layout(props) {
  const notificationContext = useContext(NotificationContext);
  const activeNotification = notificationContext.notification;

  return (
    <Fragment>
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
