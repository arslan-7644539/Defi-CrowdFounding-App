import { useEffect, useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import {
  getForApproval,
  getForDeposit,
  getUserBalance,
} from "../lib/contract-funtion";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingOverlay from "../components/Loading";
import { client } from "../lib/thirdweb";
import { getWalletBalance } from "thirdweb/wallets";
import { toTokens, toUnits, toWei, waitForReceipt } from "thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";

const InvestmentSection = () => {
  const { mutateAsync: sentTrx } = useSendTransaction();
  const spenderAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  const { id } = useParams();
  // console.log("🚀 ~ InvestmentSection ~ id:", id);

  const userAccount = useActiveAccount();
  // console.log("🚀 ~ LandingPage ~ userAccount:", userAccount);

  const [investmentAmount, setInvestmentAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [balanceSymbol, setBalanceSymbol] = useState();

  useEffect(() => {
    const getBalance = async () => {
      try {
        if (!userAccount?.address) {
          toast.error("please connect your wallet", {
            position: "top-right",
          });
          // If no user account, set user balance to zer
          setUserBalance(0);
          return;
        }

        const balance = await getWalletBalance({
          address: userAccount?.address,
          client: client,
          chain: arbitrumSepolia,
        });

        console.log("Native Balance:", balance?.displayValue, balance?.symbol);

        // Format balance to show max 4 decimal places for better readability
        const formattedBalance = parseFloat(balance?.displayValue).toFixed(4);
        setUserBalance(formattedBalance);
        setBalanceSymbol(balance?.symbol)
      } catch (error) {
        console.error("Error fetching balance:", error);
        setUserBalance(0);
      }
    };

    getBalance();
  }, [userAccount?.address]);

  // debugger;
  const handleInvestment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("Investing...");

    console.log("🐱‍🏍checking user account is active or not");

    // check if the user is connected
    if (!userAccount?.address) {
      toast.error("please connect your wallet", {
        position: "top-right",
      });
      setIsLoading(false);
      return;
    }
    console.log("✔ user account is active");

    console.log("🐱‍🏍 checking investment amount is valid or not");

    // check if the investment amount is valid
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      toast.error("Invalid amount", {
        position: "top-right",
      });
      setIsLoading(false);
      return;
    }
    console.log("✔ investment amount is valid");

    try {
      // const amount = convertToWei(investmentAmount.toString());
      const amount = toUnits(investmentAmount, 18);
      console.log("🚀 ~ handleInvestment ~ amount:", amount.toString());

      console.log("🐱‍🏍 checking approval");
      const approvalChecking = await getForApproval(spenderAddress, amount);
      console.log(
        "🚀 ~ handleInvestment ~ approvalChecking:",
        approvalChecking
      );
      const approvalRequest = await sentTrx(approvalChecking);
      console.log("🚀 ~ handleInvestment ~ approvalRequest:", approvalRequest);

      // wait for 2 seconds
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus("Waiting for approval confirmation...");
      await waitForReceipt({
        client: client, // Your thirdweb client
        chain: arbitrumSepolia, // Your chain
        transactionHash: approvalRequest?.transactionHash,
      });

      console.log("✔ Approval confirmed");

      console.log("🐱‍🏍 getting for deposit");
      const result = await getForDeposit(id, amount);
      console.log("🐱‍🏍 sending transaction");
      const transactionResult = await sentTrx(result);
      console.log(
        "🚀 ~ handleInvestment ~ transactionResult:",
        transactionResult
      );
      console.log("🐱‍🏍 transaction sent");

      setStatus("Waiting for transaction confirmation...");
      await waitForReceipt({
        client: client,
        chain: arbitrumSepolia,
        transactionHash: transactionResult?.transactionHash,
      });

      // console.log("🚀 ~ handleInvestment ~ result:", result);
      console.log(" ✔ transaction sent");

      console.log(
        `Invested amount: ${investmentAmount} converted to ASH${amount}`
      );
      toast.success(
        `Investment successful: ${investmentAmount} converted to ASH${amount}`,
        {
          position: "top-right",
        }
      );
      setInvestmentAmount("");
      setIsLoading(false);
    } catch (error) {
      console.log("🚀 ~ handleInvestment ~ error:", error);
      if (error.message.includes("insufficient allowance")) {
        toast.error("Token approval failed", {
          position: "top-right",
        });
      } else if (error.message.includes("insufficient balance")) {
        toast.error("Insufficient balance", {
          position: "top-right",
        });
      } else {
        toast.error("Investment failed", {
          position: "top-right",
        });
      }
    } finally {
      setIsLoading(false);
      setStatus("Error Investing");
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} status={status} />
      <section id="invest" className="py-20 px-4 sm:px-6 lg:px-8">
        {/* <p className="text-white text-2xl font-bold">Pool ID: {id}</p> */}

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
                <label className=" text-white font-medium mb-3 text-lg flex justify-between">
                  <span> Investment Amount ({balanceSymbol})</span>
                  <span> Your Balance: {userBalance} {balanceSymbol}</span>
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

              {/* Pool info section with creator address */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Pool Creator:</span>
                  <span className="font-mono text-cyan-400 text-xs">
                    0x1234...5678
                  </span>
                </div>
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
                  ? `Invest ${investmentAmount} ASH`
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
    </>
  );
};

export default InvestmentSection;
