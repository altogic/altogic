import { altogic } from "../helpers/client";
import SessionList from "../components/profile/SessionList";
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import ProfilePhoto from "../components/profile/ProfilePhoto";
import NameSection from "../components/profile/NameSection";
import ChangePhoneSection from "../components/profile/ChangePhoneSection";
import ChangePassword from "../components/profile/ChangePassword";
import ChangeEmail from "../components/profile/ChangeEmail";
import { Disclosure } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Toggle2FA from "../components/profile/Toggle2FA";

function Profile(props) {
  const context = useContext(UserContext);

  return context.allSessionsList != null ? (
    <div className="min-h-screen mt-4 flex items-start justify-center px-4 sm:px-6 lg:px-8  ">
      <div className=" bg-white space-y-6 px-3 py-12 justify-centers border border-gray-300 shadow-lg">
        <ProfilePhoto profilePicture={props.user.profilePicture}></ProfilePhoto>
        <h2 className="flex items-center justify-center font-bold">
          {props.user.email}
        </h2>
        <h3 className="flex items-center justify-center font-bold">
          {props.user.phone}
        </h3>
        {props.user.phone && <Toggle2FA user={props.user}></Toggle2FA>}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-indigo-500 rounded-lg hover:bg-indigo-700 focus:outline-none focus-visible:ring ">
                {context.user.phone ? (
                  <span>Change your phone number</span>
                ) : (
                  <span>Set your phone number</span>
                )}
                <FontAwesomeIcon
                  icon={faChevronUp}
                  color="white"
                  className={`${
                    open ? "transform rotate-180" : ""
                  } w-5 h-5 text-white`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <ChangePhoneSection user={props.user}></ChangePhoneSection>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
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
  const { user } = await altogic.auth.getUserFromDBbyCookie(req, res);
  if (user) {
    return {
      props: { user: user },
    };
  } else {
    return {
      //If there is no user, redirect to sign-in page.
      redirect: { destination: "/auth/sign-in", permanent: false },
    };
  }
}

export default Profile;
