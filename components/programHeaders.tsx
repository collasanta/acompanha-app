'use client'
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react"
import { useState } from "react"
import { programsFrontEndListType } from "@/types/programs";
import { checkpointType } from "@/types/checkpoints";
import { formatDateToDdMmYy } from "@/lib/utils";
import Image from "next/image";
import Notifications from "./PWA/WebPush/WebPushNotifications";

export const ProgramHeader = (
    { program, collapsed = false, programPage = false }: { program: programsFrontEndListType, collapsed?: boolean, programPage?: boolean, checkpoints?: Array<checkpointType> }
) => {
    const [isOpen, setIsOpen] = useState(collapsed);
    function handleClick() {
        setIsOpen(!isOpen);
    }
    return (
        <div className="bg-white w-full flex justify-center ">
            <div className=" flex flex-col shadow-md w-full max-w-[550px] rounded-tr-[50px] w-full bg-transparent border border-[3px] text-card-foreground text-[13px]">
                <div className="flex items-center justify-center ">
                    <div className="flex justify-center  min-w-[80px] h-full bg-white border-r-2 border-dashed">
                        <Image width={70} height={70} alt="logo" src="/logo-vazado.png" />
                    </div>
                    <div className="flex flex-col w-full py-2 bg-[#fcfdff] rounded-tr-[50px]">
                        <div className="flex flex-row justify-between  h-[25px]">
                            <div className="pl-4 sm:pl-6 align-text-bottom font-semibold max-w-[220px] truncate  text-muted-foreground text-sm text-start whitespace-break-spaces"
                            >
                                {program.client.name}
                            </div>
                            <div className="mr-8 cursor-pointer" onClick={handleClick}>
                                {
                                    isOpen ? <MinusCircleIcon className="w-5 h-5 transform rotate-180 align-bottom" color="#999999" /> : <PlusCircleIcon className="w-5 h-5" color="#999999" />
                                }
                            </div>
                        </div>
                        <div className=" flex flex-row h-[25px] border-t-2 border-dashed  justify-between">
                            <div className="pt-1 pl-4 sm:pl-6  text-muted-foreground text-sm text-start max-w-[220px] sm:max-w-[500px] truncate"
                            >
                                {program.name}
                            </div>
                            <div className="mr-8">
                                <Notifications programId={program.id} />
                            </div>
                        </div>
                    </div>

                </div>

                {isOpen && (
                    <>
                        <div className="flex flex-col">
                            <div className="flex justify-center border-t-4 py-2 ">
                                <div className="flex flex-row justify-center text-start">
                                    <div className="mr-2 flex bg-white rounded-lg">
                                        <div className="w-[40px] ml-2">
                                            <div className="font-[500] text-muted-foreground">Início: </div>
                                        </div>
                                        <div className="text-muted-foreground mr-2">
                                            <div>{formatDateToDdMmYy(program.start_date)}</div>
                                        </div>
                                    </div>
                                    <div className="mr-2 flex  bg-white rounded-lg text-muted-foreground">
                                        <div className="w-[30px] ml-2">
                                            <div className="font-[500]">Fim: </div>
                                        </div>
                                        <div className="text-muted-foreground mr-2">
                                            <div>{formatDateToDdMmYy(program.end_date)}</div>
                                        </div>

                                    </div>
                                    <div className="mr-2 flex  bg-white rounded-lg">
                                        <div className="w-[60px] ml-2">
                                            <div className="font-[500] text-muted-foreground">Duração: </div>
                                        </div>
                                        <div className=" text-muted-foreground">
                                            <div>{program.duration} Dias</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}