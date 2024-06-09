import { formatUnits } from "viem";

export const format4Units = (
  amount: bigint | string | number,
  decimals: number
) => {
  const formattedString = formatUnits(BigInt(amount), decimals);
  const [integerPart, decimalPart] = formattedString.split(".");
  if (!decimalPart) {
    return integerPart;
  }
  if (decimalPart.length < 4) {
    return `${integerPart}.${decimalPart}`;
  }
  const decimalSlice = decimalPart.slice(0, 5);
  const truncated = Math.floor(Number(decimalSlice));
  if (truncated > 0) return `${integerPart}.${decimalSlice}`;
  return integerPart;
};
