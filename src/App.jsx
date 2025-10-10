import React from "react";
import Router from "./routes";
import Layout from "./components/Loyout/Layout";
import { BrowserRouter } from "react-router-dom";
import FeaturesSection from "./pages/FeaturesSection";
import StaticInfo from "./pages/StaticInfo";

const App = () => {
  return (
    <BrowserRouter>
      {/* Main Container with Consistent Background */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background Elements - Fixed for entire app */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10">
          {/* Router with Layout for all pages */}
          <Layout>
            <Router />
          </Layout>
          
          {/* Features Section with consistent styling */}
          {/* <section className="py-20">
            <FeaturesSection />
          </section> */}

          {/* Static Info Section with consistent styling */}
          {/* <section className="py-20">
            <StaticInfo />
          </section> */}
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
