"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Wallet } from "./wallet";
import Link from "next/link";

export const Header: React.FC = () => {
  const router = useRouter();
  return (
    <div className="z-10 w-full px-10 py-5 items-center justify-between font-mono text-sm lg:flex">
      <Link href={"/"}>
        <h1 className="font-mono  text-md font-extrabold">ripplemarket</h1>
      </Link>
      <div className="flex space-x-5">
        <Button
          variant="ghost"
          onClick={() => {
            router.push("/sell");
          }}
        >
          Sell
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            router.push("/my");
          }}
        >
          My
        </Button>
        <Wallet />
      </div>
    </div>
  );
};
