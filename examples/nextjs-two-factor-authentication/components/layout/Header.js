import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Fragment } from "react";
import { useUserContext } from "../../context/userContext";

function Header() {
  const [active, setActive] = useState(false);
  const { user } = useUserContext();

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <>
      <nav className="flex items-center flex-wrap shadow-sm px-6 ">
        <Link href="/">
          <a className="inline-flex items-center p-2 mr-4 ">
            <Image src="/logo.png" alt="Logo" height={90} width={90}></Image>
          </a>
        </Link>
        <button
          className=" inline-flex mr-6 p-3 hover:bg-indigo-700 rounded lg:hidden text-gray ml-auto hover:text-white outline-none"
          onClick={handleClick}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div
          className={`${
            active ? "" : "hidden"
          }   w-full lg:inline-flex lg:flex-grow lg:w-auto`}
        >
          <div className="lg:inline-flex text-center lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center flex flex-col lg:h-auto">
            {user ? (
              <Fragment>
                <Link href="/profile" passHref>
                  <button
                    onClick={handleClick}
                    className="lg:inline-flex  lg:w-auto w-full px-3 py-2 rounded text-indigo-600  items-center justify-center hover:bg-indigo-700 hover:text-white"
                  >
                    Profile
                  </button>
                </Link>
                <Link href="/auth/sign-out" passHref>
                  <button
                    onClick={handleClick}
                    className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-indigo-600  items-center justify-center hover:bg-indigo-700 hover:text-white"
                  >
                    Sign Out
                  </button>
                </Link>
              </Fragment>
            ) : (
              <Fragment>
                <Link href="/auth/sign-up" passHref>
                  <button
                    onClick={handleClick}
                    className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-indigo-600  items-center justify-center hover:bg-indigo-700 hover:text-white"
                  >
                    Sign Up
                  </button>
                </Link>
                <Link href="/auth/sign-in" passHref>
                  <button
                    onClick={handleClick}
                    className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-indigo-600  items-center justify-center hover:bg-indigo-700 hover:text-white"
                  >
                    Sign In
                  </button>
                </Link>
              </Fragment>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
export default Header;
