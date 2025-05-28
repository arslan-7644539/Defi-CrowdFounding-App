import { prepareContractCall, readContract } from "thirdweb";
import { contract } from "./thirdweb";
// -------write function----------------------
export const getForCreatePool = async (name, endTime, borrower) => {
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

  const newPool = prepareContractCall({
    contract,
    method: "function createPool(string, uint256, address)",
    params: [name, BigInt(endTimeTimestamp), borrower],
  });

  return newPool;
};
// -----------------------------
export const getForDeposit = async (poolId, amount) => {
  const goForDeposit = prepareContractCall({
    contract,
    method: "function deposit(uint256, uint256)",
    params: [BigInt(poolId), BigInt(amount)],
  });
  return goForDeposit;
};

// ----------------------------

export const getForApproval = async (spenderAddress, amount) => {
  const approval = prepareContractCall({
    contract,
    method: "function approve(address spender, uint256 amount)",
    params: [spenderAddress, BigInt(amount)],
  });

  return approval;
};

// -----------------------------
export const TransferToBorrowerButton = async (poolId) => {
  const transferToBorrower = prepareContractCall({
    contract,
    method: "function transferToBorrower(uint256)",
    params: [BigInt(poolId)],
  });
  return transferToBorrower;
};

// -------read function----------------------
export const PoolDetails = async (poolId) => {
  const data = await readContract({
    contract,
    method:
      "function pools(uint256) view returns (string name, uint256 endTime, address borrower, uint256 totalDeposited, bool transferred)",
    params: [BigInt(poolId)],
  });
  return data;
};
// -----------------------------

export const poolCount = async () => {
  try {
    const data = await readContract({
      contract,
      method: "function getPoolCount() view returns (uint256)",
    });
    console.log("🚀 ~ poolCount ~ data:", data);
    return data?.toString();
  } catch (error) {
    console.error("Error reading contract:", error);
    throw error;
  }
};
// -----------------------------
export const UserDeposit = async (poolId, userAddress) => {
  const data = await readContract({
    contract,
    method: "function deposits(uint256, address) view returns (uint256)",
    params: [BigInt(poolId), userAddress],
  });
  return data?.toString();
};
// -----------------------------

export const getUserBalance = async (userAddress) => {
  const data = await readContract({
    contract,
    method: "function balanceOf(address) view returns (uint256)",
    params: [userAddress],
  });
  return data?.toString();
};
