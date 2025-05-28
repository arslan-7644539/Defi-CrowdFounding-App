import React from "react";
import LandingPage from "./components/LandingPage";
import LoadingOverlay from "./components/Loading";
import Router from "./routes";
import Layout from "./components/Loyout/Layout";
import { BrowserRouter } from "react-router-dom";
import FeaturesSection from "./pages/FeaturesSection";
import StaticInfo from "./pages/StaticInfo";
import { ConnectButton } from "thirdweb/react";
import { arbitrumSepolia } from "thirdweb/chains";
import { client } from "./lib/thirdweb";

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
          {/* Landing Page Section */}
          <section
            id="home"
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
          >
            <div className="w-full">
              <div className="text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-20">
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                      INVEST IN THE FUTURE
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Join the decentralized revolution and unlock the potential
                    of blockchain technology with secure, transparent
                    investments.
                  </p>

                  <div className="pt-8">
                    <div className="inline-block p-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                        <ConnectButton
                          chain={arbitrumSepolia}
                          client={client}
                          theme="dark"
                          connectButton={{
                            style: {
                              background: "transparent",
                              border: "none",
                              color: "white",
                              fontSize: "18px",
                              fontWeight: "bold",
                              padding: "12px 32px",
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section with consistent styling */}
          <section className="py-20">
            <FeaturesSection />
          </section>

          {/* Static Info Section with consistent styling */}
          <section className="py-20">
            <StaticInfo />
          </section>

          {/* Router with Layout for other pages */}
          <Layout>
            <Router />
          </Layout>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
