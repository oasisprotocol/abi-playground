import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import scaffoldConfig from "~~/scaffold.config";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const targetNetworks = getTargetNetworks();

export const wagmiConfig = getDefaultConfig({
  appName: "Oasis ABI Playground",
  projectId: scaffoldConfig.walletConnectProjectId,
  chains: targetNetworks,
  ssr: false, // If your dApp uses server side rendering (SSR)
  batch: {
    multicall: false,
  },
});
