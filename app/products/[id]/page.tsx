"use client";
import pb from "@/api/pocketbase";
import { balanceState } from "@/atom/balance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useProduct from "@/hooks/useProduct";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useRecoilValue } from "recoil";

export default function Home() {
  const params = useParams();
  const { id } = params as { id: string };
  const balance = useRecoilValue(balanceState);
  const { data: product } = useProduct(id);
  const [count, setCount] = useState("1");
  const [tip, setTip] = useState("10");

  const price = () => {
    if (!product) {
      return 0;
    }
    const price = +product.price;
    const cnt = +count;
    const percent = +tip;

    const amount = price * cnt + (price * cnt * percent) / 100;

    return amount;
  };

  const onSendTransaction = useCallback(() => {
    if (!product) {
      return;
    }
  }, [product, count, tip]);

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-green-500">
      {product && (
        <div className="z-10 w-full max-w-md font-mono text-white space-y-5">
          <Image src={product.image} width={500} height={500} alt={""} />
          <Badge variant="secondary" className="text-2xl">
            {product.state}
          </Badge>
          <h1 className="text-2xl font-extrabold">{product.name}</h1>
          <h1>{product.description}</h1>

          <div className="space-y-5">
            <h1>Price : {product.price} XRP</h1>
            <h1>Available : {balance} XRP</h1>

            <div className="flex space-x-4">
              <Button onClick={onSendTransaction}>Buy</Button>
              <Button onClick={onSendTransaction}>Escrow Buy</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
