import { Disclosure, Menu, Transition } from "@headlessui/react";
import { PlusSmIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../components/logo";
import { authActions } from "../redux/auth/authSlice";
import { MyRouter } from "../routes";
import Avatar from "./avatar";
import Button from "./button";

export default function Navbar({ ssr, newArt }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const userState = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(!ssr ? userState : null);
  useEffect(() => {
    setUser(userState);
  }, [userState]);

  const logout = () => {
    dispatch(
      authActions.signOutRequest({ onSuccess: () => router.push("/sign-in") })
    );
  };

  return (
    <Disclosure as="nav" className="flex-shrink-0 bg-violet-600">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <Link href="/">
                <div className="flex items-center px-2 lg:px-0 xl:w-64">
                  <div className="flex-shrink-0">
                    <Logo className="h-12 w-auto" />
                  </div>
                </div>
              </Link>

              <div className="flex lg:hidden"></div>
              <div className="lg:block lg:w-80">
                <div className="flex items-center justify-end">
                  <div className="flex-shrink-0">
                    {newArt && user && (
                      <button
                        type="button"
                        className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                        onClick={newArt}
                      >
                        <PlusSmIcon
                          className="-ml-1 mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        <span>New Art</span>
                      </button>
                    )}
                  </div>
                  {user ? (
                    <Menu as="div" className="ml-4 relative flex-shrink-0">
                      <Menu.Button className="bg-violet-700 flex text-sm rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-violet-700 focus:ring-white">
                        <span className="sr-only">Open user menu</span>
                        <Avatar size={10} className="w-10 h-10" />
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
                                href={MyRouter.userArts(user?.slug)}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                My Arts
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/settings"
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
                      <Link href="/sign-in">
                        <Button className="block w-full py-1 px-2 text-center bg-white border border-transparent rounded-md shadow-md text-base font-medium text-violet-700 hover:bg-gray-50 sm:inline-block sm:w-auto mr-2">
                          Login
                        </Button>
                      </Link>
                      <Link href="/create-an-account">
                        <Button className="hidden md:block w-full py-1 px-2 text-center bg-white border border-transparent rounded-md shadow-md text-base font-medium text-violet-700 hover:bg-gray-50 sm:inline-block sm:w-auto">
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
