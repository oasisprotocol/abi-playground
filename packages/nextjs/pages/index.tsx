import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import ContractDetailPage from "./[contractAddress]/[network]";
import type { NextPage } from "next";
import { Address, isAddress } from "viem";
import { usePublicClient } from "wagmi";
import { ChevronLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { MiniFooter } from "~~/components/MiniFooter";
import { NetworksDropdown } from "~~/components/NetworksDropdown";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { AddressInput } from "~~/components/scaffold-eth";
import logo_inv from "~~/public/oasis.svg";
import { useAbiNinjaState } from "~~/services/store/store";
import { fetchContractABIFromAnyABI, fetchContractABIFromEtherscan, parseAndCorrectJSON } from "~~/utils/abi";
import { detectProxyTarget } from "~~/utils/abi-ninja/proxyContracts";
import { getTargetNetworks, notification } from "~~/utils/scaffold-eth";

enum TabName {
  verifiedContract,
  addressAbi,
}

const tabValues = Object.values(TabName) as TabName[];

const networks = getTargetNetworks();

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState(TabName.verifiedContract);
  const [network, setNetwork] = useState(networks[0].id.toString());
  const [verifiedContractAddress, setVerifiedContractAddress] = useState<Address>("");
  const [localAbiContractAddress, setLocalAbiContractAddress] = useState("");
  const [localContractAbi, setLocalContractAbi] = useState("");
  const [isFetchingAbi, setIsFetchingAbi] = useState(false);

  const publicClient = usePublicClient({
    chainId: parseInt(network),
  });

  const { setContractAbi, setAbiContractAddress, setImplementationAddress } = useAbiNinjaState(state => ({
    setContractAbi: state.setContractAbi,
    setAbiContractAddress: state.setAbiContractAddress,
    setImplementationAddress: state.setImplementationAddress,
  }));

  const [isAbiAvailable, setIsAbiAvailable] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchContractAbi = async () => {
      setIsFetchingAbi(true);
      try {
        const implementationAddress = await detectProxyTarget(verifiedContractAddress, publicClient);

        if (implementationAddress) {
          setImplementationAddress(implementationAddress);
        }
        const { abi } = await fetchContractABIFromAnyABI(
          implementationAddress || verifiedContractAddress,
          parseInt(network),
        );
        if (!abi) throw new Error("Got empty or undefined ABI from AnyABI");
        setContractAbi(abi);
        setIsAbiAvailable(true);
      } catch (error) {
        console.error("Error fetching ABI from AnyABI: ", error);
        console.log("Trying to fetch ABI from Etherscan...");
        try {
          const abiString = await fetchContractABIFromEtherscan(verifiedContractAddress, parseInt(network));
          const abi = JSON.parse(abiString);
          setContractAbi(abi);
          setIsAbiAvailable(true);
        } catch (etherscanError: any) {
          setIsAbiAvailable(false);
          console.error("Error fetching ABI from Etherscan: ", etherscanError);

          const bytecode = await publicClient.getBytecode({
            address: verifiedContractAddress,
          });
          const isContract = Boolean(bytecode) && bytecode !== "0x";

          if (isContract) {
            setLocalAbiContractAddress(verifiedContractAddress);
            setActiveTab(TabName.addressAbi);
          } else {
            notification.error("Address is not a contract, are you sure you are on the correct chain?");
          }
        }
      } finally {
        setIsFetchingAbi(false);
      }
    };

    if (isAddress(verifiedContractAddress)) {
      if (network === "31337") {
        setActiveTab(TabName.addressAbi);
        return;
      }
      fetchContractAbi();
    } else {
      setIsAbiAvailable(false);
    }
  }, [verifiedContractAddress, network, setContractAbi, publicClient, setImplementationAddress]);

  useEffect(() => {
    if (router.pathname === "/") {
      setContractAbi([]);
      setImplementationAddress("");
    }
  }, [router.pathname, setContractAbi, setImplementationAddress]);

  const handleLoadContract = () => {
    if (isAbiAvailable) {
      router.push({
        query: {
          contractAddress: verifiedContractAddress,
          network: network,
        },
      });
    }
  };

  const handleUserProvidedAbi = () => {
    if (!localContractAbi) {
      notification.error("Please provide an ABI.");
      return;
    }
    try {
      const parsedAbi = parseAndCorrectJSON(localContractAbi);
      setContractAbi(parsedAbi);
      router.push({
        query: {
          contractAddress: localAbiContractAddress,
          network: network,
        },
      });
      notification.success("ABI successfully loaded.");
    } catch (error) {
      notification.error("Invalid ABI format. Please ensure it is a valid JSON.");
    }
  };

  const fetchAbiFromHeimdall = async (contractAddress: string) => {
    setIsFetchingAbi(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HEIMDALL_URL}/${network}/${contractAddress}`);
      const abi = await response.json();
      if (abi.length === 0) {
        notification.error("Failed to fetch ABI from Heimdall. Please try again or enter ABI manually.");
        setIsFetchingAbi(false);
        return;
      }
      setContractAbi(abi);
      setIsAbiAvailable(true);
      setAbiContractAddress(contractAddress);
      router.push({
        query: {
          contractAddress: contractAddress,
          network: network,
        },
      });
    } catch (error) {
      console.error("Error fetching ABI from Heimdall: ", error);
      notification.error("Failed to fetch ABI from Heimdall. Please try again or enter ABI manually.");
      setIsAbiAvailable(false);
    } finally {
      setIsFetchingAbi(false);
    }
  };

  return (
    <>
      <MetaHeader />
      <div className="flex flex-grow items-center justify-center bg-base-100">
        <div
          className={`flex h-screen bg-base-200 relative overflow-x-hidden w-full flex-col items-center justify-center rounded-2xl pb-4 lg:h-[650px] lg:w-[450px] lg:justify-between lg:shadow-xl`}
        >
          <div className="flex-grow flex flex-col items-center justify-center lg:w-full">
            {tabValues.map(tabValue => (
              <div
                key={tabValue}
                className={`absolute flex flex-col justify-center inset-0 w-full transition-transform duration-300 ease-in-out px-1 ${
                  activeTab === tabValue
                    ? "translate-x-0"
                    : activeTab < tabValue
                    ? "translate-x-full"
                    : "-translate-x-full"
                }`}
              >
                {tabValue === TabName.verifiedContract ? (
                  <div className="my-16 flex flex-col items-center justify-center">
                    <Image src={logo_inv} alt="logo" width={128} height={128} className="mb-4" />
                    <h2 className="mb-0 text-5xl font-bold">ABI playground</h2>
                    <p>Interact with any verified contract on Oasis EVM ParaTimes</p>
                    <div className="mt-4">
                      <NetworksDropdown onChange={option => setNetwork(option ? option.value.toString() : "")} />
                    </div>

                    <div className="w-10/12 my-8">
                      <AddressInput
                        placeholder="Contract address"
                        value={verifiedContractAddress}
                        onChange={setVerifiedContractAddress}
                      />
                    </div>

                    <button
                      className="btn btn-primary min-h-fit h-10 px-4 text-base font-semibold border-2 hover:bg-neutral hover:text-primary"
                      onClick={handleLoadContract}
                      disabled={!isAbiAvailable}
                    >
                      {isFetchingAbi ? <span className="loading loading-spinner"></span> : "Load contract"}
                    </button>
                    <div className="flex flex-col text-sm w-4/5 mb-10 mt-14">
                      <div className="mb-2 text-center text-base">Quick access</div>
                      <div className="flex justify-center w-full rounded-xl">
                        <Link
                          href={{
                            query: { contractAddress: "0x8Bc2B030b299964eEfb5e1e0b36991352E56D2D3", network: "23294" },
                          }}
                          passHref
                          className="link w-1/3 text-center text-base-content no-underline"
                        >
                          Wrapped ROSE
                        </Link>
                        <Link
                          href={{
                            query: { contractAddress: "0xcA11bde05977b3631167028862bE2a173976CA11", network: "23294" },
                          }}
                          passHref
                          className="link w-1/3 text-center text-base-content no-underline"
                        >
                          Multicall V3
                        </Link>
                        <Link
                          href={{
                            query: { contractAddress: "0x39d22B78A7651A76Ffbde2aaAB5FD92666Aca520", network: "23294" },
                          }}
                          passHref
                          className="link w-1/3 text-center text-base-content no-underline"
                        >
                          Ocean Token
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full flex-col items-center gap-3 p-6">
                    <div className="flex justify-center mb-6">
                      <button
                        className="btn btn-ghost absolute left-4 px-2 btn-primary"
                        onClick={() => {
                          setActiveTab(TabName.verifiedContract);
                          setVerifiedContractAddress("");
                        }}
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                        Go back
                      </button>
                      <Image src={logo_inv} alt="logo" width={64} height={64} className="mb-2" />
                    </div>

                    <div className="flex flex-col items-center w-4/5 border-b-2 pb-8">
                      <div className="flex justify-center items-center gap-1">
                        <MagnifyingGlassIcon className="h-5 w-5" />
                        <h1 className="font-semibold text-lg mb-0">Contract not verified</h1>
                      </div>
                      <p className="bg-neutral px-2 rounded-md  text-sm shadow-sm">{localAbiContractAddress}</p>
                      <h4 className="text-center mb-6 font-semibold leading-tight">
                        You can decompile the contract (beta) or import the ABI manually below.
                      </h4>
                      <button
                        className="btn btn-primary min-h-fit h-10 px-4 text-base font-semibold border-2 hover:bg-neutral hover:text-primary"
                        onClick={() => fetchAbiFromHeimdall(localAbiContractAddress)}
                      >
                        {isFetchingAbi ? <span className="loading loading-spinner"></span> : "Decompile (beta)"}
                      </button>
                    </div>
                    <div className="w-full flex flex-col items-center gap-2">
                      <h1 className="mt-2 font-semibold text-lg">Manually import ABI</h1>
                      <textarea
                        className="textarea bg-neutral w-4/5 h-24 mb-4 resize-none"
                        placeholder="Paste contract ABI in JSON format here"
                        value={localContractAbi}
                        onChange={e => setLocalContractAbi(e.target.value)}
                      ></textarea>
                      <button
                        className="btn btn-primary min-h-fit h-10 px-4 mb-12 text-base font-semibold border-2 hover:bg-neutral hover:text-primary"
                        onClick={handleUserProvidedAbi}
                      >
                        Import ABI
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <SwitchTheme className="absolute top-5 right-5" />
          <MiniFooter />
        </div>
      </div>
    </>
  );
};

const QueryRouter = () => {
  const router = useRouter();
  return typeof router.query.contractAddress === "string" && typeof router.query.network === "string" ? (
    <ContractDetailPage contractAddress={router.query.contractAddress} network={router.query.network} />
  ) : (
    <Home />
  );
};

export default QueryRouter;
