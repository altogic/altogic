import cs from "classnames";
import { MyRouter } from "../routes";
import _ from "lodash";
import ShowPixelTable from "./show-pixel-table";
import Link from "next/link";

export default function ArtCard({ pixel }) {
  return (
    <>
      <Link
        key={pixel._id}
        href={MyRouter.pixel(pixel.slug || pixel.pixelSlug)}
        className="group"
      >
        <div className="w-full overflow-hidden group-hover:opacity-75 flex justify-center items-center">
          <ShowPixelTable
            data={JSON.parse(pixel?.pallette || pixel?.pixelArt.pallette)}
            size={pixel?.size || pixel?.pixelArt.size}
          />
        </div>
        {!_.isNil(pixel.isOwner) && (
          <h3 className="mt-4 text-sm text-gray-700 text-center">
            {pixel.isOwner ? "Owner" : "Editor"}
          </h3>
        )}
        {pixel.owner && (
          <Link href={MyRouter.userArts(pixel.userSlug)}>
            <h3 className="mt-4 text-sm text-gray-700 text-center">
              {pixel.userName}
            </h3>
          </Link>
        )}
        <p
          className={cs([
            "text-lg font-medium text-gray-900 text-center",
            _.isNil(pixel.isOwner) ? "mt-1" : "mt-1",
          ])}
        >
          {pixel?.name || pixel.pixelName}
        </p>
      </Link>
    </>
  );
}
