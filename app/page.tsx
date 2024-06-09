"use client";

import BabyYoda from "@/components/BabyYoda";
import MeditatingYoda from "@/public/baby-yoda-illustration.png";
import NightSky from "@/public/nightsky.png";
import { setCanBeRugged, setToken } from "@/services/slices/tokenSlice";
import { sameContractAbiMulticall } from "@/utils/contractInteractions";
import { getTokens } from "@/utils/getTokens";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
// https://apiv5.paraswap.io/prices?srcToken=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&srcDecimals=18&destToken=0xc2132D05D31c914a87C6611C10748AEb04B58e8F&destDecimals=6&amount=1000000000000000000&side=SELL&network=137&includeDEXS=&userAddress=0x62414d44AaE1aA532630eDa14Df7F449C475759C
/* 
"srcToken": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
"destToken": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
"srcAmount": "10000000000000000",
"destAmount": "29504841",
*/

// enzyme Token Trust vault address: 0xb57cedbc606682c3638f7719dddc757cf33428bf

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { address, chainId } = useAccount();
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [showYoda, setShowYoda] = useState<boolean>(false);
  async function handleTokenAddress(e: { target: { value: string } }) {
    const val = e.target.value;
    setTokenAddress(val);
    const isAddressCheck = isAddress(val);
  }
  const text = `May the force be with token ${tokenAddress}`.split("");
  useEffect(() => {
    if (isPredicting) {
      const timer = setTimeout(() => setShowYoda(true), text.length * 110);
      return () => clearTimeout(timer);
    }
  }, [isPredicting]);
  return (
    <main className="relative flex-1">
      {!showYoda && (
        <Image
          src={NightSky}
          className="fixed top-0 -z-10 w-screen h-screen"
          alt=""
        />
      )}
      {!isPredicting && (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="">
            <Image
              src={MeditatingYoda}
              alt="Meditating Yoda"
              className="w-96 h-96"
            />
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsPredicting(true);
              if (chainId) {
                const tokenDetails: { [key: string]: any } = getTokens(chainId);
                const token = tokenDetails[tokenAddress];
                if (!token) {
                  const res = (await sameContractAbiMulticall(
                    chainId,
                    Array(3).fill(tokenAddress),
                    ["symbol", "name", "decimals"],
                    [[]]
                  )) as Array<string>;
                  console.log(res);
                  dispatch(
                    setToken({
                      contract: tokenAddress,
                      chainId,
                      symbol: res[0],
                      decimals: Number(res[2]),
                      name: res[1],
                      coinKey: res[0],
                      logo: `https://assets.unmarshal.io/tokens/${
                        chainId === 1 ? "ethereum" : "matic"
                      }_${tokenAddress}.png`,
                      balance: 0,
                      price: null,
                    })
                  );
                } else dispatch(setToken(token));
                const isRugged = true;
                await new Promise((r) => setTimeout(r, 20000));
                // const res = await
                console.log("isRugged", isRugged);
                dispatch(setCanBeRugged(isRugged));
                if (isRugged) {
                  router.push("/caution");
                } else {
                  router.push("/enzyme");
                }
              }
            }}
          >
            <input
              type="text"
              onChange={handleTokenAddress}
              placeholder="Enter token address and press enter"
              value={tokenAddress}
              className="p-2 border w-[500px] rounded-xl focus:outline-none text-center"
            />
          </form>
          <div className="mt-5 p-3 ">
            Master Yoda shall use the force to determine rug possibility for you
          </div>
        </div>
      )}
      {isPredicting && (
        <div className="h-full flex items-center justify-center">
          {!showYoda &&
            text.map((letter, index) => {
              return (
                <span
                  key={index}
                  className={`letter ${letter === " " ? "space" : ""}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {letter}
                </span>
              );
            })}
          {showYoda && <BabyYoda />}
        </div>
      )}
    </main>
  );
}
