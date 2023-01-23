import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url || "");
  const slug = searchParams.get("slug");

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const response = await fetch(
    `https://c1-europe.altogic.com/e:63ad6bca816efec7d19e9656/pixel?pixelSlug=${slug}`
  );
  const pixel = await response.json();
  if (!pixel?.picture) {
    return new Response("Something wrongs", { status: 400 });
  }

  return new ImageResponse(
    (
      <section
        style={{ backgroundColor: "#4c1d95" }}
        tw="flex flex-col items-center justify-center w-full h-full"
      >
        <div tw="flex my-2">
          <img width={600} height={600} src={pixel?.picture} alt="Logo" />
        </div>
      </section>
    ),
    {
      width: 1200,
      height: 627,
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
}
