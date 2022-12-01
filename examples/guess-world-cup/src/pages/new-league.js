import _ from "lodash";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../components/button";
import Logo from "../components/logo";
import LeagueFormModal from "../components/modals/league-form-modal";
import Navbar from "../components/navbar";

export default function NewLeague() {
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Navbar />
      <div className="h-screen">
        <div className="relative lg:py-8 h-screen">
          <div className="max-w-7xl mx-auto bg-pink-600 lg:bg-transparent lg:px-8">
            <div className="relative">
              <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-pink-900 mix-blend-multiply" />
                  </div>
                  <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                    <h1 className="flex justify-center items-center flex-col text-4xl text-center font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                      <Logo className="w-[200px]" />
                      <span className="block text-white">Let's play</span>
                      <span className="block text-pink-200">
                        Guess World Cup
                      </span>
                    </h1>
                    <div className="mt-14 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                      <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                        {user ? (
                          <>
                            <Button
                              className="block w-full py-3 px-5 text-center bg-white border border-transparent rounded-md shadow-md text-base font-medium text-pink-700 hover:bg-gray-50 sm:inline-block sm:w-auto"
                              onClick={() => setOpen("create")}
                            >
                              Create League
                            </Button>
                            <Button
                              className="block w-full py-3 px-5 text-center bg-white border border-transparent rounded-md shadow-md text-base font-medium text-pink-700 hover:bg-gray-50 sm:inline-block sm:w-auto md:ml-3"
                              onClick={() => setOpen("join")}
                            >
                              Join League
                            </Button>
                          </>
                        ) : (
                          <>
                            <Link
                              className="block w-full py-3 px-5 text-center bg-white border border-transparent rounded-md shadow-md text-base font-medium text-pink-700 hover:bg-gray-50 sm:inline-block sm:w-auto"
                              to="/sign-in"
                            >
                              Create League
                            </Link>
                            <Link
                              className="block w-full py-3 px-5 text-center bg-white border border-transparent rounded-md shadow-md text-base font-medium text-pink-700 hover:bg-gray-50 sm:inline-block sm:w-auto md:ml-3"
                              to="/sign-in"
                            >
                              Join League
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                    {user?.leagues && !_.isEmpty(user?.leagues) && (
                      <p className="text-center mt-8 text-sm text-white">
                        <Link
                          to={`/league/${_.first(user?.leagues).slug}`}
                          className="font-medium text-white tracking-sm hover:text-pink-500"
                        >
                          Go to dashboard
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <LeagueFormModal open={open} setOpen={setOpen} />
        </div>
      </div>
    </>
  );
}
