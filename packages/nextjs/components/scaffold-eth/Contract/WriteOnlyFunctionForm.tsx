import { useEffect, useState } from "react";
import { InheritanceTooltip } from "./InheritanceTooltip";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Abi, AbiFunction } from "abitype";
import { Address, TransactionReceipt } from "viem";
import { useAccount, useContractWrite, useNetwork, useWaitForTransaction, useWalletClient } from "wagmi";
import {
  ContractInput,
  IntegerInput,
  TxReceipt,
  getFunctionInputKey,
  getInitialFormState,
  getParsedContractFunctionArgs,
  getParsedError,
  transformAbiFunction,
  tryConvertingToBigInt,
} from "~~/components/scaffold-eth";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useAbiNinjaState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";

type WriteOnlyFunctionFormProps = {
  abi: Abi;
  abiFunction: AbiFunction;
  onChange: () => void;
  contractAddress: Address;
  inheritedFrom?: string;
};

export const WriteOnlyFunctionForm = ({
  abi,
  abiFunction,
  onChange,
  contractAddress,
  inheritedFrom,
}: WriteOnlyFunctionFormProps) => {
  const mainChainId = useAbiNinjaState(state => state.mainChainId);
  const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(abiFunction));
  const [txValue, setTxValue] = useState<string | bigint>("");
  const { chain } = useNetwork();
  const writeTxn = useTransactor();
  const { address: connectedAddress } = useAccount();
  const { openConnectModal } = useConnectModal();
  const wrongNetwork = !chain || chain?.id !== mainChainId;
  const walletClient = useWalletClient({ chainId: mainChainId });

  const {
    data: result,
    isLoading,
    writeAsync,
  } = useContractWrite({
    mode: "prepared", // Workaround to avoid simulating and throwing e.g. "execution reverted: ERC20: burn from the zero address"
    request: {
      account: walletClient.data?.account ?? "",
      address: contractAddress,
      functionName: abiFunction.name,
      chainId: mainChainId,
      chain: { id: mainChainId } as any,
      abi: abi,
      args: getParsedContractFunctionArgs(form),
      value: tryConvertingToBigInt(txValue, 0n),
    },
  });

  const handleWrite = async () => {
    if (writeAsync) {
      try {
        BigInt(txValue); // Ensure no ignored errors from tryConvertingToBigInt
        const makeWriteWithParams = () => writeAsync();
        await writeTxn(makeWriteWithParams);
        onChange();
      } catch (e: any) {
        const message = getParsedError(e);
        notification.error(message);
      }
    }
  };

  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  const { data: txResult } = useWaitForTransaction({
    hash: result?.hash,
  });
  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  // TODO use `useMemo` to optimize also update in ReadOnlyFunctionForm
  const transformedFunction = transformAbiFunction(abiFunction);
  const inputs = transformedFunction.inputs.map((input, inputIndex) => {
    const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
    return (
      <ContractInput
        key={key}
        setForm={updatedFormValue => {
          setDisplayedTxResult(undefined);
          setForm(updatedFormValue);
        }}
        form={form}
        stateObjectKey={key}
        paramType={input}
      />
    );
  });
  const zeroInputs = inputs.length === 0 && abiFunction.stateMutability !== "payable";

  return (
    <div className="py-5 space-y-3 first:pt-0 last:pb-1">
      <div className={`flex gap-3 ${zeroInputs ? "flex-row justify-between" : "flex-col"}`}>
        <p className="font-medium my-0 break-words">
          {abiFunction.name}
          <InheritanceTooltip inheritedFrom={inheritedFrom} />
        </p>
        {inputs}
        {abiFunction.stateMutability === "payable" ? (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center ml-2">
              <span className="text-xs font-medium mr-2 leading-none">payable value</span>
              <span className="block text-xs font-extralight leading-none">wei</span>
            </div>
            <IntegerInput
              value={txValue}
              onChange={updatedTxValue => {
                setDisplayedTxResult(undefined);
                setTxValue(updatedTxValue);
              }}
              placeholder="value (wei)"
            />
          </div>
        ) : null}
        <div className={`flex justify-between gap-2 ${zeroInputs ? "mt-8" : "mt-0"}`}>
          {!zeroInputs && (
            <div className="flex-grow basis-0">
              {displayedTxResult ? <TxReceipt txResult={displayedTxResult} /> : null}
            </div>
          )}
          {connectedAddress ? (
            <div
              className={`flex ${
                wrongNetwork &&
                "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
              }`}
              data-tip={`${wrongNetwork && "Wrong network"}`}
            >
              <button className="btn btn-secondary btn-sm" disabled={wrongNetwork || isLoading} onClick={handleWrite}>
                {isLoading && <span className="loading loading-spinner loading-xs"></span>}
                Send 💸
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={openConnectModal}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      {zeroInputs && txResult ? (
        <div className="flex-grow basis-0">
          <TxReceipt txResult={txResult} />
        </div>
      ) : null}
    </div>
  );
};
