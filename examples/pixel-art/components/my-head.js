import Head from "next/head";

export default function MyHead({ pixelName, pixelSlug }) {
  return (
    <Head>
      <title>
        Real-Time Pixel Art Creator with Altogic - Suitable for All Skill Levels
      </title>
      <meta
        name="og:title"
        content="Real-Time Pixel Art Creator with Altogic - Suitable for All Skill Levels"
      />
      <meta name="og:type" content="website" />
      <meta
        name="og:description"
        content="Real-time pixel art app allows you to create digital masterpieces in real-time, with a user-friendly interface. Experience the power of Altogic today!"
      />
      <meta name="og:image" content="/og-pixel.png" />
      <meta
        name="description"
        content="Real-time pixel art app allows you to create digital masterpieces in real-time, with a user-friendly interface. Experience the power of Altogic today!"
      />
      <meta name="twitter:site" content="@Altogic" />
      <meta name="twitter:creator" content="@Altogic" />
      <meta
        property="twitter:title"
        content="Real-Time Pixel Art Creator with Altogic - Suitable for All Skill Levels"
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
      <meta property="twitter:image" content="/og-pixel.png" />
    </Head>
  );
}
