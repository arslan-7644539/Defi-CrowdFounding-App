import { useState, useEffect } from "react";
import { verifySignature } from "thirdweb/auth";
import { useActiveAccount } from "thirdweb/react";
import { client } from "../lib/thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";
import { Shield, Check, X, Lock, FileSignature, Wallet, Copy, CheckCircle2, AlertCircle } from "lucide-react";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export default function VerifySignMsg() {
    const [verifyType, setVerifyType] = useState("");
    const account = useActiveAccount();
    const [message, setMessage] = useState(
        () =>
            `Verifying ownership for wallet ${account?.address || "0x..."} on ${new Date().toLocaleString()}`
    );
    const [amount, setAmount] = useState(100);
    const [signature, setSignature] = useState("");
    const [verifyResult, setVerifyResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [signatureHistory, setSignatureHistory] = useState([]);

    useEffect(() => {
        if (account?.address) {
            setMessage(`Verifying ownership for wallet ${account.address} on ${new Date().toLocaleString()}`);
        }
    }, [account?.address]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePersonalSign = async () => {
        if (!account) return alert("Connect wallet first!");
        setLoading(true);
        try {
            const sig = await account.signMessage({ message });
            setSignature(sig);
            setVerifyType("personal");
            setVerifyResult(null);
            
            setSignatureHistory(prev => [...prev, {
                type: "personal",
                message,
                signature: sig,
                timestamp: new Date().toLocaleTimeString(),
                address: account.address
            }].slice(-5));
        } catch (error) {
            console.error("❌ Error signing message:", error);
            alert("Failed to sign message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleTypedSign = async () => {
        if (!account) return alert("Connect wallet first!");
        setLoading(true);
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
                message: { amount: parseInt(amount), message },
            };

            const sig = await account.signTypedData(typedData);
            console.log("🚀 ~ handleTypedSign ~ sig:", sig);
            setSignature(sig);
            setVerifyType("typed");
            setVerifyResult(null);
            
            setSignatureHistory(prev => [...prev, {
                type: "typed",
                message,
                amount,
                signature: sig,
                timestamp: new Date().toLocaleTimeString(),
                address: account.address
            }].slice(-5));
        } catch (error) {
            console.error("❌ Error signing typed data:", error);
            alert("Failed to sign typed data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!signature) return alert("Please sign a message first!");
        if (!account) return alert("Connect wallet first!");
        setLoading(true);

        try {
            if (verifyType === "personal") {
                const isValid = await verifySignature({
                    message,
                    signature,
                    address: account?.address,
                    client,
                    chain: arbitrumSepolia,
                });
                setVerifyResult(isValid);
            } else if (verifyType === "typed") {
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

    const clearSignature = () => {
        setSignature("");
        setVerifyResult(null);
        setVerifyType("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center text-white p-4">
            <div className="max-w-5xl w-full grid lg:grid-cols-3 gap-6">
                {/* Main Panel */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 space-y-6">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-2">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                            Signature Verifier
                        </h2>
                        <p className="text-sm text-white/60">
                            Sign and verify messages securely with Thirdweb
                        </p>
                    </div>

                    {/* Wallet Status */}
                    {account && (
                        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-white/60">Connected Wallet</p>
                                    <p className="text-sm font-mono truncate text-green-300">{account.address}</p>
                                </div>
                                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                            </div>
                        </div>
                    )}

                    {!account && (
                        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-orange-400" />
                                <p className="text-sm text-orange-300">Please connect your wallet to continue</p>
                            </div>
                        </div>
                    )}

                    {/* Input Fields */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-white/90">
                                <FileSignature className="w-4 h-4" />
                                Message to Sign
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none"
                                placeholder="Enter your message here..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-white/90">
                                <Lock className="w-4 h-4" />
                                Amount (for EIP-712 Typed Data)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                                placeholder="100"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid sm:grid-cols-2 gap-3">
                        <button
                            onClick={handlePersonalSign}
                            disabled={!account || loading}
                            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <FileSignature className="w-5 h-5" />
                            Sign Personal Message
                        </button>
                        
                        <button
                            onClick={handleTypedSign}
                            disabled={!account || loading}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <Lock className="w-5 h-5" />
                            Sign EIP-712 Data
                        </button>
                    </div>

                    {signature && (
                        <div className="space-y-3">
                            <button
                                onClick={handleVerify}
                                disabled={loading}
                                className={`w-full transition-all duration-200 py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 ${
                                    loading
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transform hover:scale-[1.02] active:scale-[0.98]"
                                }`}
                            >
                                <Shield className="w-5 h-5" />
                                {loading ? "Verifying..." : "Verify Signature"}
                            </button>

                            <button
                                onClick={clearSignature}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 py-2 rounded-xl font-medium text-sm"
                            >
                                Clear Signature
                            </button>
                        </div>
                    )}

                    {/* Signature Output */}
                    {signature && (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${verifyType === 'personal' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                                    <p className="font-medium text-white/90">
                                        {verifyType === 'personal' ? 'Personal Message' : 'EIP-712 Typed Data'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(signature)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                    title="Copy signature"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-400" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-white/60" />
                                    )}
                                </button>
                            </div>
                            <div className="bg-black/30 rounded-lg p-3 text-xs text-white/70 font-mono break-all max-h-32 overflow-y-auto">
                                {signature}
                            </div>
                        </div>
                    )}

                    {/* Verification Result */}
                    {verifyResult !== null && (
                        <div
                            className={`p-4 rounded-xl font-semibold flex items-center gap-3 ${
                                verifyResult
                                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-300"
                                    : "bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 text-red-300"
                            }`}
                        >
                            {verifyResult ? (
                                <>
                                    <CheckCircle2 className="w-6 h-6" />
                                    <div>
                                        <p className="text-lg">Signature Valid!</p>
                                        <p className="text-xs text-white/60 font-normal">The signature has been successfully verified</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <X className="w-6 h-6" />
                                    <div>
                                        <p className="text-lg">Signature Invalid</p>
                                        <p className="text-xs text-white/60 font-normal">The signature could not be verified</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* History Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-white/90">Recent Signatures</h3>
                        
                        {signatureHistory.length === 0 ? (
                            <div className="text-center py-8 text-white/40 text-sm">
                                <Shield className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p>No signatures yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {signatureHistory.slice().reverse().map((sig, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2 hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                sig.type === 'personal' 
                                                    ? 'bg-blue-500/20 text-blue-300' 
                                                    : 'bg-green-500/20 text-green-300'
                                            }`}>
                                                {sig.type === 'personal' ? 'Personal' : 'EIP-712'}
                                            </span>
                                            <span className="text-xs text-white/40">{sig.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-white/60 truncate">{sig.message}</p>
                                        {sig.amount && (
                                            <p className="text-xs text-white/40">Amount: {sig.amount}</p>
                                        )}
                                        <p className="text-xs font-mono text-white/40 truncate">{sig.signature.slice(0, 20)}...</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Card */}
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-400/30 rounded-2xl p-6">
                        <h3 className="text-sm font-semibold mb-3 text-indigo-300">About Signatures</h3>
                        <div className="space-y-2 text-xs text-white/60">
                            <p><strong className="text-white/80">Personal Sign:</strong> Standard message signing for simple authentication</p>
                            <p><strong className="text-white/80">EIP-712:</strong> Structured data signing for smart contracts with typed data</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}