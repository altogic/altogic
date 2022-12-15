import { Tab } from "@headlessui/react";
import cs from "classnames";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { myRouter } from "../helpers/routes";
import useQuery from "../helpers/useQuery";
import { TodoStatusTypes } from "../helpers/utils";
import { todoActions } from "../redux/todo/todoSlice";
import AccessBadge from "./access-badge";
import AvatarList from "./avatar-list";

export default function Tabs({ settingsOnClick }) {
  const { workspaceSlug, listSlug } = useParams();

  const dispatch = useDispatch();
  const status = useQuery("status");
  const workspace = useSelector(({ workspace }) =>
    _.get(workspace.workspaceList, workspaceSlug)
  );
  const list = useSelector(({ list }) => _.get(list.lists, listSlug));
  const selectedStatus = useSelector(({ todo }) => todo.selectedStatus);

  const setSelectedStatus = (index) => {
    dispatch(
      todoActions.setSelectedStatus(
        index === 0 ? TodoStatusTypes.TODO : TodoStatusTypes.COMPLETED
      )
    );
  };

  return (
    <div className="relative pb-5 sm:pb-0 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="flex items-center text-lg leading-6 font-medium text-gray-900">
          {list && !list.isPublic && (
            <AvatarList
              users={workspace?.userProfilePictures}
              totalSize={workspace?.userSize}
            />
          )}
          <AccessBadge isPublic={list?.isPublic} />
        </h3>
      </div>
      <div className="mt-4">
        <Tab.Group
          onChange={setSelectedStatus}
          selectedIndex={selectedStatus === TodoStatusTypes.TODO ? 0 : 1}
        >
          <Tab.List className="flex items-center overflow-auto scrollbar-hide">
            <Link
              className="group inline-flex items-center justify-center w-full py-2.5 px-3 text-sm font-medium leading-5 "
              to={`${myRouter.HOME(workspaceSlug, listSlug)}`}
            >
              <Tab
                className={cs(
                  "group inline-flex items-center justify-center w-full py-2.5 px-3 text-sm font-medium leading-5 text-slate-700 border-b-2 border-gray-200 whitespace-nowrap",
                  "focus:outline-none",
                  status !== TodoStatusTypes.COMPLETED
                    ? "text-indigo-700 border-indigo-700"
                    : "text-indigo-400 hover:text-indigo-700 hover:border-indigo-700"
                )}
              >
                <span>Todo</span>
                {list?.todoSize ? (
                  <span
                    className={cs(
                      status !== TodoStatusTypes.COMPLETED
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-indigo-900",
                      "ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium"
                    )}
                  >
                    {list?.todoSize}
                  </span>
                ) : null}
              </Tab>
            </Link>
            <Link
              className="group inline-flex items-center justify-center w-full py-2.5 px-3 text-sm font-medium leading-5 "
              to={`${myRouter.HOME(workspaceSlug, listSlug)}?status=completed`}
            >
              <Tab
                className={cs(
                  "group inline-flex items-center justify-center w-full py-2.5 px-3 text-sm font-medium leading-5 text-slate-700 border-b-2 border-gray-200 whitespace-nowrap",
                  "focus:outline-none",
                  status === TodoStatusTypes.COMPLETED
                    ? "text-indigo-700 border-indigo-700"
                    : "text-indigo-400 hover:text-indigo-700 hover:border-indigo-700"
                )}
              >
                <span>Completed</span>
                {list?.completedSize ? (
                  <span
                    className={cs(
                      status === TodoStatusTypes.COMPLETED
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-indigo-900",
                      "ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium"
                    )}
                  >
                    {list?.completedSize}
                  </span>
                ) : null}
              </Tab>
            </Link>
          </Tab.List>
        </Tab.Group>
      </div>
    </div>
  );
}
