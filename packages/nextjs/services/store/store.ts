import { wagmiConnectors } from "../web3/wagmiConnectors";
import { Abi, Address, Chain } from "viem";
import { Config, createConfig } from "wagmi";
import create from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { baseWagmiConfig, enabledChains } from "~~/services/web3/baseWagmiConfig";
import { ChainWithAttributes, defaultSelection } from "~~/utils/scaffold-eth";

const createWagmiClient = undefined as any;

type GlobalState = {
  nativeCurrencyPrice: number;
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
  wagmiConfig: Config;
  setWagmiConfig: (newWagmiConfig: Config) => void;
  chains: Chain[];
  addChain: (newChain: Chain) => void;
  removeChain: (chainId: number) => void;
};

type AbiNinjaState = {
  mainChainId: number;
  setMainChainId: (newMainChainId: number) => void;
  contractAbi: Abi;
  setContractAbi: (newAbi: Abi) => void;
  abiContractAddress: Address | "";
  setAbiContractAddress: (newAbiContractAddress: Address | "") => void;
  implementationAddress: Address | "";
  setImplementationAddress: (newImplementationAddress: Address | "") => void;
};

const defaultTargetNetwork = scaffoldConfig.targetNetworks.find(({ id }) => id === defaultSelection);
if (!defaultTargetNetwork) throw new Error("Can not find defaultSelection");

export const useGlobalState = create<GlobalState>(set => ({
  nativeCurrencyPrice: 0,
  setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
  targetNetwork: defaultTargetNetwork,
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
  wagmiConfig: baseWagmiConfig,
  setWagmiConfig: (newConfig: Config): void => set(() => ({ wagmiConfig: newConfig })),
  chains: enabledChains as Chain[],
  addChain: (newChain: Chain): void =>
    set(state => {
      throw new Error("addChain unsupported");
      if (!state.chains.some(chain => chain.id === newChain.id)) {
        const updatedChains = [...state.chains, newChain];
        const updatedWagmiConfig = createConfig({
          chains: updatedChains as [Chain, ...Chain[]],
          connectors: wagmiConnectors,
          ssr: true,
          client: createWagmiClient,
        });
        return { chains: updatedChains, wagmiConfig: updatedWagmiConfig };
      }
      return state;
    }),
  removeChain: (chainId: number): void =>
    set(state => {
      throw new Error("removeChain unsupported");
      const updatedChains = state.chains.filter(chain => chain.id !== chainId);
      const updatedWagmiConfig = createConfig({
        chains: updatedChains as [Chain, ...Chain[]],
        connectors: wagmiConnectors,
        ssr: true,
        client: createWagmiClient,
      });
      return { chains: updatedChains, wagmiConfig: updatedWagmiConfig };
    }),
}));

export const useAbiNinjaState = create<AbiNinjaState>(set => ({
  mainChainId: defaultSelection,
  setMainChainId: (newValue: number): void => set(() => ({ mainChainId: newValue })),
  contractAbi: [],
  setContractAbi: (newAbi: Abi): void => set({ contractAbi: newAbi }),
  abiContractAddress: "",
  setAbiContractAddress: (newAddress: Address | ""): void => set({ abiContractAddress: newAddress }),
  implementationAddress: "",
  setImplementationAddress: (newAddress: Address | ""): void => set({ implementationAddress: newAddress }),
}));
