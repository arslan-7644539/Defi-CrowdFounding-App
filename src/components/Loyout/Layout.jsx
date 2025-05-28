import React from "react";
import Footer from "../../pages/Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="pt-16">
        {" "}
        {/* Add padding-top to account for fixed header */}
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
