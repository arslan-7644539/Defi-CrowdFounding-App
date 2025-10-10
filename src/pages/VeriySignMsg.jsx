import { useState } from "react";
import { verifySignature } from "thirdweb/auth";
import { useActiveAccount } from "thirdweb/react";
import { client } from "../lib/thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export default function VerifySignMsg() {
    const [verifyType, setVerifyType] = useState(""); // "personal" or "typed"

    const account = useActiveAccount();
    const [message, setMessage] = useState(
        () =>
            `Verifying ownership for wallet ${account?.address || "0x..."} on ${new Date().toLocaleString()}`
    );
    const [amount, setAmount] = useState(100);
    const [signature, setSignature] = useState("");
    const [verifyResult, setVerifyResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePersonalSign = async () => {
        if (!account) return alert("Connect wallet first!");
        try {
            const sig = await account.signMessage({ message });
            setSignature(sig);
            setVerifyType("personal");
            setVerifyResult(null);
        } catch (error) {
            console.error("❌ Error signing message:", error);
        }
    };

    const handleTypedSign = async () => {
        if (!account) return alert("Connect wallet first!");
        try {
            const typedData = {
                domain: {
                    name: "SignatureDApp",
                    version: "1",
                    chainId: 421614,
                    verifyingContract: contractAddress,
                },
                types: {
                    Data: [
                        { name: "amount", type: "uint256" },
                        { name: "message", type: "string" },
                    ],
                },
                primaryType: "Data",
                message: { amount, message },
            };

            const sig = await account.signTypedData(typedData);
            console.log("🚀 ~ handleTypedSign ~ sig:", sig)
            setSignature(sig);
            setVerifyType("typed");
            setVerifyResult(null);
        } catch (error) {
            console.error("❌ Error signing typed data:", error);
        }
    };

    const handleVerify = async () => {
        if (!signature) return alert("Please sign a message first!");
        if (!account) return alert("Connect wallet first!");
        setLoading(true);

        try {
            if (verifyType === "personal") {
                // ✅ frontend verification
                const isValid = await verifySignature({
                    message,
                    signature,
                    address: account?.address,
                    client,
                    chain: arbitrumSepolia,
                });
                setVerifyResult(isValid);
            } else if (verifyType === "typed") {
                // ✅ contract verification (EIP-712)
                alert("⚙️ Typed data signature must be verified on-chain via a smart contract.");
                setVerifyResult(null);
            } else {
                alert("❓ Please select a signing method first!");
            }
        } catch (error) {
            console.log("🚀 ~ Verify Error:", error);
            setVerifyResult(false);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-tr from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center text-white p-6">
            <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-2xl border border-gray-700 rounded-2xl shadow-2xl p-8 space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Thirdweb Signature Verifier
                    </h2>
                    <p className="text-sm text-gray-400 mt-2">
                        Sign & verify messages on-chain securely ⚡
                    </p>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm mb-1">Message</label>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-2 text-white rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm mb-1">
                            Amount (for Typed Data)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-2 text-white rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handlePersonalSign}
                        className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 py-2 rounded-lg font-semibold shadow-md"
                    >
                        ✍️ Sign Personal Message
                    </button>
                    <button
                        onClick={handleTypedSign}
                        className="bg-green-600 hover:bg-green-700 transition-all duration-200 py-2 rounded-lg font-semibold shadow-md"
                    >
                        🧾 Sign Typed Data
                    </button>
                    <button
                        onClick={handleVerify}
                        disabled={loading}
                        className={`transition-all duration-200 py-2 rounded-lg font-semibold shadow-md ${loading
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-yellow-600 hover:bg-yellow-700"
                            }`}
                    >
                        {loading ? "⏳ Verifying..." : "🔍 Verify Signature"}
                    </button>
                </div>

                {/* Signature */}
                {signature && (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-xs text-gray-400 break-all">
                        <p className="font-medium text-gray-300 mb-2">Signature Output:</p>
                        {signature}
                    </div>
                )}

                {/* Result */}
                {verifyResult !== null && (
                    <div
                        className={`text-center p-3 rounded-lg font-semibold ${verifyResult
                            ? "bg-green-700/50 border border-green-500 text-green-300"
                            : "bg-red-700/50 border border-red-500 text-red-300"
                            }`}
                    >
                        {verifyResult ? "✅ Signature is VALID!" : "❌ Signature is INVALID!"}
                    </div>
                )}
            </div>
        </div>
    );
}
