import React from "react";
// import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div>
      {/* <Header /> */}
      <main>{children}</main>
    </div>
  );
}
