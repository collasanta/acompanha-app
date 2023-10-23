'use client'
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react"
import { useState } from "react"
import { programsFrontEndListType } from "@/types/programs";
import { Button } from "./ui/button";
import Link from "next/link";
import { checkpointType } from "@/types/checkpoints";
import manifest from "../public/manifest.json";

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
        <div className="bg-white w-full flex justify-center mt-[5px]">
            <div className=" flex flex-col py-2 sm:py-4 shadow-md w-full max-w-[550px] rounded-tr-[50px] w-full bg-white border border-[3px] border-b-1 text-card-foreground text-[13px]">
                <div onClick={handleClick} className="flex items-center justify-start cursor-pointer mr-6">
                    <div className="flex md:flex-row items-center gap-x-2 truncate">
                        {/* <div className="w-fit bg-emerald-500/10 rounded-full">
                        <Image src={program.videoInfos.videoThumb} width={112} height={64} alt="thumbnail" className="rounded-md"/>
                    </div> */}
                    </div>
                    <div className="w-[80px] flex justify-center">
                        {
                            isOpen ? <MinusCircleIcon className="w-5 h-5 transform rotate-180" color="#999999" /> : <PlusCircleIcon className="w-5 h-5" color="#999999" />
                        }
                    </div>
                    <div className="flex flex-col pl-2 py-2 sm:py-0">
                        <div className="flex flex-row h-[25px]">
                            <p className="font-semibold w-[80px] text-muted-foreground text-sm text-start whitespace-break-spaces"
                            >
                                Paciente:
                            </p>
                            <p className=" text-muted-foreground text-sm text-start max-w-[180px] sm:max-w-[500px] truncate"
                            >
                            { program.client.name}aaaa
                             {/* {program.client.name.length > 22 ? program.client.name.substring(0, 22) + "..." : program.client.name} */}
                            </p>
                        </div>
                        <div className="flex flex-row h-[25px]">
                            <p className="font-semibold  w-[80px] text-muted-foreground text-sm text-start whitespace-break-spaces"
                            >
                                Programa:
                            </p>
                            <p className="text-sm text-muted-foreground text-start max-w-[180px] sm:max-w-[500px] truncate">
                                { program.name}
                                {/* {program.name.length > 22 ? program.name.substring(0, 22) + "..." : program.name} */}
                            </p>
                        </div>
                    </div>

                </div>
                {isOpen && (
                    <>
                        <div className="my-2 flex justify-center border-t-2  ">
                            <div className="flex flex-row items-center text-center space-x-6">
                                <div className="bg-white p-2 rounded-lg">
                                    <div className="">
                                        <a className="font-[500] text-muted-foreground ">Data Início: </a>
                                    </div>
                                    <div className="text-muted-foreground">
                                        <a>{program.start_date.toISOString().split("T")[0]}</a>
                                    </div>
                                </div>
                                <div className="bg-white p-2 rounded-lg text-muted-foreground">
                                    <div className="">
                                        <a className="font-[500] ">Data Fim: </a>
                                    </div>
                                    <div className="text-muted-foreground">
                                        <a>{program.end_date.toISOString().split("T")[0]}</a>
                                    </div>

                                </div>
                                <div className="bg-white p-2 rounded-lg">
                                    <div className="col-span-1">
                                        <a className="font-[500] text-muted-foreground">Duração: </a>
                                    </div>
                                    <div className="col-span-1 text-muted-foreground">
                                        <a>{program.duration} Dias</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {
                            (lastDietPlanUrl || lastTrainingPlanUrl) && (
                                <div className="mt-2 text-center flex flex-col  justify-center border bg-muted border-black/5 rounded-lg p-2">
                                    <div className="flex items-center justify-center space-x-8 font-semibold text-muted-foreground text-sm pr-2 text-center whitespace-break-spaces ">
                                        {
                                            lastTrainingPlanUrl && (
                                                <Link href={lastTrainingPlanUrl}>
                                                    <Button size='sm' variant='link' className="shadow-md text-sm bg-white shadow-sm">
                                                        Baixar Treino 💪
                                                    </Button>
                                                </Link>
                                            )
                                        }
                                        {
                                            lastDietPlanUrl && (
                                                <Link href={lastDietPlanUrl}>
                                                    <Button size='sm' variant='link' className="shadow-md text-sm bg-white shadow-sm">
                                                        Baixar Dieta 🥦
                                                    </Button>
                                                </Link>
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </>
                )}
            </div>
        </div>
    )
}