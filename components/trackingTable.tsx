'use client'

import { formatDateToDdMmYy } from "@/lib/utils";
import { DailyDataType, DailyDataTypeArr, enabledMetricsType } from "@/types/programs";
import { Button } from "./ui/button";
import { setDiet, setExercise, setNotes, setWeight } from "@/lib/programs";
import { JsonValue } from "@prisma/client/runtime/library";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "@/components/ui/textarea"
import { checkpointType } from "@/types/checkpoints";
import { experimental_useOptimistic as useOptimistic } from "react";
import AddToHomeScreen from "./PWA/AddToHomeScreen/AddToHomeScreen";
import Notifications from "./PWA/WebPush/WebPushNotifications";
import { getLast30DaysStatsByIndex } from "@/lib/stats";


export const TrackingTable = ({ Days, enabledMetrics, checkPoints, isAdmin }: { Days: DailyDataTypeArr, enabledMetrics: JsonValue, checkPoints: Array<checkpointType>, isAdmin: boolean }) => {
    console.log("render trackingTable.tsx")
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

    const isOffline = async () => {
        if (!navigator.onLine) {
            window.alert("Você está offline, conecte a internet e tente novamente")
            return true
        }
        return false
    }

    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0);
    const EnabledMetrics = enabledMetrics as unknown as enabledMetricsType
    return (
        <>
            <Notifications programId={Days[0].programId} />

            <AddToHomeScreen />
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


                                        {/* DIAS */}
                                        <div key={day.date.toDateString()}  className={` flex flex-row border-b border-t border-dashed border-black/1 align-middle max-h-[42px] items-center  justify-between text-center ${day.date > currentDate || day.date < currentDate ? "bg-muted " : "bg-[white] font-bold"}`}>

                                            <div className={`border-r bg-white border-black/5 text-center flex items-center justify-center w-[80px] h-[40px] text-sm text-muted-foreground align-middle`}>
                                                <div className="min-w-[30px] flex justify-center">
                                                    <a className="text-center">{formatDateToDdMmYy(day.date).split(" ")[0]}</a>
                                                </div>

                                                <div className="min-w-[30px] flex justify-center">
                                                    <a className="italic text-[12px] text-gray-400 pl-1">{formatDateToDdMmYy(day.date).split(" ")[1]}</a>
                                                </div>
                                            </div>


                                            {EnabledMetrics.dieta && notFuture ?
                                                <Button
                                                    variant={"trackingtable"}
                                                    onClick={async () => {
                                                        if (await isOffline() === true) {
                                                            return null
                                                        }
                                                        setOptimisticDays({ date: day.date, programId: day.programId, diet: !day.diet, exercise: day.exercise, weight: day.weight, notes: day.notes, checkpointId: day.checkpointId });
                                                        setDiet(day.date, day.programId, !day.diet)
                                                    }}
                                                    className={`w-[50px] bg-secondary my-auto cursor-pointer text-center 
                                                    ${day.diet ? "bg-[#10B77F] placeholder-white text-white" : day.diet === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : day.date.getTime() < currentDate.getTime() ? "bg-[#ff6870]" : "bg-muted" : "bg-[#ff6870]"}`}>
                                                    {day.diet}
                                                </Button>
                                                :
                                                <div className="w-[50px]" />
                                            }

                                            {EnabledMetrics.treino && notFuture ?
                                                <Button
                                                    variant={"trackingtable"}
                                                    onClick={async () => {
                                                        if (await isOffline() === true) {
                                                            return null
                                                        }
                                                        setOptimisticDays({ date: day.date, programId: day.programId, diet: day.diet, exercise: !day.exercise, weight: day.weight, notes: day.notes, checkpointId: day.checkpointId });
                                                        setExercise(day.date, day.programId, !day.exercise)
                                                    }}
                                                    className={`w-[50px] bg-secondary my-auto cursor-pointer text-center 
                                                    ${day.exercise ? "bg-[#10B77F] placeholder-white text-white" : day.exercise === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : day.date.getTime() < currentDate.getTime() ? "bg-[#ff6870]" : "bg-muted" : "bg-[#ff6870]"}`}>
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
                                                        if (await isOffline() === true) {
                                                            return null
                                                        }
                                                        setOptimisticDays({ date: day.date, programId: day.programId, diet: day.diet, exercise: day.exercise, weight: e.target.value === "" ? null : e.target.value, notes: day.notes, checkpointId: day.checkpointId });
                                                        setWeight(day.date, day.programId, e.target.value, day.weight)
                                                    }}
                                                    onChange={(e) => e.target.value = e.target.value.replace(/[^0-9.,]/g, '').replace(/(\..*?)\..*/g, '$1')}
                                                    className={`w-[55px] h-[40px] border border-[1px] text-muted-foreground text-[13px] rounded-md align-middle cursor-pointer text-center
                                                ${day.weight ? "bg-[#e2fff5] text-muted-foreground font-normal" : day.weight === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border-black/1 border" : "bg-muted border-dotted" : "bg-[#ff6870] border-dotted"}`}>

                                                </input>
                                                :
                                                <div className="w-[55px] h-[40px]" />
                                            }


                                            <div className="w-[70px] max-h-[40px]">
                                                {notFuture &&
                                                    <Popover modal={true}>
                                                        <PopoverTrigger type="button" className="w-[70px] align-middle flex justify-center items-center">
                                                            <Button
                                                                variant={"trackingtable"}
                                                                onClick={async () => {
                                                                    if (await isOffline() === true) {

                                                                        return null
                                                                    }
                                                                }}
                                                                className={`bg-white shadow-md rounded-full w-[40px] border border-[0.5px] text-[11px] cursor-pointer text-center
                                                            ${day.notes ? "bg-[#fffee2] text-muted-foreground font-normal" : day.weight === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : "bg-muted shadow-none border-dotted" : "bg-muted shadow-none border-dotted"}`}>
                                                                {day.notes ? "📝" : day.date.getTime() === currentDate.getTime() ? "✍" : ""}

                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-screen max-w-[450px] bg-card " onOpenAutoFocus={(e) => e.preventDefault()}>
                                                            <div className="flex flex-col items-center">
                                                                <Textarea
                                                                    autoFocus={false}
                                                                    onBlur={async (e) => {
                                                                        if (await isOffline() === true) {
                                                                            return null
                                                                        }
                                                                        setOptimisticDays({ date: day.date, programId: day.programId, diet: day.diet, exercise: day.exercise, weight: day.weight, notes: e.target.value === "" ? null : e.target.value, checkpointId: day.checkpointId });
                                                                        setNotes(day.date, day.programId, e.target.value, day.notes!)
                                                                    }}
                                                                    placeholder="digite aqui como foi seu dia 👇"
                                                                    defaultValue={day.notes!}
                                                                    className="min-h-[120px] bg-[#fffee2] text-muted-foreground bg-[#fffee2] bg-opacity-50"

                                                                >
                                                                </Textarea>
                                                                <PopoverClose className="pt-2">
                                                                    <Button variant="secondary" className="text-muted-foreground shadow-md">Salvar</Button>
                                                                </PopoverClose>
                                                            </div>
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

                                        {/* MÊSES */}
                                        {
                                            ((index + 1) !== 0 && (index + 1) % 30 === 0) &&

                                            <div key={day.date.toDateString() + "stat"} className={`flex flex-row bg-white border-b border-t border-black/1 align-middle h-[50px] items-center  justify-between text-center font-bold"}`}>

                                                <div className={`border-r-2   bg-white border-black/5 text-center flex items-center justify-center w-[80px] h-[40px] text-sm text-muted-foreground align-middle`}>
                                                    <div className="min-w-[30px] flex justify-center">
                                                        <a className="text-center">
                                                            📈
                                                            {" "} 
                                                            {
                                                            optimisticDays.length <= 30 ? index + 1 + " Dias" :
                                                                <>
                                                                    { (index + 1) % 30 === 0 && `${(index + 1) / 30}º Mês`}
                                                                </>
                                                            }
                                                        </a>
                                                    </div>
                                                </div>


                                                {EnabledMetrics.dieta ?
                                                    <div
                                                        className={`border-r-2 border-l-2 -md w-[50px] bg-white  bg-secondary my-auto cursor-pointer text-center  text-muted-foreground text-[12.5px] text-center  flex flex-col`}>
                                                        <a>{getLast30DaysStatsByIndex(index, optimisticDays, EnabledMetrics).diet?.total + " 🥦"}  </a>
                                                        <a>{getLast30DaysStatsByIndex(index, optimisticDays, EnabledMetrics).diet?.percentage! + "%"}</a>
                                                    </div>
                                                    :
                                                    <div className="w-[50px]" />
                                                }

                                                {EnabledMetrics.treino ?
                                                    <div
                                                        className={` w-[50px] border-r-2 border-l-2 bg-white   bg-secondary my-auto cursor-pointer text-center  text-muted-foreground text-[12.5px] text-center  flex flex-col`}>
                                                        <a>{getLast30DaysStatsByIndex(index, optimisticDays, EnabledMetrics).exercise?.total + " 💪"}  </a>
                                                        <a>{getLast30DaysStatsByIndex(index, optimisticDays, EnabledMetrics).exercise?.percentage! + "%"}</a>
                                                    </div>
                                                    :
                                                    <div className="w-[50px]" />
                                                }


                                                {EnabledMetrics.peso ?
                                                    <div
                                                        className={`text-center border-r-2 border-l-2 text-[11px] justify-center bg-white text-sm  w-[55px] h-[40px] text-muted-foreground align-middle items-center flex`}>
                                                        <a className="align-middle">{getLast30DaysStatsByIndex(index, optimisticDays, EnabledMetrics).weight?.total + " kg"}</a>
                                                    </div>
                                                    :
                                                    <div className="w-[55px] h-[40px]" />
                                                }


                                                <div className="w-[70px] max-h-[40px]">

                                                </div>

                                            </div>

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