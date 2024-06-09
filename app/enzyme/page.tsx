"use client";

import { RootState } from "@/services/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Address, erc20Abi, isAddress, parseUnits } from "viem";
import { useAccount, useConfig } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import NightSky from "@/public/nightsky.png";
import SelectedToken from "@/components/TokenList/SelectedToken";
import DestToken from "@/components/TokenList/DestToken";
import TokenModal from "@/components/TokenList/TokenModal";
import ArrowsGIF from "@/public/ArrowGIF.gif";
import { swapOnEnzyme } from "@/utils/enzyme/integrator";
import { getParams, getQuotes } from "@/utils/enzyme/paraswap";

export default function Enzyme() {
  const wagmiConfig = useConfig();
  const { address, chainId } = useAccount();
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [selectedTokenBal, setSelectedTokenBal] = useState<bigint>(BigInt(0));
  const [showTokensList, setShowTokensList] = useState(false);
  const [destTokenAmount, setDestTokenAmount] = useState<bigint>(BigInt(0));
  const [loadingBal, setLoadingBal] = useState(false);
  const { token, srcTokenAmount } = useSelector(
    (state: RootState) => state.token
  );
  const [comptrollerProxyAddress, setComptrollerProxyAddress] =
    useState<string>("");
  const [vaultAddress, setVaultAddress] = useState<string>("");
  const handleComptrollerAddress = (e: { target: { value: string } }) => {
    setComptrollerProxyAddress(e.target.value);
  };
  useEffect(() => {
    async function fetch() {
      let balance;
      if (
        selectedToken.contract.toLowerCase() ===
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase()
      ) {
        balance = (await getPublicClient(wagmiConfig)?.getBalance({
          address: address as Address,
        })) as bigint;
        setSelectedTokenBal(balance);
        setLoadingBal(false);
        return;
      }
      balance = (await getPublicClient(wagmiConfig)?.readContract({
        abi: erc20Abi,
        address: selectedToken.contract as Address,
        functionName: "balanceOf",
        args: [vaultAddress as Address],
      })) as bigint;
      console.log({ balance });
      setSelectedTokenBal(balance);
      setLoadingBal(false);
    }
    if (
      selectedToken &&
      address &&
      chainId &&
      isAddress(comptrollerProxyAddress)
    ) {
      setLoadingBal(true);
      fetch();
    }
  }, [selectedToken, address, chainId]);
  useEffect(() => {
    async function fetch() {
      if (address && Number(srcTokenAmount) > 0) {
        const data = await getQuotes({
          srcToken: selectedToken.contract,
          srcDecimals: selectedToken.decimals,
          destToken: token.contract,
          destDecimals: token.decimals,
          amount: parseUnits(srcTokenAmount, selectedToken.decimals).toString(),
          chainId,
          address,
        });
        const paramsData = await getParams({
          chainId,
          params: {
            srcToken: selectedToken.contract,
            srcAmount: parseUnits(
              srcTokenAmount,
              selectedToken.decimals
            ).toString(),
            destToken: token.contract,
            destAmount: data.priceRoute.destAmount,
            userAddress: address,
            partner: "enzyme",
            txOrigin: address,
            priceRoute: data.priceRoute,
          },
        });
        console.log({ paramsData });

        setDestTokenAmount(BigInt(data.priceRoute.destAmount));
      }
    }
    if (
      isAddress(vaultAddress) &&
      selectedToken &&
      selectedToken.decimals &&
      address &&
      chainId
    ) {
      fetch();
    }
  }, [srcTokenAmount, selectedToken]);
  return (
    <main>
      <Image
        src={NightSky}
        className="fixed top-0 -z-10 w-screen h-screen"
        alt=""
      />
      <div className="mx-auto w-fit">
        <label className="w-fit mx-auto border flex items-center justify-center rounded-xl p-2">
          <input
            type="text"
            placeholder="Enter comptroller proxy address"
            className="rounded-xl flex-1 focus:outline-none bg-transparent text-center w-[500px] p-2"
            value={comptrollerProxyAddress}
            onChange={handleComptrollerAddress}
          />
        </label>
        <label className="w-fit mx-auto border flex items-center justify-center rounded-xl p-2">
          <input
            type="text"
            placeholder="Enter vault address"
            className="rounded-xl flex-1 focus:outline-none bg-transparent text-center w-[500px] p-2"
            value={vaultAddress}
            onChange={(e) => setVaultAddress(e.target.value)}
          />
        </label>
      </div>
      <div>
        <div className="w-screen mt-28 flex flex-col justify-center items-center gap-6">
          <SelectedToken
            loadingBal={loadingBal}
            setShowTokensList={setShowTokensList}
            selectedTokenBal={selectedTokenBal}
            selectedToken={selectedToken}
          />
          <Image src={ArrowsGIF} alt={"Convert To"} width={20} height={20} />
          <DestToken
            destTokenAmount={destTokenAmount}
            loadingBal={loadingBal}
            selectedTokenBal={selectedTokenBal}
          />
          <TokenModal
            setShowTokensList={setShowTokensList}
            showTokensList={showTokensList}
            setSelectedToken={setSelectedToken}
          />
          <div></div>
          <button
            onClick={async () => {
              if (
                chainId &&
                address &&
                comptrollerProxyAddress &&
                destTokenAmount &&
                selectedToken
              ) {
                await swapOnEnzyme({
                  chainId,
                  address,
                  comptrollerProxy: comptrollerProxyAddress as Address,
                  destToken: token.contract,
                  srcToken: selectedToken.contract as Address,
                  amount: parseUnits(
                    srcTokenAmount,
                    selectedToken.decimals
                  ).toString(),
                  destDecimals: token.decimals,
                  srcDecimals: selectedToken.decimals,
                });
              }
            }}
            className="border rounded-xl p-3 w-[500px] uppercase"
          >
            TRADE
          </button>
        </div>
      </div>
    </main>
  );
}
