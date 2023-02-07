import MyDropzone from "@/components/Dropzone";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const { originalImage } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (originalImage) router.push("/restored");
  }, [originalImage]);

  return (
    <div className="flex flex-col gap-6 md:gap-12 h-full pb-20">
      <div>
        <h1 className="animate-text text-center text-4xl md:text-6xl bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl font-black">
          Restore any photo
        </h1>
      </div>
      <div className="flex flex-col items-center gap-10">
        <MyDropzone className="w-full max-w-lg h-56" />
      </div>
    </div>
  );
}
