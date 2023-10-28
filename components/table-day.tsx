"use client"

import { formatDateToDdMmWeek, isOffline } from "@/lib/utils"
import { DailyDataType, enabledMetricsType } from "@/types/programs"
import { Button } from "./ui/button"
import { useState } from "react"
import { setDiet, setExercise, setNotes, setWeight } from "@/lib/programs"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea"


export function TableDay({ EnabledMetrics, day, index, setOptimisticDays }
    : {
        EnabledMetrics: enabledMetricsType, day: DailyDataType, index: number, setOptimisticDays: Function
    }) {
        const [isLoading, setIsLoading] = useState<boolean>(false)
        const [currentIndex, setCurrentIndex] = useState<number>(0)
        const [currentType, setCurrentType] = useState<string>("")
        const notFuture = day.date.getTime() < Date.now()
        
        let currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0);
        
    return (
        <>
            <div key={day.date.toDateString()} className={`flex flex-row border-b border-t border border-black/1 align-middle max-h-[42px] items-center  justify-between text-center ${day.date > currentDate || day.date < currentDate ? "bg-muted " : "bg-[white] font-bold"}`}>

                <div className={`border-r bg-white border-black/5 text-center flex items-center justify-center w-[80px] h-[40px] text-sm text-muted-foreground align-middle`}>
                    <div className="min-w-[30px] flex justify-center">
                        <div className="text-center">{formatDateToDdMmWeek(day.date).split(" ")[0]}</div>
                    </div>

                    <div className="min-w-[30px] flex justify-center">
                        <div className="italic text-[12px] text-gray-400 pl-1">{formatDateToDdMmWeek(day.date).split(" ")[1]}</div>
                    </div>
                </div>


                {EnabledMetrics.dieta && notFuture ?
                    isLoading && index === currentIndex && currentType === 'diet' ?
                        <>
                            <svg aria-hidden="true" className=" w-[50px] w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        </>

                        :

                        <Button
                            variant={"trackingtable"}
                            disabled={isLoading}
                            onClick={async () => {
                                if (await isOffline() === true) {
                                    return null
                                }
                                setOptimisticDays({ date: day.date, programId: day.programId, diet: !day.diet, exercise: day.exercise, weight: day.weight, notes: day.notes, checkpointId: day.checkpointId });
                                setCurrentIndex(index)
                                setCurrentType("diet")
                                setIsLoading(true)
                                await setDiet(day.date, day.programId, !day.diet)
                                setIsLoading(false)
                            }}
                            className={`w-[50px] bg-secondary my-auto cursor-pointer text-center 
        ${day.diet ? "bg-[#10B77F] placeholder-white text-white" : day.diet === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : day.date.getTime() < currentDate.getTime() ? "bg-[#ff6870]" : "bg-muted" : "bg-[#ff6870]"}`}>
                            {day.diet}
                        </Button>
                    :

                    EnabledMetrics.dieta && <div className="w-[50px]" />
                }

                {EnabledMetrics.treino && notFuture ?
                    isLoading && index === currentIndex && currentType === 'exercise' ?
                        <>
                            <svg aria-hidden="true" className=" w-[50px] w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        </>

                        :

                        <Button
                            variant={"trackingtable"}
                            disabled={isLoading}
                            onClick={async () => {
                                if (await isOffline() === true) {
                                    return null
                                }
                                setOptimisticDays({ date: day.date, programId: day.programId, diet: day.diet, exercise: !day.exercise, weight: day.weight, notes: day.notes, checkpointId: day.checkpointId });
                                setCurrentIndex(index)
                                setCurrentType("exercise")
                                setIsLoading(true)
                                await setExercise(day.date, day.programId, !day.exercise)
                                setIsLoading(false)
                            }}
                            className={`w-[50px] bg-secondary my-auto cursor-pointer text-center 
            ${day.exercise ? "bg-[#10B77F] placeholder-white text-white" : day.exercise === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : day.date.getTime() < currentDate.getTime() ? "bg-[#ff6870]" : "bg-muted" : "bg-[#ff6870]"}`}>
                            {day.exercise}
                        </Button>

                    :

                    EnabledMetrics.treino && <div className="w-[50px]" />
                }


                {EnabledMetrics.peso && notFuture ?
                    isLoading && index === currentIndex && currentType === 'weight' ?
                        <>
                            <svg aria-hidden="true" className=" w-[50px] w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        </>

                        :

                        <>
                            <input
                                type="string"
                                disabled={isLoading}
                                defaultValue={day.weight ? parseFloat(day.weight).toFixed(1) + " kg" : ""}
                                onBlur={async (e) => {
                                    if (await isOffline() === true) {
                                        return null
                                    }
                                    setOptimisticDays({ date: day.date, programId: day.programId, diet: day.diet, exercise: day.exercise, weight: e.target.value === "" ? null : e.target.value, notes: day.notes, checkpointId: day.checkpointId });
                                    setCurrentIndex(index)
                                    setCurrentType("weight")
                                    setIsLoading(true)
                                    await setWeight(day.date, day.programId, e.target.value, day.weight)
                                    setIsLoading(false)
                                }}
                                onChange={(e) => e.target.value = e.target.value.replace(/[^0-9.,]/g, '').replace(/(\..*?)\..*/g, '$1')}
                                className={`w-[55px] h-[40px] border border-[1px] text-muted-foreground text-[13px] rounded-md align-middle cursor-pointer text-center disabled:text-muted-foreground disabled:opacity-100 
    ${day.weight ? "bg-[#e2fff5] bg-[#e2fff5] text-muted-foreground font-normal" : day.weight === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border-black/1 border" : "bg-muted border" : "bg-[#ff6870] border"}`}>
                            </input>
                        </>
                    :
                    EnabledMetrics.peso && <div className="w-[55px] h-[40px]" />
                }


                <div className="w-[70px] max-h-[40px]">
                    {notFuture &&

                        <Popover modal={true}>
                            <PopoverTrigger disabled={isLoading} className="w-[70px] align-middle flex justify-center items-center">
                                {
                                    isLoading && index === currentIndex && currentType === 'notes' ?
                                        <>
                                            <svg aria-hidden="true" className=" w-[50px] w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                        </>

                                        :

                                        <Button
                                            disabled={isLoading}
                                            variant={"trackingtable"}
                                            onClick={async () => {
                                                if (await isOffline() === true) {
                                                    return null
                                                }
                                            }}
                                            className={`bg-white shadow-md rounded-full w-[40px] border border-[0.5px] text-[11px] cursor-pointer text-center
                                            ${day.notes ? "bg-[#fffee2] muted text-muted-foreground font-normal" : day.weight === null ? day.date.getTime() === currentDate.getTime() ? "bg-muted shadow-lg animate-pulse border  border-black/1" : "bg-muted shadow-none border" : "bg-muted shadow-none border"}`}>
                                            {day.notes ? "📝" : day.date.getTime() === currentDate.getTime() ? "✍" : ""}
                                        </Button>
                                }
                            </PopoverTrigger>

                            <PopoverContent side="top" className="w-screen max-w-[450px] bg-card sticky top-[0px] " onOpenAutoFocus={(e) => e.preventDefault()}>
                                <div className="flex flex-col items-center">
                                    <Textarea
                                        autoFocus={false}
                                        onBlur={async (e) => {
                                            if (await isOffline() === true) {
                                                return null
                                            }
                                            setOptimisticDays({ date: day.date, programId: day.programId, diet: day.diet, exercise: day.exercise, weight: day.weight, notes: e.target.value === "" ? null : e.target.value, checkpointId: day.checkpointId });
                                            setCurrentIndex(index)
                                            setCurrentType("notes")
                                            setIsLoading(true)
                                            await setNotes(day.date, day.programId, e.target.value, day.notes!)
                                            setIsLoading(false)
                                        }}
                                        placeholder="digite aqui como foi seu dia..."
                                        defaultValue={day.notes!}
                                        className="min-h-[120px] text-muted-foreground placeholder:text-gray-300 bg-[#fffee2] bg-gray-100 bg-opacity-25"

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
        </>
    )
}