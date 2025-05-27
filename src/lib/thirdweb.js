import { createThirdwebClient, getContract } from "thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";

const clientId = import.meta.env.VITE_CLIENT_ID;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});

export const contract = getContract({
  client,
  chain: arbitrumSepolia,
  address: import.meta.env.VITE_CONTRACT_ADDRESS,
});
