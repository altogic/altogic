import { useState, useEffect, useContext } from "react";
import { Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { AuthenticationContext } from "../context/AuthenticationContext";
import ProfileDropdown from "./ProfileDropdown";
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(AuthenticationContext);
  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };
  const signOut = async (event) => {
    event.preventDefault();
    toggleIsOpen();
    await context.signOutCurrentSession();
  };
  return (
    <nav className="sticky top-0 z-50 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="">
              <a href="/">
                <img
                  className="h-24 mt-4"
                  src={require("../images/AcmeCo.png")}
                  alt="logo"
                />
              </a>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4"></div>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {context.isAuth ? (
              <ProfileDropdown />
            ) : (
              <div>
                <Link
                  to="/signin"
                  className="whitespace-nowrap text-base font-medium text-gray-300 hover:text-gray-400"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 h-auto border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleIsOpen}
              type="button"
              className="bg-slate-400 inline-flex items-center justify-center p-2 rounded-md text-indigo-700 hover:bg-slate-300"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only"></span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="md:hidden" id="mobile-menu" v-if="isAuth">
          {context.isAuth ? (
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/profile"
                onClick={toggleIsOpen}
                className="
              text-slate-300
              hover:bg-gray-700 hover:text-white
              block
              px-3
              py-2
              rounded-md
              text-base
              font-medium
              cursor-pointer
            "
              >
                Profile Information
              </Link>
              <Link
                onClick={toggleIsOpen}
                to="/sessions"
                className="
              text-slate-300
              hover:bg-gray-700 hover:text-white
              block
              px-3
              py-2
              rounded-md
              text-base
              font-medium
              cursor-pointer
            "
              >
                Sessions
              </Link>
              <Link
                onClick={signOut}
                to="/"
                className="
              text-red-500
              hover:bg-gray-700 hover:text-red-600
              block
              px-3
              py-2
              rounded-md
              text-base
              cursor-pointer
              font-medium
            "
              >
                Sign Out
              </Link>
            </div>
          ) : (
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/signin"
                className="
              text-slate-300
              hover:bg-gray-700 hover:text-white
              block
              px-3
              py-2
              rounded-md
              text-base
              font-medium
              cursor-pointer
            "
                onClick={toggleIsOpen}
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="
              bg-indigo-600
              text-white
              hover:bg-indigo-700 hover:text-white
              block
              px-3
              py-2
              rounded-md
              text-base
              font-medium
              cursor-pointer
            "
                onClick={toggleIsOpen}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </Transition>
    </nav>
  );
}

export default Header;
