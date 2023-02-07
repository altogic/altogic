import type { NextApiRequest, NextApiResponse } from "next";
import altogic from "@/libs/altogic";
import { sleep } from "@/helpers";
import { Prediction } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  let outputImage: string | null = null;
  do {
    const { status, output } = await getPrediction(id);
    if (status === "succeeded") outputImage = output;
    else if (status === "failed") break;
    else await sleep(1000);
  } while (!outputImage);

  res.status(outputImage ? 200 : 500).json({
    outputImage,
    error: outputImage ? null : "Prediction failed, please try again",
  });
}

async function getPrediction(id: string) {
  const { data } = await altogic.endpoint.get("/prediction", { id });

  return data as Prediction;
}
