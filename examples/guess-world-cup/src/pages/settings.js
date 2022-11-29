import { GlobeAltIcon, UserCircleIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Container from "../components/container";
import Navbar from "../components/navbar";
import functions from "../helpers/functions";
import useQuery from "../helpers/useQuery";
import SettingsLeague from "./settings-league";
import SettingsProfile from "./settings-profile";

export default function Settings(props) {
  const tab = useQuery("tab");

  const user = useSelector((state) => state.auth.user);
  const userLeagues = _.filter(user?.leagues, "isOwner");
  const [isProfile, setIsProfile] = useState(true);

  useEffect(() => {
    setIsProfile(_.isNil(tab));
  }, [tab]);

  return (
    <>
      <Navbar />
      <Container className="my-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              <Link
                to="/settings"
                className={classNames(
                  _.isNil(tab)
                    ? "bg-gray-50 text-pink-700 hover:text-pink-700 hover:bg-white"
                    : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
                  "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                )}
                aria-current={_.isNil(tab) ? "page" : undefined}
              >
                <UserCircleIcon
                  className={classNames(
                    _.isNil(tab)
                      ? "text-pink-500 group-hover:text-pink-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">Account</span>
              </Link>
              {_.map(userLeagues, (league) => (
                <Link
                  key={league.slug}
                  to={`/settings?tab=${league.slug}`}
                  className={classNames(
                    tab === league.slug
                      ? "bg-gray-50 text-pink-700 hover:text-pink-700 hover:bg-white"
                      : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
                    "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                  )}
                  aria-current={tab === league.slug ? "page" : undefined}
                >
                  <GlobeAltIcon
                    className={classNames(
                      tab === league.slug
                        ? "text-pink-500 group-hover:text-pink-500"
                        : "text-gray-400 group-hover:text-gray-500",
                      "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">
                    {functions.convertToTitle(league.slug)}
                  </span>
                </Link>
              ))}
            </nav>
          </aside>
          {isProfile ? <SettingsProfile /> : <SettingsLeague />}
        </div>
      </Container>
    </>
  );
}
