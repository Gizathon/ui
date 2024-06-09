import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { http } from "viem";
import {
  mainnet,
  linea,
  lineaSepolia,
  polygon,
  zkSync,
  zkSyncSepoliaTestnet,
} from "viem/chains";
import { createConfig } from "wagmi";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, walletConnectWallet, trustWallet],
    },
  ],
  {
    appName: "token-trust",
    projectId: process.env.NEXT_PUBLIC_WC_PROJECTID || "",
  }
);

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, zkSyncSepoliaTestnet, zkSync, lineaSepolia, linea],
  connectors,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [zkSync.id]: http(),
    [zkSyncSepoliaTestnet.id]: http(),
    [lineaSepolia.id]: http(),
    [linea.id]: http(),
  },
});
