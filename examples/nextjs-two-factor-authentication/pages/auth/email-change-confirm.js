import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeCircleCheck } from "@fortawesome/free-solid-svg-icons";

function VerificationSent() {
  return (
    <div className=" min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8  ">
      <div className="max-w-lg space-y-8 px-12 py-12 border border-gray-100 shadow-lg ">
        <FontAwesomeIcon
          className="flex items-center justify-center mx-auto"
          icon={faEnvelopeCircleCheck}
          size={"5x"}
          color="green"
        />
        <p className="text-xl text-center font-semibold leading-6 ">
          You have confirmed your email 🥳
        </p>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const { user } = await altogic.auth.getUserFromDBbyCookie(req, res);
  if (user) {
    return {
      //If there is a user, redirect to sign-in page.
      redirect: { destination: "/profile", permanent: false },
    };
  } else {
    return {
      props: {},
    };
  }
}

export default VerificationSent;
