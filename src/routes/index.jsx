import React from "react";
import { useRoutes } from "react-router-dom";
import InvestmentSection from "../pages/InvestmentSection";
import Home from "../pages/Home";
import About from "../pages/About";
import CreatePoolSection from "../pages/CreatePool";
import FeaturesSection from "../pages/FeaturesSection";
import Footer from "../pages/Footer";
import ShowPoolSection from "../pages/ShowPoolSection";

const Router = () => {
  return useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/about",
      element: <About />,
    },

    {
      path: "/create-pool",
      element: <CreatePoolSection />,
    },
    {
      path: "/pools",
      element: <ShowPoolSection />,
    },
    {
      path: "/invest/:id",
      element: <InvestmentSection />,
    },
    // {
    //   path: "/features",
    //   element: <FeaturesSection />,
    // },
    {
      path: "/footer",
      element: <Footer />,
    },
  ]);
};

export default Router;
