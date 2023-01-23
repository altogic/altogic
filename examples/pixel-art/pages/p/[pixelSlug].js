import { CogIcon } from "@heroicons/react/outline";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import _ from "lodash";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import ColorPalette from "../../components/color-palette";
import MemberList from "../../components/member-list";
import AddTeamMembersModal from "../../components/modals/add-team-members-modal";
import LeaveTeamModal from "../../components/modals/leave-team-modal";
import MyHead from "../../components/my-head";
import Navbar from "../../components/navbar";
import PixelTable from "../../components/pixel-table";
import ShareButtons from "../../components/share-buttons";
import useArraySelector from "../../functions/hooks/useArraySelector";
import pixelService from "../../redux/pixel/pixelService";
import { pixelActions } from "../../redux/pixel/pixelSlice";
import { MyRouter } from "../../routes";

export default function Pixel({ pixel }) {
  const router = useRouter();
  const { pixelSlug } = router.query;
  const [selectedColor, setSelectedColor] = useState("#001219");
  const userState = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userState) {
      setUser(userState);
    }
  }, [userState]);

  const members = useArraySelector((state) => state.pixel.members);
  const member = _.find(members, (mem) => mem.userId === user?._id);
  const canDraw = member && ["owner", "editor"].includes(member?.role);
  const dispatch = useDispatch();
  const [leftPixel, setLeftPixel] = useState(null);
  const [addMembersShow, setAddMembersShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (pixelSlug) {
      dispatch(
        pixelActions.getPixelBySlugRequest({
          slug: pixelSlug,
          onSuccess: () => {
            setLoading(false);
          },
          onFailure: () => {
            router.push("/");
          },
        })
      );
    }
  }, [pixelSlug]);

  const download = () => {
    html2canvas(document.querySelector("#pixel-table")).then((canvas) => {
      canvas.toBlob(function (blob) {
        saveCanvasToDisk(blob, "png");
      });
    });
  };

  const saveCanvasToDisk = (blob, fileExtension) => {
    saveAs(blob, `${pixel?.name}.${fileExtension}`);
  };

  const beforeOnClick = () =>
    new Promise((resolve) => {
      setLoading(true);
      dispatch(
        pixelActions.replacePictureRequest({
          pixelSlug,
          onSuccess: () => {
            setLoading(false);
            resolve();
          },
          onFailure: () => {
            setLoading(false);
            resolve();
          },
        })
      );
    });

  const leavePixel = () => {
    setIsLoading(true);
    dispatch(
      pixelActions.deleteMemberRequest({
        pixelId: leftPixel?.pixelId,
        pixelSlug: leftPixel?.pixelSlug,
        memberId: user?._id,
        onSuccess: () => {
          setIsLoading(false);
          setLeftPixel(null);
        },
        onFailure: () => setIsLoading(false),
      })
    );
  };

  return (
    <div>
      <Head>
        <title>
          {`${pixel?.name} | Real-Time Pixel Art Creator with Altogic`}
        </title>
        <meta
          name="og:title"
          content={`${pixel?.name} | Real-Time Pixel Art Creator with Altogic`}
        />
        <meta name="og:type" content="website" />
        <meta
          name="og:description"
          content="Real-time pixel art app allows you to create digital masterpieces in real-time, with a user-friendly interface. Experience the power of Altogic today!"
        />
        <meta
          name="og:image"
          content={`https://pixel-art-next.vercel.app/api/og/${
            pixel?.slug
          }?date=${new Date().getTime()}`}
        />
        <meta
          name="description"
          content="Real-time pixel art app allows you to create digital masterpieces in real-time, with a user-friendly interface. Experience the power of Altogic today!"
        />
        <meta name="twitter:site" content="@Altogic" />
        <meta name="twitter:creator" content="@Altogic" />
        <meta
          property="twitter:title"
          content={`${pixel?.name} | Real-Time Pixel Art Creator with Altogic`}
        />
        <meta
          property="twitter:description"
          content="Real-time pixel art app allows you to create digital masterpieces in real-time, with a user-friendly interface. Experience the power of Altogic today!"
        />
        <meta
          property="twitter:url"
          content="https://pixel-art-next.vercel.app"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:image"
          content={`https://pixel-art-next.vercel.app/api/og/${
            pixel?.slug
          }?date=${new Date().getTime()}`}
        />
      </Head>
      <Navbar ssr />

      {loading ? (
        <div className="items-center flex flex-col mt-24">
          <ClipLoader color="violet" loading={loading} size={120} />
        </div>
      ) : (
        <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex items-center">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-center">
                {pixel?.name}
              </h2>
              {canDraw && (
                <div className="flex items-center ml-2 mt-1">
                  <button
                    type="button"
                    className="w-6 h-6 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                    onClick={() => setAddMembersShow(true)}
                  >
                    <span className="sr-only">Add Member</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                      />
                    </svg>
                  </button>
                  {member?.role === "owner" ? (
                    <Link href={MyRouter.pixelSettings(pixel?.slug)}>
                      <CogIcon
                        className="ml-2 w-6 h-6 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    member?.role === "editor" && (
                      <button
                        className="ml-2"
                        onClick={() =>
                          setLeftPixel({
                            pixelId: pixel?._id,
                            pixelSlug: pixel?.slug,
                          })
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-gray-400 hover:text-gray-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
            <ShareButtons
              className="mt-12"
              beforeOnClick={beforeOnClick}
              customLink={`/p/${pixelSlug}`}
            />
          </div>
          <div className="flex flex-col 2xl:flex-row 2xl:order-none">
            <div className="2xl:w-1/2 order-last 2xl:order-none">
              <MemberList />
            </div>

            <div className="grow order-first 2xl:order-none flex justify-center items-center w-full h-full">
              <PixelTable
                size={pixel?.size}
                drawColor={selectedColor}
                canDraw={canDraw}
              />
            </div>
            <div className="2xl:w-1/2 flex justify-center">
              <div className="py-3 md:py-6 flex flex-col items-center">
                <ColorPalette
                  canDraw={canDraw}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                />
                <button
                  type="button"
                  className="mt-12 inline-flex items-center px-24 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                  onClick={download}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {addMembersShow && (
        <AddTeamMembersModal
          show={addMembersShow}
          setShow={setAddMembersShow}
        />
      )}
      {leftPixel && (
        <LeaveTeamModal
          onCancel={() => setLeftPixel(null)}
          onLeave={leavePixel}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { pixelSlug } = context.params;

  const { data: pixel, errors } = await pixelService.getBySlug(pixelSlug);
  if (errors || !pixel) return { errorCode: errors?.status || 404 };

  return { props: { pixel } };
}
