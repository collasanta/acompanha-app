"use client";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Users, LayoutDashboard, FolderSearch, Settings, Dumbbell, UtensilsCrossed, UserRoundPlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { Montserrat } from "next/font/google";
const font = Montserrat({ weight: '600', subsets: ['latin'] });

const routes = [
    {
        label: "Clientes",
        icon: Users,
        href: "/clients",
        color: "text-emerald-500",
        subitems: [
            {
                label: "Cadastro",
                icon: UserRoundPlus,
                href: "/clients/cadastro",
                color: "text-emerald-500"
            },
            {
                label: "Treino",
                icon: Dumbbell,
                href: "/treinos",
                color: "text-emerald-500"
            },
            {
                label: "Dieta",
                icon: UtensilsCrossed,
                href: "/dietas",
                color: "text-emerald-500"
            },
        ]
    },
    // {
    //     label: "Diários",
    //     icon: LayoutDashboard,
    //     href: "/diarios",
    //     color: "text-emerald-500"
    // },
    // {
    //     label: "Cadastro Diários",
    //     icon: FolderSearch,
    //     href: "/cadastro-diarios",
    //     color: "text-emerald-500"
    // },
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
    const pathname = usePathname();
    return (
        <>
            <div className="space-y-4 py-4 flex flex-col h-full bg-secondary text-white">
                <div className="px-3 py-2 flex-1">
                    <Link href="/dashboard" className="flex items-center mx-auto mb-10">
                        <div className="relative w-[80px] h-[80px] bg-white rounded-full">
                            <Image src="/logo.png" fill alt="logo" className="rounded-lg shadow-lg" />
                        </div>
                        <h1 className={cn("pl-4 font-extrabold text-transparent text-[23px] bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400", font.className)}>
                            Inteli.Fit
                        </h1>
                    </Link>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <div key={route.href}>
                                <Link href={route.href} onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-muted rounded-lg transition  hover:text-white hover:bg-emerald-500",
                                        pathname.includes(route.href.split("/")[1]) ? "text-white bg-emerald-500" : "text-gray-600"                                    )}>
                                    <div className="flex items-center flex-1">
                                    <route.icon className={cn(
        "w-5 h-5 mr-3",
        pathname.includes(route.href.split("/")[1]) ? "#ffffff" : route.color,
        "group-hover:text-white"
    )} />
                                        {route.label}
                                    </div>
                                </Link>
                                {pathname.includes(route.href.split("/")[1]) && route.subitems && route.subitems.map((subitem) => (
                                    <Link href={subitem.href} onClick={() => setIsOpen(false)}
                                        key={subitem.href} className={cn(
                                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition text-gray-600",
                                            pathname === subitem.href && " bg-emerald-100",
                                            "w-[95%] ml-auto hover:bg-emerald-100"
                                        )}>
                                        <div className="flex items-center flex-1">
                                            <subitem.icon className={cn("w-5 h-5 mr-3", pathname === subitem.href ? "#ffffff" : subitem.color)} />
                                            {subitem.label}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;