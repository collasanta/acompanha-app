'use client'

import { DailyDataType, enabledMetricsType } from "@/types/programs"
import { experimental_useOptimistic } from "react"
import { TableDay } from "./table-day"
import { TableMonth } from "./table-month"

export function TableBody({ EnabledMetrics, Days }
    : { EnabledMetrics: enabledMetricsType, Days: DailyDataType[] }) {
    const [optimisticDays, setOptimisticDays] = experimental_useOptimistic(
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
    return (
        <>
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
                            <TableDay EnabledMetrics={EnabledMetrics} day={day} index={index} setOptimisticDays={setOptimisticDays} />
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
        </>
    )
}