"use client";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderSearch, Settings } from "lucide-react";
import { usePathname } from "next/navigation"
import { Montserrat } from "next/font/google";
const font = Montserrat({ weight: '600', subsets: ['latin'] });

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-emerald-500"
    },
    {
        label: "Cadastro",
        icon: FolderSearch,
        href: "/cadastro",
        color: "text-emerald-500"
    },
    {
        label: "Configurações",
        icon: Settings,
        href: "/configuracoes",
        color: "text-emerald-500"
    },
]

const Sidebar = ({
    setIsOpen = () => { null }
}: { setIsOpen?: any }) => {
    const pathname = usePathname()
    return (
        <>
            <div className="space-y-4 py-4 flex flex-col h-full bg-secondary text-white ">
                <div className="px-3 py-2 flex-1">
                    <Link href="/dashboard" className="flex items-center mx-auto  mb-10">
                        <div className="relative w-[80px] h-[80px] bg-white rounded-full ">
                            <Image src="/logo.png" fill alt="logo" className="rounded-lg" />

                        </div>
                        <h1 className={cn("pl-4 font-extrabold text-transparent text-[23px] bg-clip-text  bg-gradient-to-r from-emerald-600 to-teal-400", font.className)}>
                            Diário.Fit
                        </h1>
                    </Link>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Link href={route.href} onClick={() => setIsOpen(false)}
                                key={route.href} className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer   hover:bg-muted rounded-lg transition",
                                    pathname === route.href ? "text-white bg-emerald-500 hover:text-white hover:bg-emerald-500" : "text-gray-600"
                                )}>
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("w-5 h-5 mr-3", pathname === route.href ? "#ffffff" : route.color)} />
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