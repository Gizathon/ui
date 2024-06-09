import React from "react";
import Iframe from "react-iframe";
// zkSync address on Koi -> 0x0000000000000000000000000000000000000001
const Koi = () => {
  const [inputCurrency, setInputCurrency] = React.useState<string>("0x0000000000000000000000000000000000000001");
  const [outputCurrency, setOutputCurrency] = React.useState<string>("");
  return (
    <div className="h-screen w-screen">
      <Iframe
        url={`https://app.koi.finance/widget?inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`}
        width="100%"
        height="100%"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"
      />
    </div>
  );
};

export default Koi;
