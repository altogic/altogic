import _ from "lodash";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useArraySelector from "../functions/hooks/useArraySelector";
import convertToTitle from "../functions/convertToTitle";
import { realtimeActions } from "../redux/realtime/realtimeSlice";
import Avatar from "./avatar";
import { MyRouter } from "../routes";
import { useRouter } from "next/router";
import Link from "next/link";

export default function MemberList() {
  const router = useRouter();
  const { pixelSlug } = router.query;
  const dispatch = useDispatch();
  const members = useArraySelector(({ pixel }) => pixel.members);
  const sortedMembers = _(members)
    .uniqBy("userId")
    .orderBy(["name"], ["asc"])
    .valueOf();

  useEffect(() => {
    dispatch(
      realtimeActions.getMembersRequest({
        pixelSlug,
      })
    );
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto py-3 px-4 text-center sm:px-6 lg:px-8 lg:py-6">
        <div className="space-y-8 sm:space-y-12">
          <div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
            <p className="text-xl text-gray-500">
              Active Users ({_.size(members)})
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto grid grid-cols-3 xl:grid-cols-6 2xl:grid-cols-3 md:gap-x-6 gap-x-4 gap-y-8 lg:max-w-5xl lg:gap-x-8 lg:gap-y-12 "
          >
            {_.map(sortedMembers, (member) => (
              <li key={member?.id}>
                <div className="space-y-4">
                  {member?.slug ? (
                    <Link href={MyRouter.userArts(member?.slug)} dis>
                      <Avatar
                        size={14}
                        className="w-14 h-14"
                        anotherUser={{
                          name: member?.name || "Anonymous",
                          profilePicture: member?.profilePicture,
                        }}
                      />
                    </Link>
                  ) : (
                    <Avatar
                      size={14}
                      className="w-14 h-14"
                      anotherUser={{
                        name: member?.name || "Anonymous",
                        profilePicture: member?.profilePicture,
                      }}
                    />
                  )}

                  <div className="space-y-2">
                    <div className="text-xs font-medium lg:text-sm">
                      <h3>{member?.name || "Anonymous"}</h3>
                      <p className="text-violet-600">
                        {convertToTitle(member?.role) || "Viewer"}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
