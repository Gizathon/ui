"use client";

import DestToken from "@/components/TokenList/DestToken";
import SelectedToken from "@/components/TokenList/SelectedToken";
import TokenModal from "@/components/TokenList/TokenModal";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Address, erc20Abi } from "viem";
import { useAccount, useConfig } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import ArrowsGIF from "@/public/ArrowGIF.gif";

export default function ZkSync() {
  const wagmiConfig = useConfig();
  const { address, chainId } = useAccount();
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [selectedTokenBal, setSelectedTokenBal] = useState<bigint>(BigInt(0));
  const [showTokensList, setShowTokensList] = useState(false);
  const [destTokenAmount, setDestTokenAmount] = useState<bigint>(BigInt(0));
  const [loadingBal, setLoadingBal] = useState(false);
  const [destToken, setDestToken] = useState<any>({
    contract: "0xA4C00e85ceBc898e885F5055171dc424dbA8bF45",
    chainId: 324,
    balance: "0",
    symbol: "PANDA",
    decimals: 18,
    name: "Panda",
    coinKey: "PANDA",
    logo: "https://static.debank.com/image/era_token/logo_url/0xa4c00e85cebc898e885f5055171dc424dba8bf45/0f3f1baa82762ce742e337f0a6dbab40.png",
    price: null,
  });
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
        args: [address as Address],
      })) as bigint;
      setSelectedTokenBal(balance);
      setLoadingBal(false);
    }
    if (selectedToken && address && chainId) {
      setLoadingBal(true);
      fetch();
    }
  }, [selectedToken, address, chainId]);
  return (
    <div className="w-screen mt-28 flex flex-col justify-center items-center gap-5">
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
    </div>
  );
}
