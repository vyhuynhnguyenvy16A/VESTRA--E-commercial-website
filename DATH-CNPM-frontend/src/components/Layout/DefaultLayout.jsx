import React from "react";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
export default function DefaultLayout({ children }) {
  return (
    <div className="default-layout">
      <Header />

      <main style={{ padding: 0 }}>{children}</main>

      <Footer />
    </div>
  );
}
