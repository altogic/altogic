import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  CogIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  LinkIcon,
  MenuAlt2Icon,
  XIcon,
} from "@heroicons/react/outline";
import cs from "classnames";
import _ from "lodash";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/button";
import Logo from "../components/logo";
import functions from "../helpers/functions";
import { authActions } from "../redux/auth/authSlice";
import Avatar from "./avatar";
import InfoModal from "./modals/info-modal";

export default function Sidebar({ children }) {
  const { leagueSlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const league = useSelector((state) => state.league.league);

  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const copyCode = () => {
    toast.success("Invation code copied to clipboard");
    navigator.clipboard.writeText(league?.code);
  };

  const getNavigations = () => {
    return (
      <>
        {_.map(user?.leagues, ({ slug }) => (
          <Link
            key={slug}
            to={`/league/${slug}`}
            onClick={() => sidebarOpen(false)}
            className={cs(
              leagueSlug === slug
                ? "bg-pink-800 text-white"
                : "text-pink-100 hover:bg-pink-600",
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            )}
          >
            <GlobeAltIcon
              className="mr-3 flex-shrink-0 h-6 w-6 text-pink-300"
              aria-hidden="true"
            />
            {functions.convertToTitle(slug)}
          </Link>
        ))}
      </>
    );
  };

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-pink-700">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <Button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center px-4">
                  <Logo w="250px" />
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">{getNavigations()}</nav>
                </div>
                <div className="border-t border-pink-800 p-4">
                  <Link to="/">
                    <Button className="w-full bg-pink-500 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-pink-600">
                      New League
                    </Button>
                  </Link>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
          </Dialog>
        </Transition.Root>

        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow pt-5 bg-pink-700 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Logo />
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {getNavigations()}
              </nav>
            </div>
            <div className="border-t border-pink-800 p-4">
              <Link to="/">
                <Button className="w-full bg-pink-500 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-pink-600">
                  New League
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 px-4 flex justify-end">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="-m-2.5 w-10 h-10 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                  onClick={() => setOpenInfoModal(true)}
                >
                  <span className="sr-only">Info</span>
                  <InformationCircleIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                  onClick={copyCode}
                >
                  <span className="sr-only">Insert link</span>
                  <LinkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                {league?.owner === user?._id && (
                  <Link
                    className="-m-2.5 w-10 h-10 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                    to={`/settings/?tab=${league?.slug}`}
                  >
                    <span className="sr-only">Settings</span>
                    <CogIcon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                )}
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                      <span className="sr-only">Open user menu</span>
                      <Avatar size={10} />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/settings"
                            className={cs(
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
                          <label
                            onClick={() =>
                              dispatch(
                                authActions.signOutRequest({
                                  onSuccess: () => navigate("/sign-in"),
                                })
                              )
                            }
                            className={cs(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                            )}
                          >
                            Sign Out
                          </label>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <main>
            <div className="py-6">{children}</div>
          </main>
        </div>
        <InfoModal open={openInfoModal} setOpen={setOpenInfoModal} />
      </div>
    </>
  );
}
