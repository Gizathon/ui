"use client";

import { RootState } from "@/services/store";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import NightSky from "@/public/nightsky.png";

const page = () => {
  const { token } = useSelector((state: RootState) => state.token);
  return (
    <div className="flex-1 flex flex-col items-center gap-10">
      <Image
        src={NightSky}
        className="fixed top-0 -z-10 w-screen h-screen"
        alt=""
      />
      <div className="w-fit flex flex-col items-center justify-center gap-6 mx-auto mt-10 uppercase">
        <div className="text-red-600 text-4xl">Caution </div>
        VERY High Risk of Volatility and can be rugged
      </div>
      <div className="border flex flex-col gap-3 rounded-xl p-7 shadow-xl shadow-red-700">
        <div>Token Name: {token?.name}</div>
        <div className="flex gap-3 items-center">
          <img
            src={token.logo}
            alt="Token Logo"
            className="w-20 h-20 rounded-full border"
          />
          {token?.symbol}
        </div>
        <div>Token ChainId: {token.chainId}</div>
        <div>Token Address: {token.contract}</div>
      </div>
    </div>
  );
};

export default page;
