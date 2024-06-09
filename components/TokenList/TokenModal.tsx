import { getTokens } from "@/utils/getTokens";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import TokenRow from "./TokenRow";

const TokenModal = ({
  showTokensList,
  setShowTokensList,
  setSelectedToken,
}: {
  showTokensList: boolean;
  setShowTokensList: (val: boolean) => void;
  setSelectedToken: any;
}) => {
  const { chainId } = useAccount();
  const [tokens, setTokens] = useState<{ [key: string]: any }>({});
  const [filteredTokens, setFilteredTokens] = useState<{ [key: string]: any }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const handleSearchTokens = (e: any) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    setLoading(true);
    if (searchValue.trim() === "") {
      setFilteredTokens(tokens);
      setLoading(false);
      return;
    }
    const filteredTokensList = Object.keys(tokens).reduce(
      (acc: { [key: string]: any }, tokenAddress) => {
        const token = tokens[tokenAddress];
        if (
          token.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
          token.name.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          acc[tokenAddress] = token;
        }
        return acc;
      },
      {}
    );
    setFilteredTokens(filteredTokensList);
    setLoading(false);
  };

  useEffect(() => {
    if (chainId) {
      const tokensList = getTokens(chainId);
      setTokens(tokensList);
      setFilteredTokens(tokensList);
    }
    return () => {};
  }, [chainId]);

  return (
    showTokensList &&
    !loading && (
      <div className="z-10 fixed top-[50%] left-[50%] bg-black border -translate-x-[50%] -translate-y-[50%] w-[500px]">
        <label className="flex border rounded-xl p-2 mb-2">
          <input
            type="text"
            placeholder="Search tokens"
            className="ml-3 rounded-xl flex-1 focus:outline-none bg-transparent"
            value={search}
            onChange={handleSearchTokens}
          />
        </label>
        <div className="h-[500px] overflow-y-scroll p-2">
          <div className="flex flex-col gap-1 justify-center items-start">
            {Object.keys(filteredTokens).map((tokenAddress) => {
              return (
                <div
                  className="border w-full flex items-start cursor-pointer p-2 rounded-xl hover:border-[2px] hover:scale-[1.03]"
                  key={tokenAddress}
                  onClick={() => {
                    setSelectedToken(tokens[tokenAddress]);
                    setShowTokensList(false);
                  }}
                >
                  <TokenRow tokenDetails={tokens[tokenAddress]} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
};

export default TokenModal;
