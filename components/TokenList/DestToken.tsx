import { RootState } from "@/services/store";
import { format4Units } from "@/utils/formatter";
import { useSelector } from "react-redux";

const DestToken = ({
  loadingBal,

  selectedTokenBal,
  destTokenAmount,
}: {
  destTokenAmount: bigint;
  loadingBal: boolean;

  selectedTokenBal: bigint;
}) => {
  const { token: destToken } = useSelector((state: RootState) => state.token);
  const formattedBal =
    !loadingBal && format4Units(selectedTokenBal, destToken?.decimals ?? 18);
  const formattedDestTokenAmount = format4Units(
    destTokenAmount,
    destToken?.decimals ?? 18
  );
  return (
    <div>
      {destToken ? (
        <div className="border rounded-xl flex gap-3 justify-between p-3 w-[500px] mx-auto">
          <span className="border text-[40px] flex-1 text-left rounded-xl p-2">
            {formattedDestTokenAmount}
          </span>
          <div className="flex flex-col gap-2 justify-center items-start w-[200px]">
            <div className="cursor-pointer gap-3 flex justify-center items-center border px-3 py-2 rounded">
              <img
                alt={destToken?.symbol + " logo"}
                src={destToken?.logo}
                className="w-8 h-8 rounded-full border"
              />
              {destToken?.symbol}
            </div>
            <div>
              Predicted Safe to Invest
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DestToken;
