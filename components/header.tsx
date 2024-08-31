"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Wallet } from "./wallet";
import Link from "next/link";
import { useState } from "react";
import { accountState } from "@/atom/account";
import { useRecoilValue } from "recoil";

export const Header: React.FC = () => {
  const router = useRouter();
  const account = useRecoilValue(accountState);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="z-10 w-full px-10 py-5 flex items-center justify-between font-mono text-sm">
      <Link href={"/"}>
        <h1 className="font-mono text-md font-extrabold">ripplemarket</h1>
      </Link>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="cursor-pointer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Menu Items */}
      <div
        className={`flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-5 ${
          isMenuOpen ? "block" : "hidden"
        } lg:block`}
      >
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
            router.push("/charge");
          }}
        >
          Charge XRP
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            router.push("/my-buy");
          }}
        >
          My Buy
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            router.push("/my-sell");
          }}
        >
          My Sell
        </Button>
        <Wallet />
      </div>
    </div>
  );
};
