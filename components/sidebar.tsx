"use client";
import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderSearch, Settings } from "lucide-react";
import {usePathname} from "next/navigation"

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] })

const routes = [
    {
        label:"Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500"
    },
    {
        label:"Cadastro",
        icon: FolderSearch,
        href: "/cadastro",
        color: "text-emerald-500"
    },
    {
        label:"Settings",
        icon: Settings,
        href: "/settings",
    },
]

const Sidebar = ({
}) => {
    const pathname = usePathname()
    return (
        <>
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#fbfbfb] text-white border-r border-gray-400">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-16 h-16 ">
                        <Image src="/logo.png" fill alt="logo" />
                    </div>
                    <h1 className={cn("font-extrabold text-transparent text-lg bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-100", montserrat.className)}>
                        Acompanha.app
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link href={route.href} key={route.href} className={cn(
                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-gray-500 hover:bg-white/10 rounded-lg transition",
                            pathname === route.href ? "text-white bg-emerald-500" : "text-zinc-400"
                            )}>
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("w-5 h-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}

                </div>
            </div>
        </div>
        </>
    );
}

export default Sidebar;