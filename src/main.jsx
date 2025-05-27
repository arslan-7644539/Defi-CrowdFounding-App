import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThirdwebProvider } from "thirdweb/react";
import { arbitrumSepolia } from "thirdweb/chains";
import { client } from "./lib/thirdweb.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThirdwebProvider
      activeChain={arbitrumSepolia}
      autoConnect={true}
      client={client}
    >
      <App />
    </ThirdwebProvider>
  </StrictMode>
);
