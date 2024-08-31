"use client";
import { SellProduct } from "@/components/sell-product";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { trnWeb3auth as web3auth } from "@/utils/trn-web3-auth";
import { useEffect, useState } from "react";
import { IProvider } from "@web3auth/base";
import { set } from "react-hook-form";

export default function Home() {
  const [walletServicesPlugin, setWalletServicesPlugin] =
    useState<WalletServicesPlugin>();
  const [provider, setProvider] = useState<IProvider | null>(null);
  const fiat = async () => {
    if (!walletServicesPlugin) {
      const walletServicesPlugin = new WalletServicesPlugin({
        walletInitOptions: {
          confirmationStrategy: "modal", // pass this to use the UI modal confirmation while signing
        },
      });
      web3auth.addPlugin(walletServicesPlugin);
      setWalletServicesPlugin(walletServicesPlugin);
    }
    await walletServicesPlugin?.showWalletUi();
  };

  const bridge = async () => {};

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center p-20 bg-green-500">
      <div className="z-10 w-full font-mono mt-10 text-white space-y-10">
        <div className="space-x-10">
          <Button onClick={() => fiat()}>Fiat On Ramp</Button>
          <h1>Buy XRP on The Root Network - Fiat On Ramp</h1>
        </div>
        <div className="space-x-10">
          <Button onClick={() => bridge()}>Fiat On Ramp</Button>
          <h1>Move XRP From "The Root Network" To "XRP Ledger"</h1>
        </div>
      </div>
    </main>
  );
}
