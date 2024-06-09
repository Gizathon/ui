import { enzyGraphQueryVaultBalances } from "@/app/query";
import { integrationAdapter, integrationManager } from "@/constants/enzyme";
import { HexString } from "@/types";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import * as Enzyme from "@enzymefinance/sdk";
import { Integrations } from "@enzymefinance/sdk/Portfolio";
import { Slippage } from "@enzymefinance/sdk/Utils";
import toast from "react-hot-toast";
import { Address } from "viem";
import { getPublicClient, getWalletClient } from "wagmi/actions";
import { wagmiConfig } from "../wagmiConfig";
import { getParams, getQuotes } from "./paraswap";
// https://docs.enzyme.finance/developers/contracts
/* 
interface NativeDepositArgs {
  depositWrapper: Address;
  comptrollerProxy: Address;
  exchange: Address;
  exchangeApproveTarget: Address;
  exchangeData: Hex;
  minInvestmentAmount: bigint;
  amount: bigint;
}
*/

export const swapOnEnzyme = async function fetch({
  srcToken,
  srcDecimals,
  destToken,
  destDecimals,
  amount,
  chainId,
  address,
  comptrollerProxy,
}: {
  srcToken: string;
  srcDecimals: number;
  destToken: string;
  destDecimals: number;
  amount: string;
  chainId: number;
  address: string;
  comptrollerProxy: Address;
}) {
  if (chainId) {
    const data = await getQuotes({
      srcToken,
      srcDecimals,
      destToken,
      destDecimals,
      amount,
      chainId,
      address,
    });
    console.dir({ dataFromPriceCall: data });
    console.log({ destAmount: data.priceRoute.destAmount });
    const params = {
      srcToken,
      srcAmount: amount,
      destToken,
      destAmount: data.priceRoute.destAmount,
      userAddress: address,
      partner: "enzyme",
      txOrigin: address,
      priceRoute: data.priceRoute,
    };
    const paraswapData = await getParams({
      chainId,
      params,
    });
    console.dir({ dataFromTransaction_networkCall: paraswapData });
    const swapPair = getSwapPair(BigInt(0), paraswapData, {
      id: destToken,
    });
    // ParaSwapAdapter https://polygonscan.com/address/0xb665e93e19eb18ef5005f0296d4693e3154ab0df
    const slippageInBps = BigInt(1000);
    const paraSwapTakeOrderParams = {
      callArgs: {
        expectedIncomingAssetAmount: BigInt(paraswapData.expectedAmount),
        minIncomingAssetAmount: Slippage.applySlippage(
          BigInt(paraswapData.expectedAmount),
          slippageInBps
        ),
        outgoingAsset: srcToken as Address,
        outgoingAssetAmount: BigInt(amount),
        uuid: paraswapData.uuid as HexString,
        ...swapPair,
      },
      comptrollerProxy,
      //  "0x33eE29c680c6DD4b8cd0D316B5D094737F1e3916" as Address,
      integrationAdapter: integrationAdapter[chainId],
      integrationManager: integrationManager[chainId],
    };
    const paraSwapSendOrder =
      Enzyme.Portfolio.Integrations.ParaSwapV5.takeOrder(
        paraSwapTakeOrderParams
      );
    console.log({ paraSwapSendOrder });
    const walletClient = await getWalletClient(wagmiConfig);
    if (walletClient) {
      console.log("Writing contract...");
      const txHash = await walletClient.writeContract(paraSwapSendOrder.params);
      console.log({ txHash });
      const receipt = await getPublicClient(
        wagmiConfig
      ).waitForTransactionReceipt({ hash: txHash });
      if (receipt.status === "success") toast.success("Swapped successfully");
    }
  }
};

type SwapData =
  | {
      swapType: typeof Integrations.ParaSwapV5.SwapType.Mega;
      swapData: Integrations.ParaSwapV5.MegaSwapData;
    }
  | {
      swapType: typeof Integrations.ParaSwapV5.SwapType.Multi;
      swapData: Integrations.ParaSwapV5.MultiSwapData;
    }
  | {
      swapType: typeof Integrations.ParaSwapV5.SwapType.Simple;
      swapData: Integrations.ParaSwapV5.SimpleSwapData;
    };

