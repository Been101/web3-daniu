"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
export default function Home() {
  const [balance, setBalance] = useState<string>("");

  const main = async () => {
    const provider = ethers.getDefaultProvider();
    const balance = await provider.getBalance(`ethers.eth`);
    console.log("balance", balance);
    setBalance(ethers.formatEther(balance));
  };

  useEffect(() => {
    main();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      ETH Balance of ethers: {balance} ETH
    </main>
  );
}
