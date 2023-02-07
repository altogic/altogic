import { useStore } from "@/store";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ShowPictures() {
  const { originalImage, processedImage, processing, reset } = useStore();
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();

  function download() {
    if (!processedImage || downloading) return;
    setDownloading(true);
    fetch(processedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = "processed-image.png";
        link.click();
        URL.revokeObjectURL(url);
        setDownloading(false);
      });
  }

  function resetHandler() {
    reset();
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-10 items-center">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-center mb-2">
            Original Image
          </h2>
          <img
            className="rounded-2xl w-full h-auto max-h-[90vh] drop-shadow"
            src={originalImage!}
            alt="Original Image"
          />
        </div>
        <div className="w-full">
          <h2 className="text-2xl font-bold text-center mb-2">
            Processed Image
          </h2>
          {processing ? (
            <div className="flex justify-center items-center h-full w-full">
              <Loading />
            </div>
          ) : (
            <img
              className="rounded-2xl w-full h-auto max-h-[90vh] drop-shadow"
              src={processedImage!}
              alt="Processed Image"
            />
          )}
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        {processedImage && (
          <>
            <button
              className="border px-4 py-2 shadow rounded-lg bg-indigo-600 transition hover:bg-indigo-700 text-white"
              onClick={resetHandler}
            >
              Reset and try again
            </button>
            <button
              disabled={downloading}
              onClick={download}
              className="border px-4 py-2 shadow rounded-lg bg-green-600 transition hover:bg-green-700 text-white"
            >
              {downloading ? "Downloading..." : "Download Image"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
