import { getLast30DaysStatsByIndex } from "@/lib/stats"
import { DailyDataType, enabledMetricsType } from "@/types/programs"
import { ArrowDown, ArrowUp } from "lucide-react"

export function TableMonth({ EnabledMetrics, day, programLength, index, optimisticDays }
    : {
        EnabledMetrics: enabledMetricsType, day: DailyDataType, programLength: number, index: number, optimisticDays: DailyDataType[]
    }) {
    const stats = getLast30DaysStatsByIndex(index, optimisticDays, EnabledMetrics)
    console.log("render month")
    return (
        <>
            <div key={day.date.toDateString() + "stat"} className={`flex flex-row bg-white border-b border-t border-black/1 align-middle h-[50px] items-center  justify-between text-center font-bold"}`}>

                <div className={`font-semibold   bg-[white] border-black/5 text-center flex items-center justify-center w-[80px] h-[40px] text-sm text-muted-foreground align-middle`}>
                    <div className="min-w-[30px] flex justify-center">
                        <div className="text-center">
                            📈
                            {" "}
                            {
                                programLength <= 30 ? index + 1 + " Dias" :
                                    <>
                                        {(index + 1) % 30 === 0 && `${(index + 1) / 30}º Mês`}
                                    </>
                            }
                        </div>
                    </div>
                </div>


                {EnabledMetrics.dieta ?
                    <div
                        className={`border-r-2 border-l-2 -md w-[50px] bg-white  bg-secondary my-auto cursor-pointer text-center  text-muted-foreground text-[12.5px] text-center  flex flex-col`}>
                        <div className="font-semibold ">{stats.diet?.total + " 🥦"}  </div>
                        <div>{stats.diet?.percentage! + "%"}</div>
                    </div>
                    :
                    EnabledMetrics.dieta && <div className="w-[50px]" />
                }

                {EnabledMetrics.treino ?
                    <div
                        className={` w-[50px] border-r-2 border-l-2 bg-white   bg-secondary my-auto cursor-pointer text-center  text-muted-foreground text-[12.5px] text-center  flex flex-col`}>
                        <div className="font-semibold ">{stats.exercise?.total + " 💪"}  </div>
                        <div>{stats.exercise?.percentage! + "%"}</div>
                    </div>
                    :
                    EnabledMetrics.treino && <div className="w-[50px]" />
                }

                {EnabledMetrics.cardio ?
                    <div
                        className={` w-[50px] border-r-2 border-l-2 bg-white   bg-secondary my-auto cursor-pointer text-center  text-muted-foreground text-[12.5px] text-center  flex flex-col`}>
                        <div className="font-semibold" >{stats.cardio?.totalDays + " 👟"}  </div>
                        <div>{stats.cardio?.totalMinutes! + "min"}</div>
                    </div>
                    :
                    EnabledMetrics.cardio && <div className="w-[50px]" />
                }

                {EnabledMetrics.peso ?
                    <div
                        className={`text-center font-semibold  text-[11px] justify-center bg-white text-sm  w-[50px] text-muted-foreground align-middle items-center flex flex-col`}>
                        <div className="align-middle font-normal text-sm">
                            {stats.weight?.total! > 0 && "Ganhou"} {stats.weight?.total! < 0 && "Perdeu"}
                        </div>
                        <div>{stats.weight?.total + " kg"}</div>
                    </div>
                    :
                    EnabledMetrics.peso && <div className="w-[50px] h-[40px]" />
                }


                <div className="min-w-[50px] max-h-[40px]">
                </div>

            </div>
        </>
    )
}