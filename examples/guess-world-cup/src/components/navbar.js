import { Disclosure, Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import _ from "lodash";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/logo";
import { authActions } from "../redux/auth/authSlice";
import Avatar from "./avatar";
import Button from "./button";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const hasLeague = user?.leagues && !_.isEmpty(user?.leagues);

  const logout = () => {
    dispatch(
      authActions.signOutRequest({ onSuccess: () => navigate("/sign-in") })
    );
  };

  return (
    <Disclosure as="nav" className="flex-shrink-0 bg-pink-600">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <Link
                to={hasLeague ? `/league/${_.first(user?.leagues).slug}` : "/"}
              >
                <div className="flex items-center px-2 lg:px-0 xl:w-64">
                  <div className="flex-shrink-0">
                    <Logo className="h-12 w-auto" />
                  </div>
                </div>
              </Link>

              <div className="block lg:w-80">
                <div className="flex items-center justify-end">
                  {user ? (
                    <Menu as="div" className="ml-4 relative flex-shrink-0">
                      <Menu.Button className="bg-pink-700 flex text-sm rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-pink-700 focus:ring-white">
                        <span className="sr-only">Open user menu</span>
                        <Avatar size={10} />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/settings"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Settings
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                onClick={logout}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                )}
                              >
                                Logout
                              </div>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <>
                      <Link to="/sign-in">
                        <Button className="block w-full py-1 px-2 text-center bg-white border border-transparent rounded-md shadow-md text-base font-medium text-pink-700 hover:bg-gray-50 sm:inline-block sm:w-auto">
                          Login
                        </Button>
                      </Link>
                      <Link to="/create-an-account">
                        <Button className="w-full py-1 px-2 text-center bg-white border border-transparent rounded-md shadow-md text-base font-medium text-pink-700 hover:bg-gray-50 sm:inline-block sm:w-auto ml-2 hidden sm:block">
                          Register
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
