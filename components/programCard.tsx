'use client'
import { ArrowDown, MinusCircleIcon, PlusCircleIcon, Pointer } from "lucide-react"
import { useState } from "react"
import { programsFrontEndListType } from "@/types/programs";
import Link from "next/link";

export const ProgramCard = (
    { program, collapsed = false, programPage = false }: { program: programsFrontEndListType, collapsed?: boolean, programPage?: boolean }
) => {

    const [isOpen, setIsOpen] = useState(collapsed);

    function handleClick() {
        setIsOpen(!isOpen);
    }

    return (
        <div className="flex shadow-sm rounded-sm sm:py-4 sm:px-2 py-1 px-3 flex-col border mx-auto max-w-[550px] w-full bg-secondary border border-0 text-card-foreground text-[13px] hover:shadow-lg transition cursor-pointer">
            <div onClick={handleClick} className="flex items-center justify-between ">
                <div className="ml-3 flex md:flex-row items-center gap-x-2 truncate">
                📝
                </div>
                <div className="flex flex-col sm:flex-row">
                    <p className="pr-2 text-center whitespace-break-spaces font-semibold text-muted-foreground text-sm"
                    >
                        {program.client.name.length > 30 ? program.client.name.substring(0, 30) + "..." : program.client.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {program.name.length > 30 ? program.name.substring(0, 30) + "..." : program.name}
                    </p>
                </div>
                <div>
                    {
                                               isOpen ? <MinusCircleIcon className="w-5 h-5 transform rotate-180" color="#52525b" /> : <PlusCircleIcon className="w-5 h-5" color="#52525b" />
                    }
                </div>
            </div>
            {isOpen && (
                <>
                    <div className="mt-2 flex justify-center border bg-card border-black/5 rounded-lg p-2">
                        <div className="flex flex-row items-center text-center space-x-6">
                            <div>
                                <div className="">
                                    <a className="font-[500] ">Data Início: </a>
                                </div>
                                <div className="text-muted-foreground">
                                    <a>{program.start_date.toISOString().split("T")[0]}</a>
                                </div>
                            </div>
                            <div>
                                <div className="">
                                    <a className="font-[500] ">Data Fim: </a>
                                </div>
                                <div className="text-muted-foreground">
                                    <a>{program.end_date.toISOString().split("T")[0]}</a>
                                </div>

                            </div>
                            <div>
                                <div className="col-span-1">
                                    <a className="font-[500] ">Duração: </a>
                                </div>
                                <div className="col-span-1 text-muted-foreground">
                                    <a>{program.duration} Dias</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        !programPage && (
                            <div>
                                <div className="mt-2 text-center flex flex-col  justify-center border bg-card border-black/5 rounded-lg p-2">
                                    <a className="font-[500]">Métricas Acompanhadas</a>
                                    <div className="flex text-center">
                                        {Object.entries(program?.enabled_metrics!).map(([metricName, metricValue], index) => {
                                            if (metricValue === true) {
                                                return (
                                                    <div className="text-center text-muted-foreground mx-auto mt-1">
                                                        <a className="font-[500] capitalize">{metricName} </a>
                                                    </div>

                                                );
                                            }
                                            return null; // Skip false values
                                        })}
                                    </div>
                                </div>
                            </div>

                        )

                    }

                    {
                        !programPage && (
                            <div className="mt-2 text-center flex flex-col  justify-center border bg-card border-black/5 rounded-lg p-2">
                                <a className="font-[500]">Link de Acompanhamento</a>
                                <div className="flex text-center text-center mx-auto text-cyan-600">
                                    <Link href={window.location.origin + "/p/" + program.id}>
                                        {window.location.origin + "/p/" + program.id}
                                    </Link>
                                </div>
                            </div>
                        )
                    }
                </>
            )}
        </div>
    )
}