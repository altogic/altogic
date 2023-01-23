import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MyRouter } from "../routes";
import NewPixelModal from "./modals/new-pixel-modal";
import useArraySelector from "../functions/hooks/useArraySelector";
import { pixelActions } from "../redux/pixel/pixelSlice";
import ListObserver from "./list-observer";
import _ from "lodash";
import ArtCard from "./art-card";
import { ClipLoader } from "react-spinners";
import Empty from "./empty";
import PixelTable from "./pixel-table";
import ShowPixelTable from "./show-pixel-table";
import Link from "next/link";

export default function MyArts() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userArts = useArraySelector(({ pixel }) => pixel.userArts);
  const [loading, setLoading] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const sortedUserArts = _(userArts)
    .orderBy(["pixelArt.updatedAt"], ["desc"])
    .valueOf();

  useEffect(() => {
    if (user) getUserArts("", true);
  }, [user]);

  useEffect(() => {
    return () => {
      dispatch(pixelActions.setUserArtsInfo(null));
    };
  }, []);

  const getUserArts = (searchText, isNewSearch = false) => {
    if (isNewSearch) {
      setLoading(true);
    }
    dispatch(
      pixelActions.getUserArtsRequest({
        userSlug: user?.slug,
        searchText: searchText || isNewSearch ? searchText.trim() : null,
        isNewSearch,
        onSuccess: () => {
          setLoading(false);
        },
        onFailure: () => {
          setLoading(false);
        },
      })
    );
  };

  return (
    <div>
      <div className="px-4 flex items-center justify-between sm:px-6 lg:px-0">
        <div className="flex items-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            My Arts
          </h2>
          <button onClick={() => setShowNewModal(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        <Link
          href={MyRouter.userArts(user?.slug)}
          className="hidden sm:block text-sm font-semibold text-violet-600 hover:text-violet-500"
        >
          See everything<span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>

      <div className="mt-8 relative">
        <div className="relative w-full pb-6 -mb-6 overflow-x-auto">
          <ul role="list" className="mx-4 inline-flex space-x-8 sm:mx-6">
            {_.isEmpty(sortedUserArts) ? (
              loading ? (
                <div className="items-center flex flex-col">
                  <ClipLoader color="violet" loading={loading} size={120} />
                </div>
              ) : (
                <Empty message="There are no arts" />
              )
            ) : (
              <ListObserver onEnd={getUserArts}>
                {_.map(sortedUserArts, (pixel) => (
                  <li key={pixel._id} className="w-64 inline-flex flex-col">
                    <div className="group relative">
                      <div className="w-full bg-gray-200 group-hover:opacity-75">
                        <ShowPixelTable
                          data={JSON.parse(pixel?.pixelArt.pallette)}
                          size={pixel?.pixelArt.size}
                        />
                      </div>
                      <div className="mt-6">
                        <p className="text-sm text-gray-500 text-center">
                          {pixel.isOwner ? "Owner" : "Editor"}
                        </p>
                        <h3 className="mt-1 font-semibold text-gray-900 text-center">
                          <Link href={MyRouter.pixel(pixel.pixelSlug)}>
                            <span className="absolute inset-0" />
                            {pixel.pixelName}
                          </Link>
                        </h3>
                      </div>
                    </div>
                  </li>
                ))}
              </ListObserver>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-12 flex px-4 sm:hidden">
        <Link
          href={MyRouter.userArts(user?.slug)}
          className="text-sm font-semibold text-violet-600 hover:text-violet-500"
        >
          See everything<span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>

      <NewPixelModal show={showNewModal} setShow={setShowNewModal} />
    </div>
  );
}
