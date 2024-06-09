import zkSyncTokens from "@/artifacts/324_tokens.json";
import polygonTokens from "@/artifacts/137_tokens.json";
import polygonMemeTokens from "@/artifacts/137_meme_tokens.json";
import mainnetMemeTokens from "@/artifacts/1_meme_tokens.json";
import mainnetTokens from "@/artifacts/1_tokens.json";

export const getTokens = (chainId: number) => {
  if (chainId === 324) {
    return zkSyncTokens;
  } else if (chainId === 1) return { ...mainnetTokens, ...mainnetMemeTokens };
  return { ...polygonTokens, ...polygonMemeTokens };
};
