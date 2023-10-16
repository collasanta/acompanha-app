'use client'

import { formatDateToDdMmYy } from "@/lib/utils";
import { DailyDataType, DailyDataTypeArr, enabledMetricsType } from "@/types/programs";
import { Button } from "./ui/button";
import { setDiet, setExercise, setNotes, setWeight } from "@/lib/programs";
import { JsonValue } from "@prisma/client/runtime/library";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "@/components/ui/textarea"
import { FormButton } from "./formButton";
import { checkpointType } from "@/types/checkpoints";
import { Suspense, experimental_useOptimistic as useOptimistic } from "react";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export const TrackingTable = ({ Days, enabledMetrics, checkPoints, isAdmin }: { Days: DailyDataTypeArr, enabledMetrics: JsonValue, checkPoints: Array<checkpointType>, isAdmin: boolean }) => {
    console.log("component re-render")

    const [optimisticDays, setOptimisticDays] = useOptimistic(
        Days,
        (state, updatedDay: DailyDataType) => {
            const dayIndex = state.findIndex((day: DailyDataType) => day.date.getTime() === updatedDay.date.getTime())
            if (dayIndex === -1) {
                return state
            } else {
                state.splice(dayIndex, 1, updatedDay)
                return [...state]
            }
        }
    )

    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0);
    const EnabledMetrics = enabledMetrics as unknown as enabledMetricsType
    return (
        <>

            <div className="flex justify-center px-[5px]">
                <div className="max-w-[550px] w-full mb-[100px] shadow-lg border-r-2 border-l-2 border-b-2 mt-3  ">
                    <div className="flex flex-col w-full">

                        {/* DIAS */}
                        {
                            optimisticDays.map((day: DailyDataType, index) => {
                                const notFuture = day.date.getTime() < Date.now()
                                return (
                                    <>



                                        {/* AVALIAÇÃO INICIAL */}
                                        {
                                            // day.checkpointId && index === 0 && (
                                            //     <>
                                            //         <FormButton checkPoints={checkPoints} day={day} EnabledMetrics={EnabledMetrics} isAdmin={isAdmin!} />
                                            //     </>
                                            // )
                                        }

                                        {/* CABEÇALHO */}
                                        {
                                            day.checkpointId && index === 0 && (
                                                <>
                                                    <div className={`pb-1 bg-white border-t-2 w-full sticky top-[0.5px] shadow-lg h-[50px] items-center font-semibold flex  text-muted-foreground  justify-between text-center`}>
                                                        <div className=" border-r-2 text-center w-[80px] bg-white p-1">
                                                            📆
                                                        </div>
                                                        {EnabledMetrics.dieta && <div className="w-[50px] text-[14px] bg-white">
                                                            {/* <div className="border-r-2 border-l-2"> */}
                                                            Dieta 🥦
                                                            {/* </div> */}
                                                        </div>}
                                                        {EnabledMetrics.treino && <div className="w-[55px] text-[14px] bg-white">
                                                            {/* <div className="border-r-2 border-l-2"> */}
                                                            Treino 💪
                                                            {/* </div> */}
                                                        </div>}
                                                        {EnabledMetrics.peso && <div className="w-[55px] text-[14px] bg-white">
                                                            {/* <div className="border-r-2 border-l-2"> */}
                                                            Peso 📊
                                                            {/* </div> */}
                                                        </div>}
                                                        <div className="w-[70px] bg-white p-1 border-l-2 text-[14px] ">📝 </div>
                                                    </div>
                                                </>
                                            )
                                        }
                                        <div key={day.date.toDateString()} className={`flex flex-row border-b border-t border-black/1 align-middle max-h-[42px] items-center  justify-between text-center ${day.date > currentDate || day.date < currentDate ? "bg-muted" : "bg-[white] font-bold"}`}>

                                            <div className={`border-r bg-white border-black/5 text-center flex items-center justify-center w-[80px] h-[40px] text-sm text-muted-foreground align-middle`}>{formatDateToDdMmYy(day.date)}</div>


                                            {EnabledMetrics.dieta && notFuture ?
                                                <Button
                                                    variant={"trackingtable"}
                                                    onClick={async () => {
                                                        setOptimisticDays({ date: day.date, programId: day.programId, diet: !day.diet, exercise: day.exercise, weight: day.weight, notes: day.notes, checkpointId: day.checkpointId });
                                                        await setDiet(day.date, day.programId, !day.diet)
                                                    }}
                                                    className={`w-[50px] bg-secondary my-auto cursor-pointer text-center 
                                                    ${day.diet ? "bg-[#10B77F] placeholder-white text-white" : day.diet === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : day.date.getTime() < currentDate.getTime() ? "bg-[#ff7777]" : "bg-muted" : "bg-[#ff7777]"}`}>
                                                    {day.diet}
                                                </Button>
                                                :
                                                <div className="w-[50px]" />
                                            }

                                            {EnabledMetrics.treino && notFuture ?
                                                <Button
                                                    variant={"trackingtable"}
                                                    onClick={async () => {
                                                        setOptimisticDays({ date: day.date, programId: day.programId, diet: day.diet, exercise: !day.exercise, weight: day.weight, notes: day.notes, checkpointId: day.checkpointId });
                                                        await setExercise(day.date, day.programId, !day.exercise)
                                                    }}
                                                    className={`w-[50px] bg-secondary my-auto cursor-pointer text-center 
                                                    ${day.exercise ? "bg-[#10B77F] placeholder-white text-white" : day.exercise === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : day.date.getTime() < currentDate.getTime() ? "bg-[#ff7777]" : "bg-muted" : "bg-[#ff7777]"}`}>
                                                    {day.exercise}
                                                </Button>
                                                :
                                                <div className="w-[50px]" />
                                            }


                                            {EnabledMetrics.peso && notFuture ?
                                                <input
                                                    type="string"
                                                    defaultValue={day.weight ? parseFloat(day.weight).toFixed(1) + " kg" : ""}
                                                    onBlur={async (e) => {
                                                        setOptimisticDays({ date: day.date, programId: day.programId, diet: day.diet, exercise: day.exercise, weight: e.target.value === "" ? null : e.target.value, notes: day.notes, checkpointId: day.checkpointId });
                                                        await setWeight(day.date, day.programId, e.target.value, day.weight)
                                                    }}
                                                    onChange={(e) => e.target.value = e.target.value.replace(/[^0-9.,]/g, '').replace(/(\..*?)\..*/g, '$1')}
                                                    className={`w-[55px] h-[40px] border border-[1px] text-muted-foreground text-[13px] rounded-md align-middle cursor-pointer text-center
                                                ${day.weight ? "bg-[#e2fff5] text-muted-foreground font-normal" : day.weight === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border-black/1 border" : "bg-muted border-dotted" : "bg-[#ff7777] border-dotted"}`}>

                                                </input>
                                                :
                                                <div className="w-[55px] h-[40px]" />
                                            }


                                            <div className="w-[70px] max-h-[40px]">
                                                {notFuture &&
                                                    <Popover>
                                                        <PopoverTrigger type="button" className="w-[70px] align-middle flex justify-center items-center">
                                                            <Button
                                                                variant={"trackingtable"}
                                                                className={`bg-white shadow-md rounded-full w-[40px] border border-[0.5px] text-[11px] cursor-pointer text-center
                                                            ${day.notes ? "bg-[#fffee2] text-muted-foreground font-normal" : day.weight === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : "bg-muted shadow-none border-dotted" : "bg-muted shadow-none border-dotted"}`}>
                                                                {day.notes ? "📝" : day.date.getTime() === currentDate.getTime() ? "✍" : ""}
                                                                
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <Textarea
                                                                onBlur={async (e) => {
                                                                    setOptimisticDays({ date: day.date, programId: day.programId, diet: day.diet, exercise: day.exercise, weight: day.weight, notes: e.target.value === "" ? null : e.target.value, checkpointId: day.checkpointId });
                                                                    await setNotes(day.date, day.programId, e.target.value, day.notes!)
                                                                }}
                                                                placeholder="digite como foi seu dia aqui"
                                                                defaultValue={day.notes!}
                                                            >
                                                            </Textarea>
                                                        </PopoverContent>
                                                    </Popover>
                                                }
                                            </div>

                                        </div>

                                        {/* AVALIAÇÕES + FINAL */}
                                        {
                                            // day.checkpointId && index !== 0 && (
                                            //     <>
                                            //         <FormButton checkPoints={checkPoints} day={day} EnabledMetrics={EnabledMetrics} isAdmin={isAdmin!} />
                                            //     </>
                                            // )
                                        }

                                    </>
                                )
                            })
                        }


                    </div>
                </div>
            </div>
        </>
    )
}