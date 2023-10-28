'use client'

import { DailyDataType, DailyDataTypeArr, enabledMetricsType } from "@/types/programs";
import { checkpointType } from "@/types/checkpoints";
import { JsonValue } from "@prisma/client/runtime/library";
import { use, useEffect, experimental_useOptimistic as useOptimistic, useState } from "react";
import { TableDay } from "./table-day";
import { TableHeader } from "./table-header";
import { TableMonth } from "./table-month";

export const TrackingTable = ({ Days, enabledMetrics, checkPoints, isAdmin }: 
    { Days: DailyDataTypeArr, enabledMetrics: JsonValue, checkPoints: Array<checkpointType>, isAdmin: boolean }) => {
    // console.log("render trackingTable.tsx - useClient")
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [currentType, setCurrentType] = useState<string>("")
    const [currentDate, setCurrentDate] = useState<Date>(new Date())

    const [optimisticDays, setOptimisticDays] = useOptimistic(
        Days,
        (state, updatedDay: DailyDataType) => {
            const dayIndex = state.findIndex((day: DailyDataType, index) => day.date.getTime() === updatedDay.date.getTime())
            if (dayIndex === -1) {
                return state
            } else {
                state.splice(dayIndex, 1, updatedDay)
                return [...state]
            }
        }
    )
    
    useEffect(() => {
        currentDate.setHours(0, 0, 0, 0);
    }, [])

    const EnabledMetrics = enabledMetrics as unknown as enabledMetricsType
    return (
        <>
            <div className="flex justify-center bg-white">
                <div className="max-w-[550px] w-full mb-[100px] shadow-lg border-r-2 border-l-2 border-b-2 ">
                    <div className="flex flex-col w-full">
                        {
                            optimisticDays.map((day: DailyDataType, index) => {
                                const programLength = Days.length
                                return (
                                    <div key={index}>
                                        {/* AVALIAÇÃO INICIAL */}
                                        {
                                            // day.checkpointId && index === 0 && (
                                            //     <>
                                            //         <FormButton checkPoints={checkPoints} day={day} EnabledMetrics={EnabledMetrics} isAdmin={isAdmin!} />
                                            //     </>
                                            // )
                                        }
                                        {
                                            day.checkpointId && index === 0 && (
                                                <TableHeader EnabledMetrics={EnabledMetrics} />
                                            )
                                        }
                                        <TableDay EnabledMetrics={EnabledMetrics} day={day} setCurrentIndex={setCurrentIndex} setCurrentType={setCurrentType} currentDate={currentDate} index={index} currentIndex={currentIndex} currentType={currentType} setOptimisticDays={setOptimisticDays} />
                                        {
                                            (((index + 1) !== 0 && (index + 1) % 30 === 0) || (programLength <= 30 && (index + 1) === programLength)) &&
                                                <TableMonth EnabledMetrics={EnabledMetrics} day={day} programLength={programLength} index={index} optimisticDays={optimisticDays} />
                                        }
                                        {/* AVALIAÇÕES + FINAL */}
                                        {
                                            // day.checkpointId && index !== 0 && (
                                            //     <>
                                            //         <FormButton checkPoints={checkPoints} day={day} EnabledMetrics={EnabledMetrics} isAdmin={isAdmin!} />
                                            //     </>
                                            // )
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}