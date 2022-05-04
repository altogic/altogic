import { Link } from "react-router-dom";
import altogic from "../helpers/altogic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faGoogle,
  faDiscord,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
const ProviderSelector = (props) => {
  const type = props.type;

  // This function will be triggered after the user selects provider from the UI.
  //It takes the selected provider as parameter and redirects user to the providers login&authorization page
  const signin = (provider) => {
    altogic.auth.signInWithProvider(provider);
  };
  return (
    <div className="flex mt-10">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-lg py-1 px-16">
        <div className="min-h-full flex  py-5 pl-7 sm:px-6 lg:px-8 ">
          <div className="max-w-md w-full space-y-8">
            <div className=" text-center">
              <img
                className="mx-auto w-auto"
                src={require("../images/logo.png")}
                alt="logo"
              />
              <h2 className="mt-1 font-semibold text-3xl text-gray-900 ">
                {type}
              </h2>
              <p className="text-gray-400">Choose your account</p>
            </div>
            <div className="text-center text-gray-400  text-sm">
              <div className="btn-group text-left">
                <button
                  className=" my-2  text-indigo-600 text-sm pl-7 font-semibold py-2 border w-full rounded-md text-left  bg-slate-200 hover:bg-slate-300"
                  onClick={(event) => {
                    event.preventDefault();
                    signin("google");
                  }}
                >
                  <FontAwesomeIcon icon={faGoogle} size="xl" className="mr-3" />
                  Continue with Google
                </button>
                <button
                  className=" my-2 text-indigo-600 text-sm  pl-7 font-semibold py-2 border w-full rounded-md text-left  bg-slate-200 hover:bg-slate-300"
                  onClick={(event) => {
                    event.preventDefault();
                    signin("facebook");
                  }}
                >
                  <FontAwesomeIcon
                    icon={faFacebook}
                    size="xl"
                    className="mr-3"
                  />
                  Continue with Facebook
                </button>
                <button
                  className=" my-2 text-indigo-600 text-sm  pl-7 font-semibold py-2 border w-full rounded-md text-left  bg-slate-200 hover:bg-slate-300"
                  onClick={(event) => {
                    event.preventDefault();
                    signin("twitter");
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTwitter}
                    size="xl"
                    className="mr-3"
                  />
                  Continue with Twitter
                </button>
                <button
                  className=" my-2 text-indigo-600 text-sm  pl-7 font-semibold py-2 border w-full rounded-md text-left  bg-slate-200 hover:bg-slate-300"
                  onClick={(event) => {
                    event.preventDefault();
                    signin("discord");
                  }}
                >
                  <FontAwesomeIcon
                    icon={faDiscord}
                    size="xl"
                    className="mr-3"
                  />
                  Continue with Discord
                </button>
                <button
                  className=" my-2 text-indigo-600 text-sm  pl-7 font-semibold py-2 border w-full rounded-md text-left  bg-slate-200 hover:bg-slate-300"
                  onClick={(event) => {
                    event.preventDefault();
                    signin("github");
                  }}
                >
                  <FontAwesomeIcon icon={faGithub} size="xl" className="mr-3" />
                  Continue with Github
                </button>
              </div>
              <p>
                {type === "Sign In"
                  ? "Don't have an account?"
                  : "Already have an account?"}
                &nbsp;
                {type === "Sign In" ? (
                  <Link to="/signup" className="text-blue-600">
                    Sign up
                  </Link>
                ) : (
                  <Link to="/signin" className="text-blue-600">
                    Sign in
                  </Link>
                )}
                &nbsp;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSelector;
