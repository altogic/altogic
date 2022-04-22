import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faGithub,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
export default function Home() {
  return (
    <div className="py-2">
      <Head>
        <title>Email Authentication Demo App</title>
        <meta
          name="description"
          content=" This is an email authentication demo app created using the client API
          of Altogic."
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8  ">
        <Image src="/logo.png" width={300} height={300} alt="Logo"></Image>
        <h1 className=" text-5xl font-bold text-center">Welcome to AcmeCo!</h1>

        <p className="mt-8 mb-8 text-lg text-center">
          This is an email authentication demo app created using the client API
          of Altogic.
        </p>
        <div className="grid lg:grid-cols-2 mx-auto  gap-16">
          {" "}
          <div className="text-center">
            <a
              className="text-gray-500 text-base"
              href="https://github.com/altogic/altogic/tree/main/examples/nextjs-email-authentication"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="max-w-sm rounded overflow-hidden shadow-md my-5 h-48  hover:text-white text-[#1976d2] hover:bg-[#1976d2]">
                <div className="my-4  w-full overflow-hidden">
                  <div className="px-6 py-4">
                    <FontAwesomeIcon
                      icon={faGithub}
                      style={{ fontSize: 30 }}
                      className="pb-4"
                    ></FontAwesomeIcon>{" "}
                    <div className="font-bold text-xl mb-2 ">
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
              href="https://medium.com/altogic/altogic-email-authentication-with-next-js-and-altogic-4c036c36ea8f"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="max-w-sm rounded overflow-hidden shadow-md my-5 h-48 hover:text-white text-[#1976d2] hover:bg-[#1976d2]">
                <div className="my-4  w-full overflow-hidden">
                  <div className="px-6 py-4">
                    <FontAwesomeIcon
                      icon={faMedium}
                      style={{ fontSize: 30 }}
                      className="pb-4"
                    ></FontAwesomeIcon>{" "}
                    <div className="font-bold text-xl mb-2 ">
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
              href="https://youtu.be/rlOTW_NuJzc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="max-w-sm rounded overflow-hidden shadow-md my-5 h-48 hover:text-white text-[#1976d2] hover:bg-[#1976d2]">
                <div className="my-4  w-full overflow-hidden">
                  <div className="px-6 py-4">
                    <FontAwesomeIcon
                      icon={faYoutube}
                      style={{ fontSize: 30 }}
                      className="pb-4"
                    ></FontAwesomeIcon>{" "}
                    <div className="font-bold text-xl mb-2 ">Youtube Video</div>
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
              <div className="max-w-sm rounded overflow-hidden shadow-md my-5 h-48 hover:text-white text-[#1976d2] hover:bg-[#1976d2]">
                <div className="my-4 w-full overflow-hidden">
                  <div className="px-6 py-4">
                    <FontAwesomeIcon
                      icon={faBook}
                      style={{ fontSize: 30 }}
                      className="pb-4"
                    ></FontAwesomeIcon>{" "}
                    <div className="font-bold text-xl mb-2 ">
                      Altogic Client API Reference
                    </div>
                    Learn more about Altogic Client Library
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
