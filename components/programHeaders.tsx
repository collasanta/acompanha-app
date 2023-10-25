'use client'
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react"
import { useState } from "react"
import { programsFrontEndListType } from "@/types/programs";
import { Button } from "./ui/button";
import Link from "next/link";
import { checkpointType } from "@/types/checkpoints";
import manifest from "../public/manifest.json";
import { formatDateToDdMmYy } from "@/lib/utils";
import Image from "next/image";
import Notifications from "./PWA/WebPush/WebPushNotifications";

export const ProgramHeader = (
    { program, collapsed = false, programPage = false, checkpoints }: { program: programsFrontEndListType, collapsed?: boolean, programPage?: boolean, checkpoints: Array<checkpointType> }
) => {
    const [isOpen, setIsOpen] = useState(collapsed);

    function handleClick() {
        setIsOpen(!isOpen);
    }

    let lastDietPlanUrl = null;
    let lastTrainingPlanUrl = null;
    getPlansUrl()
    function getPlansUrl() {
        checkpoints.forEach(checkpoint => {
            if (checkpoint.dietPlanUrl !== null && checkpoint.dietPlanUrl !== "") {
                lastDietPlanUrl = checkpoint.dietPlanUrl;
            }
            if (checkpoint.trainingPlanUrl !== null && checkpoint.trainingPlanUrl !== "") {
                lastTrainingPlanUrl = checkpoint.trainingPlanUrl;
            }
        });
    }

    return (
        <div className="bg-secondary w-full flex justify-center ">
            <div className=" flex flex-col shadow-md w-full max-w-[550px] rounded-tr-[50px] w-full bg-transparent border border-[3px] text-card-foreground text-[13px]">
                <div onClick={handleClick} className="flex items-center justify-center cursor-pointer ">
                    <div className="flex justify-center  min-w-[78px] h-full bg-white">
                        <Image  width={70} height={70} alt="logo" src="/logo-vazado.png"/>
                    </div>
                    <div className="flex flex-col border-l-2 border-dashed w-full py-2 bg-[#fcfdff] rounded-tr-[50px]">
                        <div className="flex flex-row justify-between  h-[25px]">
                            <p className="pl-4 sm:pl-6 align-text-bottom font-semibold max-w-[220px]  text-muted-foreground text-sm text-start whitespace-break-spaces"
                            >
                                {program.client.name}
                            </p>
                            <div className="mr-8">
                                {
                                    isOpen ? <MinusCircleIcon className="w-5 h-5 transform rotate-180 align-bottom" color="#999999" /> : <PlusCircleIcon className="w-5 h-5" color="#999999" />
                                }
                            </div>

                        </div>
                        <div className=" flex flex-row h-[25px] border-t-2 border-dashed justify-between">
                            <p className="pt-1 pl-4 sm:pl-6  text-muted-foreground text-sm text-start max-w-[220px] sm:max-w-[500px] truncate"
                            >
                                {program.name}
                                {/* {program.client.name.length > 22 ? program.client.name.substring(0, 22) + "..." : program.client.name} */}
                            </p>
                            <div className="mr-8">
                            <Notifications programId={program.id}/>
                            </div>
                        </div>
                    </div>

                </div>

                {isOpen && (
                    <>
                        <div className="flex flex-col">


                            {/* INICIO / FIM / DURACAO */}
                            <div className="flex justify-center border-t-4 py-2 ">
                                <div className="flex flex-row justify-center text-start">
                                    <div className="mr-2 flex bg-white rounded-lg">
                                        <div className="w-[40px] ml-2">
                                            <a className="font-[500] text-muted-foreground">Início: </a>
                                        </div>
                                        <div className="text-muted-foreground mr-2">
                                            <a>{formatDateToDdMmYy(program.start_date)}</a>
                                        </div>
                                    </div>
                                    <div className="mr-2 flex  bg-white rounded-lg text-muted-foreground">
                                        <div className="w-[30px] ml-2">
                                            <a className="font-[500]">Fim: </a>
                                        </div>
                                        <div className="text-muted-foreground mr-2">
                                            <a>{formatDateToDdMmYy(program.end_date)}</a>
                                        </div>

                                    </div>
                                    <div className="mr-2 flex  bg-white rounded-lg">
                                        <div className="w-[60px] ml-2">
                                            <a className="font-[500] text-muted-foreground">Duração: </a>
                                        </div>
                                        <div className=" text-muted-foreground mr-2">
                                            <a>{program.duration} Dias</a>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* INSTRUÇÕES */}
                            {/* <div className="flex justify-center border-t-2 border-dashed py-2">
                                <a className="font-[500] text-muted-foreground">Instruções </a>
                            </div> */}

                            {
                                // (lastDietPlanUrl || lastTrainingPlanUrl) && (
                                //     <div className="mt-2 text-center flex flex-col  justify-center border bg-muted border-black/5 rounded-lg p-2">
                                //         <div className="flex items-center justify-center space-x-8 font-semibold text-muted-foreground text-sm pr-2 text-center whitespace-break-spaces ">
                                //             {
                                //                 lastTrainingPlanUrl && (
                                //                     <Link href={lastTrainingPlanUrl}>
                                //                         <Button size='sm' variant='link' className="shadow-md text-sm bg-white shadow-sm">
                                //                             Baixar Treino 💪
                                //                         </Button>
                                //                     </Link>
                                //                 )
                                //             }
                                //             {
                                //                 lastDietPlanUrl && (
                                //                     <Link href={lastDietPlanUrl}>
                                //                         <Button size='sm' variant='link' className="shadow-md text-sm bg-white shadow-sm">
                                //                             Baixar Dieta 🥦
                                //                         </Button>
                                //                     </Link>
                                //                 )
                                //             }
                                //         </div>
                                //     </div>
                                // )
                            }
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}