export const getSwapPair = (
  contractMethod: bigint,
  paraswapData: any,
  incoming: { id: string }
) => {
  let swapPair: SwapData;
  switch (contractMethod) {
    case Integrations.ParaSwapV5.SwapType.Simple: {
      const { callees, values, exchangeData, startIndexes } = paraswapData;

      swapPair = {
        swapData: {
          callees: callees as HexString[],
          exchangeData: exchangeData as HexString,
          incomingAsset: incoming.id as HexString,
          startIndexes: startIndexes as bigint[],
          values: values as bigint[],
        },
        swapType: Integrations.ParaSwapV5.SwapType.Simple,
      };
      break;
    }
    case Integrations.ParaSwapV5.SwapType.Multi: {
      const { path } = paraswapData as {
        path: Enzyme.Portfolio.Integrations.ParaSwapV5.MultiSwapData;
      };
      swapPair = {
        swapData: path,
        swapType: Integrations.ParaSwapV5.SwapType.Multi,
      };
      break;
    }
    case Integrations.ParaSwapV5.SwapType.Mega: {
      const { path } = paraswapData as {
        path: Enzyme.Portfolio.Integrations.ParaSwapV5.MegaSwapData;
      };
      swapPair = {
        swapData: path,
        swapType: Integrations.ParaSwapV5.SwapType.Mega,
      };

      break;
    }
    default:
      throw new Error("Invalid swap type");
  }
  return swapPair;
};

export const enzymeGraphQueryUrlTemp = "https://app.enzyme.finance/api/graphql";
export const enzymeGraphQueryUrl =
  "https://app.enzyme.finance/subgraph/GCAHDyqvZBLMwqdb9U7AqWAN4t4TSwR3aXMHDoUUFuRV";

export const getVaultBalancesFromGraph = async ({
  address,
  vaultAddress,
  currency = "usd",
}: {
  address: Address;
  vaultAddress: Address;
  currency?: string;
}) => {
  const client = new ApolloClient({
    uri: enzymeGraphQueryUrl,
    cache: new InMemoryCache(),
  });

  const response = await client.query({
    query: gql(enzyGraphQueryVaultBalances),
    variables: {
      currency,
      network: "polygon",
      vault: vaultAddress,
    },
  });
  return response.data;
};

export const getTxnDataFromGraph = async ({
  address,
  vaultAddress,
  comptrollerProxy,
  expectedIncomingAmount,
  destToken,
  srcAmount,
  srcToken,
}: {
  address: Address;
  srcToken: Address;
  vaultAddress: Address;
  comptrollerProxy: Address;
  expectedIncomingAmount: string;
  destToken: Address;
  srcAmount: string;
}) => {
  const client = new ApolloClient({
    uri: enzymeGraphQueryUrl,
    cache: new InMemoryCache(),
  });

  const response = await client.query({
    query: gql(enzyGraphQueryVaultBalances),
    variables: {
      vaultProxy: vaultAddress,
      comptrollerProxy,
      exchange: "PARASWAP",
      expectedIncomingAmount,
      incoming: srcToken,
      maxSlippage: 0.01,
      network: "polygon",
      originAddress: address,
      outgoing: destToken,
      quantity: srcAmount,
      userAddress: address,
    },
  });
  return response.data;
};

/*
const data = await getTxnDataFromGraph({
        vaultAddress: "0xb57cedbc606682c3638f7719dddc757cf33428bf" as Address,
        comptrollerProxy: "0x33ee29c680c6dd4b8cd0d316b5d094737f1e3916",
        // exchange: "UNISWAP_V3",
        expectedIncomingAmount: "9997",
        srcToken: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
        // maxSlippage: 0.01,
        // network: "polygon",
        // originAddress: "0x62414d44aae1aa532630eda14df7f449c475759c",
        destToken: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        srcAmount: "10000",
        address: "0x62414d44aae1aa532630eda14df7f449c475759c",
      });
*/
