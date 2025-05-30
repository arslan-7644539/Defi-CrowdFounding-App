import { useNavigate } from "react-router-dom";
import {
  getParticipantCount,
  poolCount,
  PoolDetails,
  TransferToBorrowerButton,
} from "../lib/contract-funtion";
import { useEffect, useState } from "react";
import { toTokens } from "thirdweb";
import { toast } from "react-toastify";
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { contract } from "../lib/thirdweb";
import LoadingOverlay from "../components/Loading";

const ShowPoolSection = () => {
  const { mutateAsync: sentTrx } = useSendTransaction();
  // fetch owner address

  const { data: ownerAddress } = useReadContract({
    contract: contract,
    method: "function owner() view returns (address)",
  });
  const userAddress = useActiveAccount();

  console.log(
    `🚀 ~ ShowPoolSection ~ ownerAddress === userAddress :✔`,
    ownerAddress === userAddress?.address
  );

  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    const getOwnerAddress = async () => {
      if (ownerAddress === userAddress?.address) {
        setIsOwner(true);
      }
    };
    getOwnerAddress();
  }, [ownerAddress, userAddress?.address]);
  // -------------------------------------------------

  const [pool, setPool] = useState([]);
  // console.log("🚀 ~ ShowPoolSection ~ pool:", pool);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  const fetchPoolDetails = async () => {
    try {
      const poolCounts = await poolCount();

      const poolPromises = [];

      for (let i = 0; i < poolCounts; i++) {
        poolPromises?.push(
          (async () => {
            const counts = await getParticipantCount(i);
            const details = await PoolDetails(i);
            return { ...details, participantCount: counts };
          })()
        );
      }

      const combinedData = await Promise.all(poolPromises);
      // console.log("🚀 ~ fetchPoolDetails ~ combinedData:", combinedData);

      const headers = [
        "poolTitle",
        "endTime",
        "borrower",
        "totalDeposited",
        "transferred",
      ];

      const mappedData = combinedData?.map((item) => {
        const mappedItem = {};

        headers.forEach((key, index) => {
          const value = item[index];
          mappedItem[key] = typeof value === "bigint" ? Number(value) : value;
        });

        // participantCount  separately added
        mappedItem.participantCount =
          typeof item.participantCount === "bigint"
            ? Number(item.participantCount)
            : item.participantCount;

        return mappedItem;
      });

      // console.log("🚀 ~ fetchPoolDetails ~ mappedData:", mappedData);

      setPool(mappedData);

      // console.log("🚀 ~ fetchPoolDetails ~ poolCount:", poolDetails);
    } catch (error) {
      console.error("🚀 ~ fetchPoolDetails ~ error:", error);
      toast.error("Error fetching pool count", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchPoolDetails();
  }, []);

  const formatDate = (timestamp) => {
    // Convert BigInt to Number
    const time = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
    return new Date(time * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300";
      case "Completed":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300";
      case "Expired":
        return "from-red-500/20 to-pink-500/20 border-red-500/30 text-red-300";
      default:
        return "from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-300";
    }
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    // Convert BigInt to Number if necessary
    const end = new Date(Number(endTime) * 1000);
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const goForInvest = async (id) => {
    navigate(`/invest/${id}`);
  };

  // amount sent to borrower
  const handleAmountToBorrower = async (id) => {
    setIsLoading(true);
    setStatus("Sending amount to borrower");
    if (!isOwner) {
      toast.error("You are not the owner of this pool", {
        position: "top-right",
      });
      setIsLoading(false);
      return;
    }
    try {
      debugger;
      console.log("🎢amount sending to borrower");

      const transferToBorrower = await TransferToBorrowerButton(id);
      await sentTrx(transferToBorrower);

      console.log(
        "🚀 ~ handleAmountToBorrower ~ transferToBorrower:",
        transferToBorrower
      );

      console.log("🎁amount sent to borrower");
      toast.success("🎁 Amount sent to borrower", {
        position: "top-right",
      });
      setIsLoading(false);
    } catch (error) {
      toast.error("Transfer failed", { position: "top-right" });
      console.log("🚀 ~ handleAmountToBorrower ~ error:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} status={status} />
      <section
        id="pools"
        className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
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

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-purple-200 text-sm font-medium">
                Active Pools
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Discover
              <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Investment Pools
              </span>
            </h2>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join exciting betting pools created by the community. Find your
              favorite events and start winning.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {["All", "Active", "Completed", "My Pools"].map((filter) => (
              <button
                key={filter}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  filter === "All"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">
                {pool?.length}
              </div>
              <div className="text-gray-300 text-sm">Total Pools</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {/* {pool?.filter((p) => p.status === "Active").length} */}
                {/* {pool?.map((p) => p.filter((pool, index) => index === 3)).length} */}
              </div>
              <div className="text-gray-300 text-sm">Active Pools</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-2">$54</div>
              <div className="text-gray-300 text-sm">Total ETH Locked</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 text-center">
              <div className="text-2xl font-bold text-pink-400 mb-2">54%</div>
              <div className="text-gray-300 text-sm">Total Participants</div>
            </div>
          </div>

          {/* Pools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pool?.map((item, index) => {
              const depositedAmount = toTokens(item?.totalDeposited, 18);
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group"
                >
                  {/* Pool Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {item?.poolTitle || "No Name"}
                      </h3>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(
                          item?.status
                        )}`}
                      >
                        <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></div>
                        {item?.status}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        #{index}
                      </div>
                      <div className="text-sm text-gray-400">Pool ID</div>
                    </div>
                  </div>

                  {/* Pool Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                      <div className="text-2xl font-bold text-white mb-1">
                        {depositedAmount || 0}
                      </div>
                      <div className="text-purple-300 text-sm">
                        ASH Deposited
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
                      <div className="text-2xl font-bold text-white mb-1">
                        {item?.participantCount || 0} / 10
                      </div>
                      <div className="text-blue-300 text-sm">Participants</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Participation</span>
                      <span>
                        {Math.round(
                          // (item?.participantCount / item?.maxParticipants) * 100
                          (item?.participantCount / 10) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            // (item?.participantCount / item?.maxParticipants) * 100
                            (item?.participantCount / 10) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Pool Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Creator:</span>
                      <span className="text-white font-mono text-sm">
                        {formatAddress(item?.borrower)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">End Time:</span>
                      <span className="text-white text-sm">
                        {formatDate(item?.endTime)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Time Left:</span>
                      <span
                        className={`font-medium text-sm ${
                          getTimeRemaining(item?.endTime) === "Expired"
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {getTimeRemaining(item?.endTime)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Transferred:</span>
                      <span
                        className={`font-medium text-sm ${
                          item?.transferred
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {item?.transferred ? "Yes" : "Pending"}
                      </span>
                    </div>
                    {/* amount sent to borrower */}
                    {isOwner ? (
                      <button
                        disabled={!isOwner || isLoading}
                        class={` ${
                          isOwner && !isLoading
                            ? "bg-blue-600 hover:bg-blue-700 "
                            : "bg-gray-600 cursor-not-allowed"
                        }  text-white font-semibold py-2 px-4 rounded shadow transition duration-200`}
                        onClick={() => handleAmountToBorrower(index)}
                      >
                        {isLoading ? "Transferring..." : "Transfer Amount"}
                      </button>
                    ) : (
                      ""
                    )}

                    {/* ---------------------- */}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => goForInvest(index)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
                    >
                      Join Pool
                    </button>
                    <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/20 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-transparent">
              Load More Pools
            </button>
          </div>

          {/* Empty State (if no pools) */}
          {pool?.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🎲</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No Pools Found
              </h3>
              <p className="text-gray-300 mb-8">
                Be the first to create a betting pool!
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                Create First Pool
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ShowPoolSection;
