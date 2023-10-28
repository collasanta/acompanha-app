'use client'
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react"
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
        <div onClick={handleClick} className="flex shadow-sm rounded-sm sm:py-4 sm:px-2 py-1 px-3 flex-col border mx-auto max-w-[550px] w-full bg-secondary border border-0 text-card-foreground text-[13px] hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-between ">
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
                                    <div className="font-[500] ">Data Início: </div>
                                </div>
                                <div className="text-muted-foreground">
                                    <div>{program.start_date.toISOString().split("T")[0]}</div>
                                </div>
                            </div>
                            <div>
                                <div className="">
                                    <div className="font-[500] ">Data Fim: </div>
                                </div>
                                <div className="text-muted-foreground">
                                    <div>{program.end_date.toISOString().split("T")[0]}</div>
                                </div>

                            </div>
                            <div>
                                <div className="col-span-1">
                                    <div className="font-[500] ">Duração: </div>
                                </div>
                                <div className="col-span-1 text-muted-foreground">
                                    <div>{program.duration} Dias</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        !programPage && (
                            <div>
                                <div className="mt-2 text-center flex flex-col  justify-center border bg-card border-black/5 rounded-lg p-2">
                                    <div className="font-[500]">Métricas Acompanhadas</div>
                                    <div className="flex text-center">
                                        {Object.entries(program?.enabled_metrics!).map(([metricName, metricValue], index) => {
                                            if (metricValue === true) {
                                                return (
                                                    <div className="text-center text-muted-foreground mx-auto mt-1">
                                                        <div className="font-[500] capitalize">{metricName} </div>
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
                                <div className="font-[500]">Link de Acompanhamento</div>
                                <div className="flex text-center text-center mx-auto text-cyan-600">
                                    <Link href={"/p/" + program.id}>
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