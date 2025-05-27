import React, { useState } from "react";
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
import { prepareContractCall } from "thirdweb";
import LoadingOverlay from "./Loading";

const LandingPage = () => {
  const userAccount = useActiveAccount();
  console.log("🚀 ~ LandingPage ~ userAccount:", userAccount);
  const { mutateAsync: sentTrx } = useSendTransaction();

  const [walletAddress, setWalletAddress] = useState("");
  //   console.log("🚀 ~ LandingPage ~ walletAddress:", walletAddress)
  const [investmentAmount, setInvestmentAmount] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [poolName, setPoolName] = useState();
  const [amount, setAmount] = useState();
  const [endTime, setEndTime] = useState();
  const [poolId, setPoolId] = useState();
  console.log("🚀 ~ poolId:", poolId);

  //   ---------------------------------------------
  // pool creation - Alternative for thirdweb
  const getForCreatePool = async (name, endTime, borrower) => {
    // Convert datetime string to Unix timestamp (seconds since epoch)
    const endTimeDate = new Date(endTime);
    const currentTime = new Date();

    // Check if the selected time is in the future
    if (endTimeDate <= currentTime) {
      throw new Error("End time must be in the future");
    }

    const endTimeTimestamp = Math.floor(endTimeDate.getTime() / 1000);
    const currentTimestamp = Math.floor(currentTime.getTime() / 1000);

    console.log("End time timestamp:", endTimeTimestamp);
    console.log("Current timestamp:", currentTimestamp);
    console.log(
      "Time difference (seconds):",
      endTimeTimestamp - currentTimestamp
    );

    const transaction = prepareContractCall({
      contract,
      method: "function createPool(string, uint256, address)",
      params: [name, BigInt(endTimeTimestamp), borrower],
    });

    // Try different approaches based on your setup:

    // Option 1: If using thirdweb sendTransaction
    // return await sendTransaction({ transaction, account: userAccount });

    // Option 2: If sentTrx is a custom wrapper, just call it
    const result = await sentTrx(transaction);
    console.log("sentTrx result:", result);
    return result;

    // Option 3: If you need to send the transaction directly
    // return await transaction.send();
  };
  //   ---------------------------------------------
  const getForDeposit = async (poolId, amount) => {
    const transaction = prepareContractCall({
      contract,
      method: "function deposit(uint256, uint256)",
      params: [BigInt(poolId), BigInt(amount)],
    });
    const result = await sentTrx(transaction);
    console.log("🚀 ~ getForDeposit ~ result:", result);

    return result;
  };

  // -------------------------------------
  const TransferToBorrowerButton = async (poolId) => {
    const transaction = prepareContractCall({
      contract,
      method: "function transferToBorrower(uint256)",
      params: [BigInt(poolId)],
    });
    const result = await sentTrx(transaction);
    console.log("🚀 ~ TransferToBorrowerButton ~ result:", result);

    return result;
  };
  //   ---------------------------------------
  const PoolDetails = (poolId) => {
    const { data, isLoading } = useReadContract({
      contract,
      method:
        "function pools(uint256) view returns (string name, uint256 endTime, address borrower, uint256 totalDeposited, bool transferred)",
      params: [BigInt(poolId)],
    });

    return (
      <div>
        <p>Pool Name: {data?.name}</p>
        <p>
          End Time: {new Date(Number(data?.endTime) * 1000).toLocaleString()}
        </p>
        <p>Borrower: {data?.borrower}</p>
        <p>Total Deposited: {data?.totalDeposited?.toString()}</p>
        <p>Transferred: {data?.transferred ? "Yes" : "No"}</p>
      </div>
    );
  };
  //   ---------------------------------------
  const poolCount = () => {
    const { data, isLoading } = useReadContract({
      contract,
      method: "getPoolCount",
    });

    return <div>Total Pools: {data?.toString()}</div>;
  };

  //   ---------------------------------------
  const UserDeposit = (poolId, userAddress) => {
    const { data, isLoading } = useReadContract({
      contract,
      method: "function deposits(uint256, address) view returns (uint256)",
      params: [BigInt(poolId), userAddress],
    });
    return <div>User Deposit: {data?.toString()}</div>;
  };
  // --------------------------------------------

  const handleCreatePool = async () => {
    setIsLoading(true);
    setStatus("Creating Pool...");

    if (!userAccount?.address) {
      toast.error("please connect your wallet", {
        position: "top-right",
      });
      setIsLoading(false); // Reset loading state
      return;
    }

    try {
      // Don't convert endTime to BigInt here since it's already done in getForCreatePool
      const res = await getForCreatePool(
        poolName,
        endTime, // Remove BigInt conversion here
        userAccount?.address
      );

      console.log("🚀 ~ handleCreatePool ~ res:", res);
      console.log("🚀 ~ res type:", typeof res);
      console.log(
        "🚀 ~ res keys:",
        res ? Object.keys(res) : "res is null/undefined"
      );
      console.log(
        "🚀 ~ has wait method:",
        res && typeof res.wait === "function"
      );
      console.log("🚀 ~ has logs property:", res && res.logs);

      // More flexible handling of different response types
      let receipt;

      if (res && typeof res.wait === "function") {
        // res is a transaction object, wait for receipt
        console.log("Waiting for transaction receipt...");
        receipt = await res.wait();
      } else if (res && res.logs) {
        // res is already a receipt
        console.log("Using response as receipt directly");
        receipt = res;
      } else if (res && res.receipt) {
        // res might have a receipt property
        console.log("Using nested receipt property");
        receipt = res.receipt;
      } else if (res && res.transactionHash) {
        // res has transactionHash, we need to get the receipt manually
        console.log("Getting receipt for transaction:", res.transactionHash);
        setStatus("Waiting for transaction confirmation...");

        // If using ethers or web3, you might need to get receipt like this:
        // receipt = await provider.getTransactionReceipt(res.transactionHash);

        // For thirdweb, you might already have the receipt in the response
        if (res.receipt) {
          receipt = res.receipt;
        } else {
          // Assume the transaction was successful if we have a hash
          console.log("Transaction hash received:", res.transactionHash);
          setIsLoading(false);
          setStatus("Pool creation transaction sent");
          toast.success(`Transaction sent: ${res.transactionHash}`, {
            position: "top-right",
          });
          return;
        }
      } else {
        console.log("Unknown response format:", res);
        // For now, let's assume the transaction was successful but we can't parse events
        setIsLoading(false);
        setStatus("Pool creation completed (unable to verify)");
        toast.success("Pool creation transaction sent", {
          position: "top-right",
        });
        return;
      }

      console.log("🚀 ~ receipt:", receipt);

      // Check if receipt has logs
      if (!receipt || !receipt.logs) {
        console.log("No logs found in receipt");
        setIsLoading(false);
        setStatus("Pool created (no events to parse)");
        toast.success("Pool creation completed", {
          position: "top-right",
        });
        return;
      }

      const logs = receipt.logs;

      let poolCreated = false;
      let newPoolId = null;

      for (const log of logs) {
        try {
          console.log("Processing log:", log);

          // Try different ways to parse the log
          let parsed;
          if (contract.interface && contract.interface.parseLog) {
            // ethers v5/v6 style
            parsed = contract.interface.parseLog(log);
          } else if (contract.abi && contract.abi.parseLog) {
            // Some other library style
            parsed = contract.abi.parseLog(log);
          } else {
            // Manual parsing - look for PoolCreated event topic
            // You might need to adjust this based on your contract ABI
            console.log("Manual log parsing - topics:", log.topics);
            console.log("Manual log parsing - data:", log.data);

            // Skip manual parsing for now and continue to next log
            continue;
          }

          console.log("Parsed log:", parsed);

          if (parsed && parsed.name === "PoolCreated") {
            console.log("Found PoolCreated event:", parsed.args);
            newPoolId = parsed.args.poolId || parsed.args[0]; // poolId might be first argument

            if (newPoolId) {
              // Convert BigInt to string if necessary
              if (typeof newPoolId === "bigint") {
                newPoolId = newPoolId.toString();
              }
              setPoolId(newPoolId);
              poolCreated = true;
              console.log("Pool ID extracted:", newPoolId);
              break;
            }
          }
        } catch (e) {
          // Ignore logs that can't be parsed
          console.log("Could not parse log:", e);
        }
      }

      // Update state after the loop
      setIsLoading(false);
      if (poolCreated && newPoolId) {
        setStatus(`Pool Created Successfully - ID: ${newPoolId}`);
        toast.success(`Pool created successfully! Pool ID: ${newPoolId}`, {
          position: "top-right",
        });
      } else if (receipt.transactionHash) {
        setStatus("Pool creation completed");
        toast.success("Pool created successfully!", {
          position: "top-right",
        });
      } else {
        setStatus("Pool creation completed but no PoolCreated event found");
        toast.warning(
          "Pool creation completed but confirmation event not found",
          {
            position: "top-right",
          }
        );
      }
    } catch (error) {
      console.log("🚀 ~ handleCreatePool ~ error:", error);
      toast.error("Error Creating Pool");
      setIsLoading(false);
      setStatus("Error creating pool");
    }
  };

  //   ---------------------------------------

  const handleInvestment = async (e) => {
    debugger;
    setIsLoading(true);
    setStatus("Investing...");
    e.preventDefault();

    if (!userAccount?.address) {
      toast.error("please connect your wallet", {
        position: "top-right",
      });
      return;
    }
    try {
      const result = await getForDeposit(poolId, investmentAmount);
      console.log("🚀 ~ handleInvestment ~ result:", result);

      console.log(`Invested amount: ${investmentAmount}`);
      toast.success(`Invested amount: ${investmentAmount}`);
      setInvestmentAmount("");
      setIsLoading(false);
      setStatus("Investment successful");
    } catch (error) {
      console.log("🚀 ~ handleInvestment ~ error:", error);
      toast.error("Error Investing");
      setIsLoading(false);
      setStatus("Error Investing");
    }
  };

  const Header = () => {
    return (
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              CryptoInvest
            </div>
            <div className="hidden md:flex space-x-8">
              <a
                href="#home"
                className="text-white/80 hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="#createPool"
                className="text-white/80 hover:text-white transition-colors"
              >
                Create Pool
              </a>
              <a
                href="#features"
                className="text-white/80 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#invest"
                className="text-white/80 hover:text-white transition-colors"
              >
                Invest
              </a>
              <a
                href="#about"
                className="text-white/80 hover:text-white transition-colors"
              >
                About
              </a>
            </div>
          </div>
        </div>
      </nav>
    );
  };
  const CreatePoolSection = () => {
    return (
      <section
        id="createPool"
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              {/* <Sparkles className="w-4 h-4 text-purple-300" /> */}
              <span className="text-purple-200 text-sm font-medium">
                Create Your Pool
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Start a New
              <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Betting Pool
              </span>
            </h2>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Bring your friends together for the ultimate betting experience.
              Set your stakes, invite participants, and let the games begin.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Form Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="poolName"
                      className="block text-sm font-medium text-gray-200 mb-2"
                    >
                      Pool Name
                    </label>
                    <input
                      type="text"
                      id="poolName"
                      name="poolName"
                      value={poolName}
                      onChange={(e) => setPoolName(e.target.value)}
                      placeholder="Enter your pool name"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="buyIn"
                        className="block text-sm font-medium text-gray-200 mb-2"
                      >
                        {/* <DollarSign className="inline w-4 h-4 mr-1" /> */}
                        Buy-in Amount
                      </label>
                      <input
                        type="number"
                        id="buyIn"
                        name="buyIn"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="50"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="maxParticipants"
                        className="block text-sm font-medium text-gray-200 mb-2"
                      >
                        {/* <Users className="inline w-4 h-4 mr-1" /> */}
                        Max Players
                      </label>
                      <input
                        type="number"
                        id="maxParticipants"
                        name="maxParticipants"
                        disabled
                        // value={formData.maxParticipants}
                        // onChange={handleInputChange}
                        placeholder="10"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="deadline"
                      className="block text-sm font-medium text-gray-200 mb-2"
                    >
                      {/* <Calendar className="inline w-4 h-4 mr-1" /> */}
                      Entry Deadline
                    </label>
                    <input
                      type="datetime-local"
                      id="deadline"
                      name="deadline"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-200 mb-2"
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      disabled
                      id="description"
                      name="description"
                      // value={formData.description}
                      // onChange={handleInputChange}
                      placeholder="Tell participants about your pool..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreatePool}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {/* <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> */}
                    Create Pool
                  </span>
                </button>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500 rounded-lg p-3">
                    {/* <Users className="w-6 h-6 text-white" /> */}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Invite Friends
                    </h3>
                    <p className="text-gray-300">
                      Share your pool with friends and family. Track who's
                      joined and manage participants easily.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 rounded-lg p-3">
                    {/* <DollarSign className="w-6 h-6 text-white" /> */}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Set Your Stakes
                    </h3>
                    <p className="text-gray-300">
                      Choose buy-in amounts that work for your group. From
                      friendly wagers to serious stakes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
                <div className="flex items-start gap-4">
                  <div className="bg-pink-500 rounded-lg p-3">
                    {/* <Calendar className="w-6 h-6 text-white" /> */}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Real-time Updates
                    </h3>
                    <p className="text-gray-300">
                      Get live updates on pool standings, payouts, and results
                      as events unfold.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/30">
                <div className="flex items-center gap-3">
                  {/* <Info className="w-5 h-5 text-indigo-300" /> */}
                  <p className="text-sm text-indigo-200">
                    <strong>Pro Tip:</strong> Set clear rules and deadlines to
                    keep everyone engaged and ensure fair play.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  const HeroSection = () => {
    return (
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                INVEST IN THE FUTURE
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join the decentralized revolution and unlock the potential of
              blockchain technology with secure, transparent investments.
            </p>

            <div className="pt-8">
              <div className="inline-block p-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl">
                <div className="bg-black rounded-lg px-2 py-1">
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
      </section>
    );
  };
  const FeaturesSection = () => {
    return (
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of decentralized finance with cutting-edge
              technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Secure & Transparent",
                description:
                  "Built on blockchain technology ensuring complete transparency and security of your investments.",
                icon: "🔒",
              },
              {
                title: "Low Fees",
                description:
                  "Enjoy minimal transaction fees compared to traditional investment platforms.",
                icon: "💰",
              },
              {
                title: "24/7 Trading",
                description:
                  "Trade and invest anytime, anywhere with our always-available decentralized platform.",
                icon: "🌍",
              },
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  const InvestmentSection = () => {
    return (
      <section id="invest" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start Your Investment Journey
            </h2>
            <p className="text-xl text-gray-300">
              Enter your investment amount and join thousands of investors
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 sm:p-12">
            <form onSubmit={handleInvestment} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  Investment Amount (ETH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    placeholder="0.00"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="w-full px-6 py-4 text-xl bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                    ASH
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Estimated Gas Fee:</span>
                  <span>~0.003 ETH</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Platform Fee:</span>
                  <span>0.5%</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  !investmentAmount || parseFloat(investmentAmount) <= 0
                }
                className="w-full py-4 px-8 text-xl font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {investmentAmount && parseFloat(investmentAmount) > 0
                  ? `Invest ${investmentAmount} ETH`
                  : "Enter Amount to Invest"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                By investing, you agree to our Terms of Service and acknowledge
                the risks involved in cryptocurrency investments.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  const StaticInfo = () => {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "$2.5B+", label: "Total Value Locked" },
              { value: "50K+", label: "Active Investors" },
              { value: "99.9%", label: "Uptime" },
              { value: "0.5%", label: "Platform Fee" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  const About = () => {
    return (
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              About CryptoInvest
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Leading the revolution in decentralized finance with cutting-edge
              blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                We're dedicated to democratizing access to financial
                opportunities through blockchain technology. Our platform
                provides secure, transparent, and efficient investment solutions
                that empower individuals to take control of their financial
                future.
              </p>

              <h3 className="text-2xl font-bold text-white">Why Trust Us?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      Audited Smart Contracts
                    </h4>
                    <p className="text-gray-400">
                      All our contracts are thoroughly audited by leading
                      security firms
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      Regulatory Compliance
                    </h4>
                    <p className="text-gray-400">
                      Full compliance with international financial regulations
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">24/7 Support</h4>
                    <p className="text-gray-400">
                      Round-the-clock customer support for all your needs
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Our Journey
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    2021
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      Platform Launch
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Started with a vision to democratize DeFi
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    2022
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">$100M+ TVL</h4>
                    <p className="text-gray-400 text-sm">
                      Reached first major milestone
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    2023
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      Global Expansion
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Expanded to 50+ countries worldwide
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    2024
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">$2.5B+ TVL</h4>
                    <p className="text-gray-400 text-sm">
                      Leading DeFi platform with 50K+ users
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  const Footer = () => {
    return (
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
            CryptoInvest
          </div>
          <p className="text-gray-400 mb-6">
            The future of decentralized finance is here
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    );
  };

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

        {/* Investment Section */}
        <InvestmentSection />
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
