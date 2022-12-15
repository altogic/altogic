import {
  LockClosedIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import cs from "classnames";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import functions from "../helpers/functions";
import { myRouter } from "../helpers/routes";
import useArraySelector from "../helpers/useArraySelector";
import { listActions } from "../redux/list/listSlice";
import Button from "./button";
import ListInlineForm from "./forms/list-inline-form";
import ListObserver from "./list-observer";

export default function NavigationList({ setSidebarOpen, setDeletedList }) {
  const { workspaceSlug, listSlug } = useParams();
  const dispatch = useDispatch();

  const [selectedList, setSelectedList] = useState(null);
  const lists = useArraySelector(({ list }) => list.lists);
  const user = useSelector(({ auth }) => auth.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!_.isEmpty(lists)) {
      getLists("", true);
    }
  }, [workspaceSlug]);

  useEffect(() => {
    return () => {
      dispatch(listActions.setInfo(null));
    };
  }, []);

  const getLists = (searchText, isNewSearch = false) => {
    setLoading(true);
    dispatch(
      listActions.getListsRequest({
        workspaceSlug,
        userId: user?._id,
        searchText: searchText || isNewSearch ? searchText.trim() : null,
        isNewSearch,
        onSuccess: () => setLoading(false),
        onFailure: () => setLoading(false),
      })
    );
  };

  return (
    <div>
      {loading ? (
        <div className="items-center flex flex-col mt-12">
          <ClipLoader color="#fff" loading={true} size={60} />
        </div>
      ) : (
        <ListObserver onEnd={getLists}>
          {_(lists)
            .orderBy(["createdAt"], ["desc"])
            .valueOf()
            .map((list) => (
              <div key={list?._id}>
                {selectedList?._id === list._id ? (
                  <ListInlineForm
                    selectedList={selectedList}
                    setSelectedList={setSelectedList}
                  />
                ) : (
                  <div
                    className={cs(
                      list?.slug === listSlug
                        ? "bg-indigo-800 text-white"
                        : "text-indigo-100 hover:bg-indigo-600",
                      "flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md"
                    )}
                  >
                    <Link
                      key={list?.slug}
                      to={myRouter.HOME(workspaceSlug, list?.slug)}
                      onClick={() => setSidebarOpen(false)}
                      className="grow"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          {list?.isPublic ? (
                            <UsersIcon
                              className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300"
                              aria-hidden="true"
                            />
                          ) : (
                            <LockClosedIcon
                              className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300"
                              aria-hidden="true"
                            />
                          )}
                          <span>{functions.convertToTitle(list?.name)}</span>
                        </div>
                      </div>
                    </Link>
                    <div
                      className={cs(
                        list?.slug === listSlug
                          ? "bg-indigo-800 text-white"
                          : "text-indigo-100 hover:bg-indigo-600",
                        "flex items-center px-2 py-2 text-sm font-medium rounded-md"
                      )}
                    >
                      <Button onClick={() => setSelectedList(list)}>
                        <PencilIcon
                          className="mr-3 flex-shrink-0 h-4 w-4 text-indigo-300"
                          aria-hidden="true"
                        />
                      </Button>
                      <Button onClick={() => setDeletedList(list)}>
                        <TrashIcon
                          className="lex-shrink-0 h-4 w-4 text-indigo-300"
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </ListObserver>
      )}
    </div>
  );
}
