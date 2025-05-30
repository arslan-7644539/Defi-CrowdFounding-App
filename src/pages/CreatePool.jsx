import { useState } from "react";
import { getForCreatePool } from "../lib/contract-funtion";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { toast } from "react-toastify";

const CreatePoolSection = () => {
  const { mutateAsync: sentTrx } = useSendTransaction();
  const userAccount = useActiveAccount();
  //   console.log("🚀 ~ LandingPage ~ userAccount:", userAccount);

  const [poolName, setPoolName] = useState();
  const [amount, setAmount] = useState();
  const [endTime, setEndTime] = useState();

  const handleCreatePool = async () => {
    if (!userAccount?.address) {
      toast.error("please connect your wallet", {
        position: "top-right",
      });
      setIsLoading(false); // Reset loading state
      return;
    }

    try {
      const res = await getForCreatePool(
        poolName,
        endTime, // Remove BigInt conversion here
        userAccount?.address
      );
      await sentTrx(res);
      console.log("🚀 ~ handleCreatePool ~ res:", res);
      if (res) {
        // setStatus(`Pool Created Successfully - ID: ${res}`);
        toast.success(`Pool created successfully! Pool ID: ${res}`, {
          position: "top-right",
        });
      }
    } catch (error) {
      console.log("🚀 ~ handleCreatePool ~ error:", error);
      toast.error("Error Creating Pool");
    }
  };

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
            Bring your friends together for the ultimate betting experience. Set
            your stakes, invite participants, and let the games begin.
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
                    Share your pool with friends and family. Track who's joined
                    and manage participants easily.
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
                    Get live updates on pool standings, payouts, and results as
                    events unfold.
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

export default CreatePoolSection;
