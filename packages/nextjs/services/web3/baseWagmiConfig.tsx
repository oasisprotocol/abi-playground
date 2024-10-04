import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import scaffoldConfig from "~~/scaffold.config";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const targetNetworks = getTargetNetworks();

export const enabledChains = targetNetworks

export const baseWagmiConfig = getDefaultConfig({
  appName: "Oasis ABI Playground",
  projectId: scaffoldConfig.walletConnectProjectId,
  // @ts-expect-error Chains type enforces non-empty array. But targetNetworks is not empty.
  chains: targetNetworks,
  ssr: false, // If your dApp uses server side rendering (SSR)
  batch: {
    multicall: false,
  },
});

baseWagmiConfig.connectors.forEach(c => {
  // Disable simulation - it always fails in Sapphire.
  // Upstream comment about being inverted https://github.com/wevm/wagmi/pull/3868/files#r1751172712
  // @ts-expect-error Ignore read-only warning
  c.supportsSimulation = true;
});
