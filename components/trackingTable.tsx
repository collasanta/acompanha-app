'use client'

import { formatDateToDdMmYy } from "@/lib/utils";
import { DailyDataType, DailyDataTypeArr, enabledMetricsType } from "@/types/programs";
import { Button } from "./ui/button";
import { setDiet, setExercise, setNotes, setWeight } from "@/lib/programs";
import { JsonValue } from "@prisma/client/runtime/library";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@clerk/nextjs";
import { FormButton } from "./formButton";
import { checkpointType } from "@/types/checkpoints";


export const TrackingTable = ({ Days, enabledMetrics, checkPoints, isAdmin }: { Days: DailyDataTypeArr, enabledMetrics: JsonValue, checkPoints: Array<checkpointType>, isAdmin:boolean }) => {
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0);
    const EnabledMetrics = enabledMetrics as unknown as enabledMetricsType
    return (
        <>
            <div className="flex justify-center px-[5px]">
                <div className="max-w-[550px] w-full mb-[100px] shadow-lg ">
                    <div className="flex flex-col w-full">

                        {/* CABEÇALHO */}
                        <div className={`w-full sticky top-0 font-semibold bg-muted flex p-1 text-muted-foreground border-b border-t border-black/5 justify-between text-center`}>
                            <div className="bg-gray text-center rounded-lg w-[80px] ">Dia</div>
                            {EnabledMetrics.dieta && <div className="w-[50px] ">Dieta</div>}
                            {EnabledMetrics.treino && <div className="w-[50px] ">Treino</div>}
                            {EnabledMetrics.peso && <div className="w-[50px] ">Peso</div>}
                            <div className="min-w-[70px]">Notas</div>
                        </div>




                        {/* DIAS */}

                        {
                            Days.map((day: DailyDataType, index) => {
                                const notFuture = day.date.getTime() < Date.now()
                                return (
                                    <>
                                        {/* AVALIAÇÃO INICIAL */}
                                        {
                                            day.checkpointId && index === 0 && (
                                                <>
                                                    <FormButton checkPoints={checkPoints} day={day} EnabledMetrics={EnabledMetrics} isAdmin={isAdmin!} />
                                                </>
                                            )
                                        }
                                        <div key={day.date.toDateString()} className={`flex flex-row border-b border-t border-black/1  justify-between text-center ${day.date > currentDate || day.date < currentDate ? "bg-muted" : "bg-[white] font-bold"}`}>

                                            <div className={`border-r bg-white border-black/5 text-center flex items-center justify-center min-w-[80px] min-h-[30px] text-sm text-muted-foreground `}>{formatDateToDdMmYy(day.date)}</div>

                                            {EnabledMetrics.dieta && notFuture &&
                                                <Button
                                                    variant={"trackingtable"}
                                                    onClick={() => setDiet(day.date, day.programId, !day.diet)}
                                                    className={`w-[50px] bg-secondary my-auto cursor-pointer text-center 
                                                    ${day.diet ? "bg-[#10B77F] placeholder-white text-white" : day.diet === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : day.date.getTime() < currentDate.getTime() ? "bg-[#ff6961]" : "bg-muted" : "bg-[#ff6961]"}`}>
                                                    {day.diet}
                                                </Button>}

                                            {EnabledMetrics.treino && notFuture &&
                                                <Button
                                                    variant={"trackingtable"}
                                                    onClick={() => setExercise(day.date, day.programId, !day.exercise)}
                                                    className={`w-[50px] bg-secondary my-auto cursor-pointer text-center
                                                    ${day.exercise ? "bg-[#10B77F] placeholder-white text-white" : day.exercise === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : day.date.getTime() < currentDate.getTime() ? "bg-[#ff6961]" : "bg-muted" : "bg-[#ff6961]"}`}>
                                                    {day.exercise}
                                                </Button>}

                                            {EnabledMetrics.peso && notFuture &&
                                                <input
                                                    type="string"
                                                    placeholder={day.weight?.toString()}
                                                    onBlur={(e) => setWeight(day.date, day.programId, e.target.value)}
                                                    onChange={(e) => e.target.value = e.target.value.replace(/[^0-9.,]/g, '').replace(/(\..*?)\..*/g, '$1')}
                                                    className={`w-[50px] text-gray-600 text-[13px] rounded-md align-middle cursor-pointer text-center
                                                ${day.weight ? "bg-[#f4fdff] placeholder-gray-600 text-gray-600" : day.weight === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : "bg-muted" : "bg-[#ff6961]"}`}>

                                                </input>}

                                            {EnabledMetrics.peso && notFuture &&
                                                <Popover>
                                                    <PopoverTrigger type="button" className="w-[70px]">
                                                        <Button
                                                            variant={"trackingtable"}
                                                            className={`bg-muted rounded-full w-[40px] text-[11px] cursor-pointer text-center p-1
                                                ${day.notes ? "bg-[#fff8db]" : "bg-secondary"}`}>
                                                            📝
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <Textarea
                                                            onBlur={(e) => setNotes(day.date, day.programId, e.target.value, day.notes!)}
                                                            placeholder="digite como foi seu dia aqui"
                                                            defaultValue={day.notes!}

                                                        >
                                                        </Textarea>
                                                    </PopoverContent>
                                                </Popover>
                                            }

                                        </div>

                                        {/* AVALIAÇÕES + FINAL */}
                                        {
                                            day.checkpointId && index !== 0 && (
                                                <>
                                                    <FormButton checkPoints={checkPoints} day={day} EnabledMetrics={EnabledMetrics} isAdmin={isAdmin!} />
                                                </>
                                            )
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