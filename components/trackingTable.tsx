'use client'

import { formatDateToDdMmYy } from "@/lib/utils";
import { DailyDataType, DailyDataTypeArr, enabledMetricsType } from "@/types/programs";
import { Button } from "./ui/button";
import { setDiet } from "@/lib/programs";

export const TrackingTable = ({ Days, enabledMetrics }: { Days: DailyDataTypeArr, enabledMetrics: enabledMetricsType }) => {
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0);

    return (
        <>
            <div className="flex justify-center max-w-[750px] mx-auto w-full">
                <div className="max-w-[550px] border border-black/5 rounded-lg w-full">
                    <div className="flex flex-col w-full">

                        {/* CABEÇALHO */}
                        <div className={`w-full sticky top-0 font-semibold space-x-4 bg-muted flex p-1 text-muted-foreground border-b border-black/5 justify-between text-center`}>
                            <div className="bg-gray text-center rounded-lg w-[90px]">Dia</div>
                            {enabledMetrics.dieta && <div className="w-[50px]">Dieta</div>}
                            {enabledMetrics.treino && <div className="w-[50px]">Treino</div>}
                            {enabledMetrics.peso && <div className="w-[50px]">Peso</div>}
                            <div className="min-w-[50px] mr-1">Notas</div>
                        </div>

                        {/* DIAS */}

                        {
                            Days.map((day: DailyDataType) => {
                                const notFuture = day.date.getTime() < Date.now()
                                return (
                                    <>
                                        <div key={day.date.toDateString()} className={`flex flex-row space-x-4 border-b border-black/1  justify-between text-center ${day.date > currentDate || day.date < currentDate ? "bg-[#f1f1f1]" : ""}`}>
                                            <div className={`text-center min-w-[90px] min-h-[30px] text-sm text-muted-foreground `}>{formatDateToDdMmYy(day.date)}</div>
                                            
                                            {enabledMetrics.dieta && notFuture &&
                                                <Button
                                                    onClick={() => setDiet(day.date, day.programId, !day.diet)}
                                                    className={`w-[50px] bg-secondary my-auto cursor-pointer text-center
                                             ${day.diet === true ? "bg-[#059669]" : "bg-[#ff6961]"}`}>
                                                    {day.diet}
                                                </Button>}

                                            {enabledMetrics.treino && notFuture &&
                                                <Button
                                                    className={`w-[50px] bg-secondary my-auto cursor-pointer text-center
                                                ${day.exercise === true ? "bg-[#059669]" : day.exercise === null ? "bg-secondary" : "bg-[#ff6961]"}`}>
                                                    {day.exercise}
                                                </Button>}

                                            {enabledMetrics.peso && notFuture &&
                                                <input
                                                    placeholder={day.weight?.toString()}
                                                    className={`w-[50px] text-black rounded-md align-middle cursor-pointer text-center
                                                ${day.weight ? "bg-[#059669] placeholder-white" : day.weight === null ? "bg-secondary" : "bg-[#ff6961]"}`}>
                                                    
                                                </input>}

                                            {enabledMetrics.peso && notFuture &&
                                                <Button className={`w-[50px]  bg-muted rounded-lg cursor-pointer text-center p-1
                                                ${day.notes ? "bg-[#059669]" : "bg-secondary"}`}>
                                                    ✍
                                                </Button>
                                            }
                                        </div>
                                    </>
                                )
                            })
                        }

                        {/* {
                            Days.map((day: DailyDataType, index: number) => {

                            }
                            )
                        } */}

                    </div>
                </div>
            </div>
        </>
    )
}