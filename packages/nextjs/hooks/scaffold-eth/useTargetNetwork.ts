import { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { useAbiNinjaState, useGlobalState } from "~~/services/store/store";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

/**
 * Retrieves the connected wallet's network from scaffold.config or defaults to the 0th network in the list if the wallet is not connected.
 */
export function useTargetNetwork(): { targetNetwork: ChainWithAttributes } {
  const { chain } = useAccount();
  const targetNetwork = useGlobalState(state => state.targetNetwork);
  const setTargetNetwork = useGlobalState(state => state.setTargetNetwork);
  const chains = useGlobalState(state => state.chains);
  const mainChainId = useAbiNinjaState(state => state.mainChainId);

  useEffect(() => {
    /*
    https://abi-playground.oasis.io/?contractAddress=0xEF15601B599F5C0696E38AB27f100c4075B36150&network=42262&methods=emitEvent1%2CemitEvent2%2CemitUnnamed
    links to current network in metamask instead of contract's network
    if metamask is on sapphire: links to sapphire instead of emerald
    but links correctly if on emerald testnet

    fixed upstream https://github.com/BuidlGuidl/abi.ninja/pull/164
    */
    const newSelectedNetwork =
      chains.find(network => network.id === mainChainId) || chains.find(network => network.id === chain?.id);
    if (newSelectedNetwork && newSelectedNetwork.id !== targetNetwork.id) {
      setTargetNetwork(newSelectedNetwork);
    }
  }, [chain?.id, setTargetNetwork, targetNetwork.id, chains, mainChainId]);

  return useMemo(
    () => ({
      targetNetwork: {
        ...targetNetwork,
        ...NETWORKS_EXTRA_DATA[targetNetwork.id],
      },
    }),
    [targetNetwork],
  );
}
