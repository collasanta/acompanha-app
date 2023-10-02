'use client'
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react"
import { useState } from "react"
import { programsFrontEndListType } from "@/types/programs";
import { Button } from "./ui/button";
import Link from "next/link";
import { checkpointType } from "@/types/checkpoints";

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
        <div className="bg-white mt-[10px] w-full flex justify-center">
            <div className="flex flex-col py-2 shadow-md border w-full mx-[5px] max-w-[550px] w-full bg-muted border border-0 text-card-foreground text-[13px] py-1 px-1">
                <div onClick={handleClick} className="flex items-center justify-between cursor-pointer">
                    <div className="flex md:flex-row items-center gap-x-2 truncate">
                        {/* <div className="w-fit bg-emerald-500/10 rounded-full">
                        <Image src={program.videoInfos.videoThumb} width={112} height={64} alt="thumbnail" className="rounded-md"/>
                    </div> */}
                    </div>
                    <div className="flex flex-col sm:flex-row">
                        <p className="font-semibold text-muted-foreground text-sm pr-2 text-center whitespace-break-spaces"
                        >
                            📝 {program.client.name.length > 30 ? program.client.name.substring(0, 30) + "..." : program.client.name}
                        </p>
                        <p className="text-sm text-muted-foreground text-center">
                            {program.name.length > 30 ? program.name.substring(0, 30) + "..." : program.name}
                        </p>
                    </div>
                    <div className="pr-4">
                        {
                            isOpen ? <MinusCircleIcon className="w-5 h-5 transform rotate-180" color="#52525b" /> : <PlusCircleIcon className="w-5 h-5" color="#52525b" />
                        }
                    </div>
                </div>
                {isOpen && (
                    <>
                        <div className="mt-2 flex justify-center rounded-lg p-2 border bg-muted border-black/5 ">
                            <div className="flex flex-row items-center text-center space-x-6">
                                <div className="bg-white p-2 rounded-lg">
                                    <div className="">
                                        <a className="font-[500] ">Data Início: </a>
                                    </div>
                                    <div className="text-muted-foreground">
                                        <a>{program.start_date.toISOString().split("T")[0]}</a>
                                    </div>
                                </div>
                                <div className="bg-white p-2 rounded-lg">
                                    <div className="">
                                        <a className="font-[500] ">Data Fim: </a>
                                    </div>
                                    <div className="text-muted-foreground">
                                        <a>{program.end_date.toISOString().split("T")[0]}</a>
                                    </div>

                                </div>
                                <div className="bg-white p-2 rounded-lg">
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