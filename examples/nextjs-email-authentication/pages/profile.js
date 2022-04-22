import { altogic } from "../helpers/client";
import SessionList from "../components/profile/SessionList";
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import ProfilePhoto from "../components/profile/ProfilePhoto";
import NameSection from "../components/profile/NameSection";
import ChangePassword from "../components/profile/ChangePassword";
import ChangeEmail from "../components/profile/ChangeEmail";
import { checkCookies, getCookie, removeCookies } from "cookies-next";
import { Disclosure } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

function Profile(props) {
  const context = useContext(UserContext);

  return context.allSessionsList != null ? (
    <div className="min-h-screen mt-4 flex items-start justify-center px-4 sm:px-6 lg:px-8  ">
      <div className=" bg-white space-y-6 px-3 py-12 justify-centers border border-gray-300 shadow-lg">
        <ProfilePhoto profilePicture={props.user.profilePicture}></ProfilePhoto>
        <h2 className="flex items-center justify-center font-bold">
          {props.user.email}
        </h2>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-indigo-500 rounded-lg hover:bg-indigo-700 focus:outline-none focus-visible:ring ">
                <span>Change your username</span>
                <FontAwesomeIcon
                  icon={faChevronUp}
                  color="white"
                  className={`${
                    open ? "transform rotate-180" : ""
                  } w-5 h-5 text-white`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <NameSection user={props.user}></NameSection>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-indigo-500 rounded-lg hover:bg-indigo-700 focus:outline-none focus-visible:ring ">
                <span>Change your password</span>
                <FontAwesomeIcon
                  icon={faChevronUp}
                  color="white"
                  className={`${
                    open ? "transform rotate-180" : ""
                  } w-5 h-5 text-white`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <ChangePassword></ChangePassword>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-indigo-500 rounded-lg hover:bg-indigo-700 focus:outline-none focus-visible:ring ">
                <span>Change your email</span>
                <FontAwesomeIcon
                  icon={faChevronUp}
                  color="white"
                  className={`${
                    open ? "transform rotate-180" : ""
                  } w-5 h-5 text-white`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <ChangeEmail></ChangeEmail>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <SessionList sessions={context.allSessionsList}></SessionList>
      </div>
    </div>
  ) : (
    <></>
  );
}

export async function getServerSideProps({ req, res }) {
  let result;
  let tokenFromCookie;
  if (checkCookies("token", { req, res })) {
    // Check if there is a token between the browser and the server.
    // Get the cookie.
    // Set the session for Altogic's built in fetcher so we can send requests.
    // Get the current user from database.
    tokenFromCookie = getCookie("token", { req, res });
    altogic.auth.setSession({ token: tokenFromCookie });
    result = await altogic.auth.getUserFromDB();
  } else {
    return {
      //If there is no token, redirect to sign-in page.
      redirect: { destination: "/auth/sign-in", permanent: false },
    };
  }
  if (result.user) {
    //If a user is returned from database, pass it as props.
    return {
      props: { user: result.user, cookies: req.cookies },
    };
  } else {
    //If token is not active anymore, remove the cookie and redirect to sign-in page.
    removeCookies("token", {
      req,
      res,
      sameSite: "none",
      httpOnly: true,
      secure: true,
    });
    return {
      redirect: { destination: "/auth/sign-in", permanent: false },
    };
  }
}

export default Profile;
