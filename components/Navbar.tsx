import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between gap-6 p-8">
      <div
        onClick={() => router.push("/")}
        className="text-black cursor-pointer dark:text-white font-bold uppercase"
      >
        Token Trust
      </div>
      <div>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
