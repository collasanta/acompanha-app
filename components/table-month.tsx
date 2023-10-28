"use client"

import { getLast30DaysStatsByIndex } from "@/lib/stats"
import { DailyDataType, enabledMetricsType } from "@/types/programs"

export function TableMonth({ EnabledMetrics, day, programLength, index, optimisticDays  }
    : { 
        EnabledMetrics: enabledMetricsType, day: DailyDataType, programLength: number, index:number, optimisticDays:DailyDataType[]
    }) {
    return (
        <>
            <div key={day.date.toDateString() + "stat"} className={`flex font-semibold flex-row bg-white border-b border-t border-black/1 align-middle h-[50px] items-center  justify-between text-center font-bold"}`}>

                <div className={`  bg-[white] border-black/5 text-center flex items-center justify-center w-[80px] h-[40px] text-sm text-muted-foreground align-middle`}>
                    <div className="min-w-[30px] flex justify-center">
                        <a className="text-center">
                            📈
                            {" "}
                            {
                                programLength <= 30 ? index + 1 + " Dias" :
                                    <>
                                        {(index + 1) % 30 === 0 && `${(index + 1) / 30}º Mês`}
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
                    EnabledMetrics.dieta && <div className="w-[50px]" />
                }

                {EnabledMetrics.treino ?
                    <div
                        className={` w-[50px] border-r-2 border-l-2 bg-white   bg-secondary my-auto cursor-pointer text-center  text-muted-foreground text-[12.5px] text-center  flex flex-col`}>
                        <a>{getLast30DaysStatsByIndex(index, optimisticDays, EnabledMetrics).exercise?.total + " 💪"}  </a>
                        <a>{getLast30DaysStatsByIndex(index, optimisticDays, EnabledMetrics).exercise?.percentage! + "%"}</a>
                    </div>
                    :
                    EnabledMetrics.treino && <div className="w-[50px]" />
                }


                {EnabledMetrics.peso ?
                    <div
                        className={`text-center border-r-2 border-l-2 text-[11px] justify-center bg-white text-sm  w-[55px] h-[40px] text-muted-foreground align-middle items-center flex`}>
                        <a className="align-middle">{getLast30DaysStatsByIndex(index, optimisticDays, EnabledMetrics).weight?.total + " kg"}</a>
                    </div>
                    :
                    EnabledMetrics.peso && <div className="w-[55px] h-[40px]" />
                }


                <div className="w-[70px] max-h-[40px]">

                </div>

            </div>
        </>
    )
}