import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faGithub,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";

function Home() {
  return (
    <div className="grid place-items-center">
      <div className="text-center font-bold text-slate-600 px-7">
        <img
          className="mx-auto w-auto h-60"
          src={require("../images/logo.png")}
          alt="logo"
        />
        This is a OAuth Provider Authentication App built in React & Altogic.
        <hr className="w-full my-3 border-2 border-purple-600" />
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="text-center">
          <a
            className="text-gray-500 text-base"
            href="https://github.com/altogic/altogic/tree/main/examples/react-oauth-provider-authentication"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="max-w-sm rounded overflow-hidden shadow-lg my-5 h-48 hover:bg-slate-200">
              <div className="my-4  w-full overflow-hidden">
                <div className="px-6 py-4">
                  <FontAwesomeIcon
                    icon={faGithub}
                    style={{ fontSize: 30 }}
                    className="pb-4 text-indigo-700"
                  ></FontAwesomeIcon>{" "}
                  <div className="font-bold text-xl mb-2 text-indigo-700">
                    Github Repository
                  </div>
                  Check the Github Repository for the source code. You can
                  download and clone it
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="text-center">
          <a
            className="text-gray-500 text-base"
            href="https://medium.com/altogic/how-to-build-oauth-provider-authentication-with-react-and-altogic-9282feed0c33"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="max-w-sm rounded overflow-hidden shadow-lg my-5 h-48 hover:bg-slate-200">
              <div className="my-4  w-full overflow-hidden">
                <div className="px-6 py-4">
                  <FontAwesomeIcon
                    icon={faMedium}
                    style={{ fontSize: 30 }}
                    className="pb-4 text-indigo-700"
                  ></FontAwesomeIcon>{" "}
                  <div className="font-bold text-xl mb-2 text-indigo-700">
                    Medium Blog & Documentation
                  </div>
                  Walk through the development process on our blog post
                </div>
              </div>
            </div>
          </a>
        </div>{" "}
        <div className="text-center">
          <a
            className="text-gray-500 text-base"
            href="https://youtu.be/tQJoT8bybMU"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="max-w-sm rounded overflow-hidden shadow-lg my-5 h-48 hover:bg-slate-200">
              <div className="my-4  w-full overflow-hidden">
                <div className="px-6 py-4">
                  <FontAwesomeIcon
                    icon={faYoutube}
                    style={{ fontSize: 30 }}
                    className="pb-4 text-indigo-700"
                  ></FontAwesomeIcon>{" "}
                  <div className="font-bold text-xl mb-2 text-indigo-700 ">
                    Youtube Video
                  </div>
                  Check out the youtube showcase video of the app
                </div>
              </div>
            </div>
          </a>
        </div>{" "}
        <div className="text-center">
          <a
            className="text-gray-500 text-base"
            href="https://clientapi.altogic.com/v1.2.2/modules.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="max-w-sm rounded overflow-hidden shadow-lg my-5 h-48 hover:bg-slate-200">
              <div className="my-4 w-full overflow-hidden">
                <div className="px-6 py-4">
                  <FontAwesomeIcon
                    icon={faBook}
                    style={{ fontSize: 30 }}
                    className="pb-4 text-indigo-700"
                  ></FontAwesomeIcon>
                  <div className="font-bold text-xl mb-2 text-indigo-700 ">
                    Altogic Client API Reference
                  </div>
                  Learn more about the Altogic Client Library
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
export default Home;
