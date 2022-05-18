import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

function SidebarProfile() {
  return (
    <div className="w-full p-2 grid">
      <div>
        <ul className=" space-y-2 text-slate-300 my-2 ">
          {" "}
          <Link href="/profile">
            <li className="rounded-md px-4 py-2 cursor-pointer hover:bg-gray-700">
              <>
                <FontAwesomeIcon icon={faGear} className="mr-1" />
                Profile Settings
              </>
            </li>
          </Link>
        </ul>
      </div>
      <div className="w-full">
        <Link href="/auth/sign-out">
          <button className="border rounded border-red-900 p-2 text-red-700 font-semibold w-full hover:text-red-600">
            <FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out
          </button>
        </Link>
      </div>
    </div>
  );
}

export default SidebarProfile;
