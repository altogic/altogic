import Image from "next/image";
import React from "react";

function AltogicBadge() {
  return (
    <a
      href="https://www.altogic.com"
      className="mr-4 mb-4 bg-[#1976d2] fixed bottom-0 right-0 text-black text-xs font-light inline-flex items-center justify-center px-2 py-2 rounded-md shadow-xl hover:shadow-3xl cursor-pointer"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="/altogicLogo.svg"
        height={20}
        width={20}
        alt="Altogic Logo"
      ></Image>
      <span className="text-white">Powered by Altogic</span>
    </a>
  );
}

export default AltogicBadge;
