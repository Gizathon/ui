import UnknownSVG from "@/public/unknown.svg";
import { setSrcTokenAmount } from "@/services/slices/tokenSlice";
import { RootState } from "@/services/store";
import { format4Units } from "@/utils/formatter";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
const SelectedToken = ({
  loadingBal,
  selectedToken,
  selectedTokenBal,
  setShowTokensList,
}: {
  loadingBal: boolean;
  selectedToken: any;
  selectedTokenBal: bigint;
  setShowTokensList: (val: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const { srcTokenAmount } = useSelector((state: RootState) => state.token);
  const formattedBal =
    !loadingBal &&
    format4Units(selectedTokenBal, selectedToken?.decimals ?? 18);
  return (
    <div>
      <div className="border rounded-xl flex gap-3 justify-between p-3 w-[500px] mx-auto">
        <div className="border flex-1 flex items-center justify-center rounded-xl p-2">
          <input
            type="number"
            className="focus:outline-none w-full bg-transparent text-[40px]"
            placeholder="0.00"
            value={srcTokenAmount}
            onChange={(e: { target: { value: string } }) =>
              dispatch(setSrcTokenAmount(e.target.value))
            }
          />
        </div>
        <div className="flex flex-col gap-2 justify-center items-start w-[200px]">
          {selectedToken ? (
            <>
              <div
                className="cursor-pointer gap-3 flex justify-center items-center border px-3 py-2 rounded"
                onClick={() => setShowTokensList(true)}
              >
                <img
                  alt={selectedToken?.symbol + " logo"}
                  src={selectedToken?.logo}
                  className="w-8 h-8 rounded-full border"
                />
                {selectedToken?.symbol}
              </div>
              <div>
                Balance:{" "}
                {loadingBal ? (
                  <span className="w-20 h-10 bg-gray-400"> {"     "}</span>
                ) : (
                  <span>{formattedBal}</span>
                )}
              </div>
            </>
          ) : (
            <>
              <div
                className="cursor-pointer gap-3 flex justify-center items-center border px-3 py-2 rounded"
                onClick={() => setShowTokensList(true)}
              >
                <Image
                  alt={"unknown logo"}
                  src={UnknownSVG}
                  className="w-8 h-8 rounded-full border"
                />
                Select
              </div>
              <div>
                Balance:{" "}
                {loadingBal ? (
                  <span className="w-20 h-10 bg-gray-400"> {"     "}</span>
                ) : (
                  <span>{formattedBal}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedToken;
