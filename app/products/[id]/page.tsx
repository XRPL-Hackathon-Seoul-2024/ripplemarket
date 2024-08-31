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
import crypto from "crypto";
import { newPreimageSha256 } from 'five-bells-condition';
import {IProvider} from "@web3auth/base";
import {isoTimeToRippleTime, xrpToDrops} from "xrpl";

export default function Home() {
  const params = useParams();
  const { id } = params as { id: string };
  const balance = useRecoilValue(balanceState);
  const { data: product } = useProduct(id);
  const [provider, setProvider] = useState<IProvider | null>(null);
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

  const onEscrowSendTransaction = useCallback(async () => {
    try {
      const accounts:any = await provider?.request<string[]>({
        method: "xrpl_getAccounts",
      });
      const preimageData = crypto.randomBytes(32);

      // Create a new PreimageSha256 fulfillment
      const myFulfillment:any = newPreimageSha256();
      myFulfillment.setPreimage(preimageData);

      // Get the condition in hex format
      const conditionHex = myFulfillment.getConditionBinary().toString('hex').toUpperCase();
      console.log("Condition in hex format: ", conditionHex);

      let finishAfter = new Date((new Date().getTime() / 1000) + (60 * 60)); // 2 minutes from now
      finishAfter = new Date(finishAfter * 1000);
      console.log("This escrow will finish after!!: ", finishAfter);



      if (accounts && accounts.length > 0) {
        const tx = {
          TransactionType: "EscrowCreate",
          Account: accounts[0] as string,
          Amount: xrpToDrops(2),
          Destination: "r3SDwngjcnRic1VSxyeaX7iUUaHEEtAY4J",
          Condition: conditionHex, // SHA-256 해시 조건
          FinishAfter: isoTimeToRippleTime(finishAfter.toISOString()), // Refer for more details: https://xrpl.org/basic-data-types.html#specifying-time
        };
        const txSign:any = await provider?.request({
          method: "xrpl_submitTransaction",
          params: {
            transaction: tx,
          },
        });

        console.log("txRes", txSign);
        console.log("txRes.result.tx_json.OfferSequence :", txSign.result.tx_json.Sequence);
        console.log("condition : ", conditionHex);
        console.log("fullfillment : ", myFulfillment.serializeBinary().toString('hex').toUpperCase());
        // Extract the OfferSequence from the transaction result

        // Check the result of the transaction submission
        const txHash = txSign.result.tx_json.hash; // Extract transaction hash from the response
        console.log("Transaction Hash:", txHash);

      } else {
        console.log("failed to fetch accounts");
      }
    } catch (error) {
      console.log("error", error);
    }

  }, []);

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
              <Button onClick={onEscrowSendTransaction}>Escrow Buy</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
