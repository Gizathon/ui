import { HexString } from "@/types";
import axios from "axios";

export const getQuotes = async ({
  srcToken,
  destToken,
  amount,
  destDecimals,
  srcDecimals,
  address,
  chainId = 137,
}: {
  srcToken: string;
  destToken: string;
  amount: string;
  destDecimals: number;
  srcDecimals: number;
  address: string;
  chainId?: number;
}) => {
  console.log({
    srcToken,
    srcDecimals,
    destToken,
    destDecimals,
    amount,
    chainId,
    address,
  });
  const url = `https://apiv5.paraswap.io/prices?otherExchangePrices=true&srcToken=${srcToken}&srcDecimals=${srcDecimals}&destToken=${destToken}&destDecimals=${destDecimals}&amount=${amount}&side=SELL&network=${chainId}&userAddress=${address}&partner=enzyme`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getParams = async ({
  chainId = 137,
  params,
}: {
  chainId?: number;
  params: any;
}) => {
  console.log("Args to the /transaction call: ", { params });
  const url = `https://apiv5.paraswap.io/transactions/${chainId}?onlyParams=true&ignoreChecks=true`;
  const response = await axios.post(url, params);
  console.log(response.data);
  return response.data[0];
};

// const data = await getQuotes({
//   srcToken,
//   srcDecimals,
//   destToken,
//   destDecimals,
//   amount,
//   address: "0x62414d44AaE1aA532630eDa14Df7F449C475759C",
// });
// console.dir({ dataFromPriceCall: data });
// console.log({ destAmount: data.priceRoute.destAmount });
// const params = {
//   srcToken,
//   srcAmount: amount,
//   destToken,
//   destAmount: data.priceRoute.destAmount,
//   userAddress: "0x62414d44AaE1aA532630eDa14Df7F449C475759C",
//   partner: "enzyme",
//   txOrigin: "0x62414d44AaE1aA532630eDa14Df7F449C475759C",
//   priceRoute: data.priceRoute,
// };
// const paraswapData = await getParams({
//   params,
// });
// console.dir({ dataFromTransaction_networkCall: paraswapData });
// const swapPair = getSwapPair(BigInt(0), paraswapData, { id: destToken });
// // ParaSwapAdapter https://polygonscan.com/address/0xb665e93e19eb18ef5005f0296d4693e3154ab0df
// const slippageInBps = BigInt(1000);
// const paraSwapSendOrder =
//   Enzyme.Portfolio.Integrations.ParaSwapV5.takeOrder({
//     callArgs: {
//       expectedIncomingAssetAmount: BigInt(paraswapData.expectedAmount),
//       minIncomingAssetAmount: Slippage.applySlippage(
//         BigInt(paraswapData.expectedAmount),
//         slippageInBps
//       ),
//       outgoingAsset: srcToken,
//       outgoingAssetAmount: BigInt(amount),
//       uuid: paraswapData.uuid as HexString,
//       ...swapPair,
//     },
//     comptrollerProxy: "0x33eE29c680c6DD4b8cd0D316B5D094737F1e3916",
//     integrationAdapter: "0xb665e93e19eb18ef5005f0296d4693e3154ab0df",
//     integrationManager: "0x92fcde09790671cf085864182b9670c77da0884b",
//   });
// console.log({ paraSwapSendOrder });
