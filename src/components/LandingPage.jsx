import React, { useEffect, useState } from "react";
import { arbitrumSepolia } from "thirdweb/chains";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { client, contract } from "../lib/thirdweb";
import { toast } from "react-toastify";
import { prepareContractCall, readContract } from "thirdweb";
import LoadingOverlay from "./Loading";
import {
  getForCreatePool,
  getForDeposit,
  poolCount,
  PoolDetails,
} from "../lib/contract-funtion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const userAccount = useActiveAccount();
  console.log("🚀 ~ LandingPage ~ userAccount:", userAccount);
  const { mutateAsync: sentTrx } = useSendTransaction();

  const [walletAddress, setWalletAddress] = useState("");
  //   console.log("🚀 ~ LandingPage ~ walletAddress:", walletAddress)
 
 
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

 



  //   ---------------------------------------

 

  //   ----------------------------------------
 
  // ----------------------------------------

  
 

 
 
 
 
  
 
  

  return (
    <>
      <LoadingOverlay isLoading={isLoading} status={status} />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation Bar */}
        <Header />
        {/* Hero Section homw */}
        <HeroSection />

        {/* Create Pool Section */}
        <CreatePoolSection />

        {/* Pools Section */}
        <PoolsSection />

        {/* Features Section */}
        <FeaturesSection />
        {/* Wallet Address Display */}
        {walletAddress && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 backdrop-blur-lg border border-green-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                Wallet Connected
              </h3>
              <p className="text-green-300 font-mono text-sm sm:text-base break-all">
                {walletAddress}
              </p>
            </div>
          </div>
        )}

       
        {/* Stats Section */}
        <StaticInfo />
        {/* About Section */}
        <About />
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
