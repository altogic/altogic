import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { SidebarContext } from "../../context/sidebarContext";
import { UserContext } from "../../context/userContext";

function Header() {
  const sidebarContext = useContext(SidebarContext);
  const userContext = useContext(UserContext);

  const [active, setActive] = useState(false);

  return (
    <nav
      className="items-center flex flex-wrap px-6 bg-gray-800 border-b-2 border-slate-600 sticky top-0"
      onClick={() => {
        setActive(!active);
      }}
    >
      <Link href="/">
        <a className="inline-flex items-center p-2 mr-4 ">
          <Image src="/logo.png" alt="Logo" height={64} width={64}></Image>
        </a>
      </Link>
      <button
        className=" inline-flex p-2 mb-1 bg-indigo-700 rounded lg:hidden text-gray ml-auto text-white outline-none"
        onClick={sidebarContext.toggle}
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
      {userContext.user ? null : (
        <div
          className={`${
            active ? "" : "hidden"
          }   w-full lg:inline-flex lg:flex-grow lg:w-auto`}
        >
          <div className="lg:inline-flex text-center lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center flex flex-col lg:h-auto">
            <Link href="/auth/sign-in" passHref>
              <button
                onClick={() => {
                  console.log("x");
                }}
                className="lg:inline-flex lg:w-auto w-full px-2 py-0.5 mr-2 rounded text-white  items-center justify-center"
              >
                Sign In
              </button>
            </Link>
            <Link href="/auth/sign-up" passHref>
              <button
                onClick={() => {
                  console.log("x");
                }}
                className="lg:inline-flex lg:w-auto w-full px-2 py-0.5 rounded text-white  items-center justify-center bg-indigo-700 mb-1"
              >
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
export default Header;
