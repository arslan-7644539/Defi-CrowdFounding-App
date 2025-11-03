"use client";

import React, { useState, useEffect } from "react";
// Stellar SDK imports
import {
  Server,
  TransactionBuilder,
  Operation,
  Networks,
  Asset,
  Transaction,
} from "stellar-sdk";
// Freighter wallet API import
import {
  isAllowed,
  getPublicKey,
  signTransaction,
} from "@stellar/freighter-api";

// --- Configuration (Apni details yahan daalein) ---
const STELLAR_NETWORK = "TESTNET";
const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new Server(HORIZON_URL);

// YEH SAB SE AHEM HAI: Aapka shared multisig account ka address
const MULTISIG_ACCOUNT_KEY = "G...YOUR_MULTISIG_ACCOUNT_ADDRESS";
// --- End Configuration ---

function StellarMultisigFlow() {
  const [userPublicKey, setUserPublicKey] = useState("");
  const [isFreighterReady, setIsFreighterReady] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successHash, setSuccessHash] = useState("");

  // Yeh state partially signed transaction ko store karegi
  const [partialTxXDR, setPartialTxXDR] = useState("");

  useEffect(() => {
    const checkFreighter = async () => {
      const allowed = await isAllowed();
      setIsFreighterReady(allowed);
      if (allowed) {
        try {
          const pubKey = await getPublicKey();
          setUserPublicKey(pubKey);
        } catch (e) {
          // User ne abhi access nahi diya
        }
      }
    };
    checkFreighter();
  }, []);

  // --- Step 1: Transaction Banata aur Pehla Sign Karta (Signer A) ---
  const createAndSignTx = async () => {
    if (!userPublicKey) {
      setError("Pehle Freighter wallet connect karein.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessHash("");
    setPartialTxXDR("");

    try {
      // 1. Multisig account ka data load karein (sequence ke liye)
      const account = await server.loadAccount(MULTISIG_ACCOUNT_KEY);

      // 2. Transaction banayein
      const tx = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: Networks[STELLAR_NETWORK],
      })
        .addOperation(
          Operation.payment({
            destination: "GB...SOME_DESTINATION_ADDRESS", // Jis ko bhejna hai
            asset: Asset.native(), // XLM
            amount: "1", // 1 XLM
          })
        )
        .setTimeout(300) // 5 min timeout
        .build();

      const txXdr = tx.toXDR();
      console.log("Transaction XDR (Unsigned):", txXdr);

      // 3. Freighter se sign karwayein (Yeh Signer A ka signature hai)
      const signedXdr = await signTransaction(txXdr, {
        network: STELLAR_NETWORK,
      });

      console.log("Partially Signed XDR (Signer A):", signedXdr);
      setPartialTxXDR(signedXdr); // XDR ko state mein save karein
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2 & 3: Doosra Sign Karta aur Submit Karta (Signer B) ---
  const addSignatureAndSubmit = async () => {
    if (!userPublicKey) {
      setError("Signer B, apna wallet connect karein.");
      return;
    }
    if (!partialTxXDR) {
      setError("Pehle Step 1 (Create Tx) mukammal karein.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessHash("");

    try {
      // 1. Freighter se doosra signature lein
      // User ko wohi XDR dobara sign karne ko dein
      const fullySignedXdr = await signTransaction(partialTxXDR, {
        network: STELLAR_NETWORK,
      });

      console.log("Fully Signed XDR (Signer A + B):", fullySignedXdr);

      // (Optional check: Dekhein ke signatures add huwe hain)
      const tx = new Transaction(fullySignedXdr, Networks[STELLAR_NETWORK]);
      console.log("Signatures found:", tx.signatures.length);

      // 2. Network par submit karein
      const txResult = await server.submitTransaction(fullySignedXdr);
      setSuccessHash(txResult.hash);
      console.log("🎉 Transaction Submitted!", txResult.hash);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isFreighterReady) {
    return <p>Please install Freighter wallet.</p>;
  }

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd" }}>
      <h2>Stellar Multisig Flow (2-of-2)</h2>
      {userPublicKey ? (
        <p>
          <strong>Aapka Wallet (Signer):</strong> {userPublicKey.substring(0, 10)}...
        </p>
      ) : (
        <button onClick={() => getPublicKey().then(setUserPublicKey)}>
          Connect Freighter
        </button>
      )}

      <hr />

      {/* --- BUTTONS --- */}
      <div>
        <h4>Step 1: Signer A (Initiator)</h4>
        <button onClick={createAndSignTx} disabled={loading || !userPublicKey}>
          1. Create & Sign Tx (Signer A)
        </button>
      </div>

      {partialTxXDR && (
        <textarea
          readOnly
          value={partialTxXDR}
          style={{ width: "100%", height: "60px", margin: "10px 0" }}
        />
      )}

      <div style={{ marginTop: "20px" }}>
        <h4>Step 2: Signer B (Finalizer)</h4>
        <button
          onClick={addSignatureAndSubmit}
          disabled={loading || !userPublicKey || !partialTxXDR}
        >
          2. Add Signature & Submit (Signer B)
        </button>
      </div>

      {/* --- Results --- */}
      {loading && <p style={{ color: "blue" }}>Loading... (Wallet check karein)</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {successHash && (
        <p style={{ color: "green", wordBreak: "break-all" }}>
          Success! Hash: {successHash}
        </p>
      )}
    </div>
  );
}

export default StellarMultisigFlow;