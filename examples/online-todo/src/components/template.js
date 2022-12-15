import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  LinkIcon,
  MenuAlt2Icon,
  UserAddIcon,
  XIcon,
} from "@heroicons/react/outline";
import cs from "classnames";
import { Fragment, useState } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/button";
import Logo from "../components/logo";
import { myRouter } from "../helpers/routes";
import { authActions } from "../redux/auth/authSlice";
import { listActions } from "../redux/list/listSlice";
import Avatar from "./avatar";
import Container from "./container";
import AddTeamMembersModal from "./modals/add-team-members-modal";
import DeleteModal from "./modals/delete-modal";
import NavigationList from "./navigation-list";
import classNames from "classnames";

export default function Template({ newButtonOnClick, children }) {
  const { workspaceSlug, listSlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addMembersShow, setAddMembersShow] = useState(false);
  const [deletedList, setDeletedList] = useState(null);

  const list = useSelector(({ list }) => _.get(list.lists, listSlug));

  const deleteList = () => {
    dispatch(
      listActions.deleteListRequest({
        listId: deletedList?._id,
        listSlug: deletedList?.slug,
        workspaceSlug,
        onSuccess: (slug) => {
          if (deletedList?.slug === listSlug) {
            navigate(myRouter.HOME(workspaceSlug));
          }
          toast.success("List removed successfully");
          setDeletedList(null);
        },
      })
    );
  };

  const copyCode = () => {
    toast.success("List link was copied.");
    const url = window.location;
    navigator.clipboard.writeText(url);
  };

  const newButton = () => {
    return (
      <Button
        className="w-full bg-indigo-500 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-600"
        onClick={() => {
          setSidebarOpen(false);
          newButtonOnClick(true);
        }}
      >
        New List
      </Button>
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
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-indigo-700">
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
                <Link to={myRouter.WORKSPACE}>
                  <div className="flex-shrink-0 flex items-center px-4">
                    <Logo w="50px" h="50px" />
                  </div>
                </Link>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    <NavigationList
                      setSidebarOpen={setSidebarOpen}
                      deletedList={deletedList}
                      setDeletedList={setDeletedList}
                    />
                  </nav>
                </div>
                <div className="border-t border-indigo-800 p-4">
                  {newButton()}
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
          </Dialog>
        </Transition.Root>

        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow pt-5 bg-indigo-700 overflow-y-auto">
            <Link to={myRouter.WORKSPACE}>
              <div className="flex items-center justify-center flex-shrink-0 px-4">
                <Logo w="50px" h="50px" />
              </div>
            </Link>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                <NavigationList
                  setSidebarOpen={setSidebarOpen}
                  deletedList={deletedList}
                  setDeletedList={setDeletedList}
                />
              </nav>
            </div>
            <div className="border-t border-indigo-800 p-4">{newButton()}</div>
          </div>
        </div>
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 px-4 flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-900" />
              <div className="ml-4 flex items-center md:ml-6">
                {(!list || (list && !list.isPublic)) && (
                  <button
                    type="button"
                    className={classNames([
                      "w-10 h-10 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500",
                      !list && "-m-2.5",
                    ])}
                    onClick={() => setAddMembersShow(true)}
                  >
                    <span className="sr-only">Add Member</span>
                    <UserAddIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
                {list && (
                  <button
                    type="button"
                    className="-m-2.5 w-10 h-10 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                    onClick={copyCode}
                  >
                    <span className="sr-only">Info</span>
                    <LinkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
            <Container>
              <div className="py-5">{children}</div>
            </Container>
          </main>
        </div>
        {addMembersShow && (
          <AddTeamMembersModal
            show={addMembersShow}
            setShow={setAddMembersShow}
          />
        )}
        {deletedList && (
          <DeleteModal
            title="Remove List"
            description="Are you sure you would like to remove this list?"
            setDeleteModal={() => setDeletedList(null)}
            clickDelete={deleteList}
          />
        )}
      </div>
    </>
  );
}
