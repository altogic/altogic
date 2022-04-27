import { useContext, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { AuthenticationContext } from "../context/AuthenticationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function ProfileDropdown() {
  const context = useContext(AuthenticationContext);
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="my-8 text-sm whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          Profile &nbsp; <FontAwesomeIcon icon={faChevronDown} />
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
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              <Link to="/profile" className="block px-4 py-2 text-sm">
                Profile Information
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/sessions" className="block px-4 py-2 text-sm">
                Sessions
              </Link>
            </Menu.Item>
            <Menu.Item>
              <button
                className="text-center block px-4 py-2 text-sm mb-2 text-red-600"
                onClick={(event) => {
                  event.preventDefault();
                  context.signOutCurrentSession();
                }}
              >
                Sign Out
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
