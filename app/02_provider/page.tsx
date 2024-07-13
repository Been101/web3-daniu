"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useSyncProviders } from "@/app/hooks/useSyncProviders";

export default function Home() {
  const [balance, setBalance] = useState<string>("");
  const providers = useSyncProviders();
  console.log("providers", providers);
  const main = async () => {
    const { provider } =
      providers.find((p) => p.info.name === "MetaMask") || {};
    if (provider) {
      const p = new ethers.BrowserProvider(provider);
      console.log("provider1", p?.isMetaMask);
      console.log("provider2", provider?.isMetaMask);

      const a = await provider.request({
        method: "eth_requestAccounts",
        params: [],
      });

      console.log("a121", a);
    }

    console.log("window.ethereum.isMetaMask", window.ethereum.isMetaMask);

    // const balance = await provider.getBalance(`vitalik.eth`);
    // console.log("balance", balance);
    // setBalance(ethers.formatEther(balance));
    // const accounts = await provider // Or window.ethereum if you don't support EIP-6963.
    //   .request({ method: "eth_requestAccounts" })
    //   .catch((err) => {
    //     if (err.code === 4001) {
    //       // EIP-1193 userRejectedRequest error.
    //       // If this happens, the user rejected the connection request.
    //       console.log("Please connect to MetaMask.");
    //     } else {
    //       console.error(err);
    //     }
    //   });
    // const account = accounts[0];
  };

  useEffect(() => {
    main();
  }, [providers.length]);

  return (
    <main className="flex min-h-screen flex-col items-center">
      {providers.map((p) => {
        return (
          <div key={p.info.uuid} className="flex items-center">
            <img className="w-20 h-20" src={p.info.icon} alt="" />
            <div key={p.info.name}>{p.info.name}</div>
          </div>
        );
      })}
    </main>
  );
}
