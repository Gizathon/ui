import { ConnectorType } from "@/enums";
import { HexString } from "@/types";
import { Abi, createWalletClient, custom, erc20Abi } from "viem";
import * as allViemChains from "viem/chains";
import { getPublicClient } from "wagmi/actions";
import { wagmiConfig } from "./wagmiConfig";

type Window = {
  ethereum: any;
};

export const viemChainsById: Record<number, allViemChains.Chain> =
  Object.values(allViemChains).reduce((acc, chainData) => {
    return chainData.id
      ? {
          ...acc,
          [chainData.id]: chainData,
        }
      : acc;
  }, {});

export const getWalletClient = async ({
  chainId,
  account,
  connectorType = ConnectorType.injected,
}: {
  chainId: number;
  account: HexString;
  connectorType?: string;
}) => {
  try {
    return createWalletClient({
      chain: viemChainsById[chainId],
      transport: custom((window as unknown as Window).ethereum!),
      account,
    });
  } catch (error) {
    throw new Error("Error creating Wallet Client");
  }
};

export const writeContract = async ({
  chainId,
  contractAddress,
  abi,
  functionName,
  args = [],
  userAddress,
  connectorType = ConnectorType.injected,
}: {
  chainId: number;
  contractAddress: HexString;
  abi: Abi;
  functionName: string;
  args?: unknown[];
  userAddress: HexString;
  value?: bigint;
  gasMultiplier?: bigint;
  connectorType?: ConnectorType;
}): Promise<HexString | { status: string }> => {
  console.log(chainId);
  try {
    const walletClient = await getWalletClient({
      chainId,
      account: userAddress,
      connectorType,
    });
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName,
      args,
      account: userAddress,
      type: "eip1559",
    });
    return hash;
    // wait for block confirmation and return transaction receipt
  } catch (e: unknown) {
    console.log({ e });
    // const errorReason =
    //   (((e as BaseError)?.cause as ContractFunctionRevertedError)
    //     ?.reason as string) || DEFAULT_ERROR_REASON;
    // toast.error(
    //   errorCodes[errorReason]?.length > 0
    //     ? (errorCodes[errorReason] as string)
    //     : errorCodes[DEFAULT_ERROR_REASON]
    // );
    return { status: "failed" };
  }
};

export const sameContractAbiMulticall = async (
  chainId: number,
  contracts: string[],
  allMethods: string[],
  allParams: any
) => {
  try {
    if (contracts.length > 0) {
      const abi = erc20Abi;

      const data = contracts.map((contract: string, idx: number) => ({
        address: contract as HexString,
        abi,
        functionName: allMethods[idx],
        args: allParams[idx],
      }));

      const multiCallResults = await getPublicClient(wagmiConfig).multicall({
        contracts: data,
      });
      const results = multiCallResults.map((result) => {
        const val = result.result;
        return val;
      });
      return results;
    }
    return [];
  } catch (err) {
    console.error({ err });
  }
};
