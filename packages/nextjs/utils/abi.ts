import * as viemNextVersionChains from "../viemNextVersionChains";
import { NETWORKS_EXTRA_DATA, getTargetNetworks } from "./scaffold-eth";

export const fetchContractABIFromAnyABI = async (verifiedContractAddress: string, chainId: number) => {
  const paratimeApi = {
    [viemNextVersionChains.sapphire.id]: `https://nexus.oasis.io/v1/sapphire/accounts/${verifiedContractAddress}`,
    [viemNextVersionChains.sapphireTestnet
      .id]: `https://testnet.nexus.oasis.io/v1/sapphire/accounts/${verifiedContractAddress}`,
    [viemNextVersionChains.emerald.id]: `https://nexus.oasis.io/v1/emerald/accounts/${verifiedContractAddress}`,
    [viemNextVersionChains.emeraldTestnet
      .id]: `https://testnet.nexus.oasis.io/v1/sapphire/accounts/${verifiedContractAddress}`,
    [viemNextVersionChains.sapphireLocalnet
      .id]: `http://localhost:8547/v1/sapphire/accounts/${verifiedContractAddress}`,
  };

  if (!paratimeApi[chainId as keyof typeof paratimeApi])
    throw new Error(`ChainId ${chainId} not found in supported networks`);

  const url = paratimeApi[chainId as keyof typeof paratimeApi];

  const response = await fetch(url);
  const data = await response.json();
  if (data.evm_contract?.verification?.compilation_metadata?.output?.abi) {
    return {
      abi: data.evm_contract?.verification?.compilation_metadata?.output?.abi,
      name: Object.values(data.evm_contract?.verification?.compilation_metadata?.settings?.compilationTarget)[0],
    };
  } else {
    console.error("Could not fetch ABI from Nexus:", data.error);
    return { abi: undefined, name: undefined };
  }
};

export const fetchContractABIFromEtherscan = async (verifiedContractAddress: string, chainId: number) => {
  const chain = NETWORKS_EXTRA_DATA[chainId];

  if (!chain || !chain.etherscanEndpoint)
    throw new Error(`ChainId ${chainId} not found in supported etherscan networks`);

  const apiKey = chain.etherscanApiKey ?? "";
  const apiKeyUrlParam = apiKey.trim().length > 0 ? `&apikey=${apiKey}` : "";
  const url = `${chain.etherscanEndpoint}/api?module=contract&action=getabi&address=${verifiedContractAddress}${apiKeyUrlParam}`;

  const response = await fetch(url);
  const data = await response.json();
  if (data.status === "1") {
    return data.result;
  } else {
    console.error("Got non-1 status from Etherscan API", data);
    if (data.result) throw new Error(data.result);
    throw new Error("Got non-1 status from Etherscan API");
  }
};

export function parseAndCorrectJSON(input: string): any {
  // Add double quotes around keys
  let correctedJSON = input.replace(/(\w+)(?=\s*:)/g, '"$1"');

  // Remove trailing commas
  correctedJSON = correctedJSON.replace(/,(?=\s*[}\]])/g, "");

  try {
    return JSON.parse(correctedJSON);
  } catch (error) {
    console.error("Failed to parse JSON", error);
    throw new Error("Failed to parse JSON");
  }
}
