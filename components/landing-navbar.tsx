"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs";
import { redirect } from 'next/navigation'
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const font = Montserrat({ weight: '600', subsets: ['latin'] });

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    redirect("/dashboard");
  }

  return (
    <nav className="p-4 bg-white flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative w-16 h-16">
          <Image fill alt="Logo" src="/logo.png" />
        </div>
        <h1 className={cn("font-extrabold text-transparent text-lg bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-100", font.className)}>
          acompanha.app
        </h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button variant="outline" className="rounded-full text-gray-500">
            Entrar
          </Button>
        </Link>
      </div>
    </nav>
  )
}