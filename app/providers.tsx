"use client";

import AppLayout from "@/components/AppLayout";
import { wagmiConfig } from "@/utils/wagmiConfig";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "next-themes";
import Head from "next/head";
import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { Provider as StoreProvider } from "react-redux";
import { store } from "@/services/store";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <>
      <Head>
        <title>Viem Tutorial</title>
        <meta
          name="description"
          content="The Viem Tutorial is a step-by-step guide to building a decentralized application with Viem."
        />
        <meta
          name="keywords"
          content="Viem, Tutorial, DApp, Decentralized Application, Web3, Ethereum, Polygon, Blockchain, DeFi, Mainnet, Arbitrum, Binance Smart Chain"
        />
      </Head>
      {isMounted && (
        <ThemeProvider defaultTheme="dark" attribute="class">
          <StoreProvider store={store}>
            <WagmiProvider config={wagmiConfig}>
              <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                  theme={resolvedTheme === "dark" ? darkTheme() : lightTheme()}
                >
                  <AppLayout>{children}</AppLayout>
                </RainbowKitProvider>
              </QueryClientProvider>
            </WagmiProvider>
          </StoreProvider>
        </ThemeProvider>
      )}
    </>
  );
};

export default Providers;
