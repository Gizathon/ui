import { createSlice } from "@reduxjs/toolkit";
import { Address } from "viem";

export type TokenReducer = {
  token: {
    contract: Address;
    chainId: number;
    symbol: string;
    decimals: number;
    name: string;
    coinKey: string;
    logo: string;
    price: number;
    balance?: number;
  };
  canBeRugged?: boolean;
  srcTokenAmount: string;
};
const initialState: TokenReducer = {
  token: {
    contract: "0x",
    chainId: 1,
    symbol: "",
    decimals: 18,
    name: "",
    coinKey: "",
    logo: "",
    price: 0,
  },
  srcTokenAmount: "",
};

export const token = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setCanBeRugged: (state, action) => {
      state.canBeRugged = action.payload;
    },
    setSrcTokenAmount: (state, action) => {
      state.srcTokenAmount = action.payload;
    },
  },
});

export const { setToken, setCanBeRugged, setSrcTokenAmount } = token.actions;

export default token.reducer;
