import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-8 bg-gray-400 text-sm p-2 flex items-center justify-center">
        <span className="w-fit ">
          We support only Ethereum mainnet tokens historical data hence please
          ensure your token also exists on Mainnet.
        </span>
      </div>
      <Navbar />
      {children}
      <footer className="fixed right-0 bottom-12 bg-slate-100 py-3 rounded pl-4 pr-20 text-black shadow">
        Made with ❤️ for Gizathon
      </footer>
      <Toaster position="top-center" />
    </div>
  );
}
