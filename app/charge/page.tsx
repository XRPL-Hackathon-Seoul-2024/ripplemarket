import { SellProduct } from "@/components/sell-product";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-20 bg-green-500">
      <div className="z-10 w-full font-mono mt-10 text-white space-x-10">
        <Button>Fiat On Ramp</Button>

        <Button>Swap</Button>

        <Button>Bridge From The Root Network</Button>
      </div>
    </main>
  );
}
