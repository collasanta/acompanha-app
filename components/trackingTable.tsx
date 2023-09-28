'use client'

import { formatDateToDdMmYy } from "@/lib/utils";
import { DailyDataType, DailyDataTypeArr, enabledMetricsType } from "@/types/programs";
import { Button } from "./ui/button";
import { setDiet, setExercise, setNotes, setWeight } from "@/lib/programs";
import { JsonValue } from "@prisma/client/runtime/library";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "@/components/ui/textarea"


export const TrackingTable = ({ Days, enabledMetrics }: { Days: DailyDataTypeArr, enabledMetrics: JsonValue }) => {
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0);
    
    const EnabledMetrics = enabledMetrics as unknown as enabledMetricsType

    return (
        <>
            <div className="flex justify-center max-w-[750px] mx-auto w-full">
                <div className="max-w-[550px] border border-black/5 rounded-lg w-full">
                    <div className="flex flex-col w-full">

                        {/* CABEÇALHO */}
                        <div className={`w-full sticky top-0 font-semibold bg-muted flex p-1 text-muted-foreground border-b border-black/5 justify-between text-center`}>
                            <div className="bg-gray text-center rounded-lg w-[80px]">Dia</div>
                            {EnabledMetrics.dieta && <div className="w-[50px] ">Dieta</div>}
                            {EnabledMetrics.treino && <div className="w-[50px] ">Treino</div>}
                            {EnabledMetrics.peso && <div className="w-[50px] ">Peso</div>}
                            <div className="min-w-[70px]">Notas</div>
                        </div>

                        {/* DIAS */}

                        {
                            Days.map((day: DailyDataType) => {
                                const notFuture = day.date.getTime() < Date.now()
                                return (
                                    <>
                                        <div key={day.date.toDateString()} className={`flex flex-row border-b border-black/1  justify-between text-center ${day.date > currentDate || day.date < currentDate ? "bg-muted" : "bg-[white]"}`}>

                                            <div className={`text-center flex items-center justify-center min-w-[80px] min-h-[30px] text-sm text-muted-foreground `}>{formatDateToDdMmYy(day.date)}</div>

                                            {EnabledMetrics.dieta && notFuture &&
                                                <Button
                                                    variant={"trackingtable"}
                                                    onClick={() => setDiet(day.date, day.programId, !day.diet)}
                                                    className={`w-[50px] bg-secondary my-auto cursor-pointer text-center
                                                    ${day.diet ? "bg-[#10B77F] placeholder-white text-white" : day.diet === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : "bg-muted" : "bg-[#ff6961]"}`}>
                                                    {day.diet}
                                                </Button>}

                                            {EnabledMetrics.treino && notFuture &&
                                                <Button
                                                    variant={"trackingtable"}
                                                    onClick={() => setExercise(day.date, day.programId, !day.exercise)}
                                                    className={`w-[50px] bg-secondary my-auto cursor-pointer text-center
                                                    ${day.exercise ? "bg-[#10B77F] placeholder-white text-white" : day.exercise === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : "bg-muted" : "bg-[#ff6961]"}`}>
                                                    {day.exercise}
                                                </Button>}

                                            {EnabledMetrics.peso && notFuture &&
                                                <input
                                                    type="string"
                                                    placeholder={day.weight?.toString()}
                                                    onBlur={(e) => setWeight(day.date, day.programId, e.target.value)}
                                                    className={`w-[50px] text-black text-sm rounded-md align-middle cursor-pointer text-center
                                                ${day.weight ? "bg-[#b5ffeb] placeholder-gray-600 text-gray-600" : day.weight === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : "bg-muted" : "bg-[#ff6961]"}`}>

                                                </input>}

                                            {EnabledMetrics.peso && notFuture &&
                                                <Popover>
                                                    <PopoverTrigger type="button" className="w-[70px]">
                                                        <Button
                                                            variant={"trackingtable"}
                                                            className={` w-[50px]  bg-muted rounded-lg cursor-pointer text-center p-1
                                                ${day.notes ? "bg-[#b5ffeb]" : "bg-secondary"}`}>
                                                            📝
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                    <Textarea
                                                        onBlur={(e) => setNotes(day.date, day.programId, e.target.value, day.notes!)}
                                                        placeholder="digite como foi seu dia aqui"
                                                        
                                                    >
                                                        {day.notes}
                                                    </Textarea>
                                                    </PopoverContent>
                                                </Popover>
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