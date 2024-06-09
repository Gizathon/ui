import React from "react";

const TokenRow = ({ tokenDetails }: { tokenDetails: any }) => {
  return (
    <div>
      <div
        className="flex gap-3 items-center justify-center"
        title={tokenDetails.name}
      >
        <img
          src={tokenDetails.logo}
          className="w-8 h-8 rounded-full border border-gray-400"
        />
        {tokenDetails.name}
      </div>
    </div>
  );
};

export default TokenRow;
