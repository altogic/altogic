import ShowPictures from "@/components/ShowPictures";
import { useStore } from "@/store";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Restored() {
  const { originalImage } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!originalImage) router.push("/");
  }, []);

  return (
    <div className="flex flex-col gap-6 md:gap-12 h-full pb-20">
      <div className="flex flex-col items-center gap-10">
        {originalImage && <ShowPictures />}
      </div>
    </div>
  );
}
