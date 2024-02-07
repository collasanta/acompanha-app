import { getLast30DaysStatsByIndex, getTotalDaysStatsByIndex } from "@/lib/stats"
import { DailyDataType, enabledMetricsType } from "@/types/programs"

export function TableMonth({ EnabledMetrics, day, programLength, index, optimisticDays, total }
    : {
        EnabledMetrics: enabledMetricsType, day: DailyDataType, programLength: number, index: number, optimisticDays: DailyDataType[], total: boolean
    }) {

    let stats
    if (!total) {
        stats = getLast30DaysStatsByIndex(index, optimisticDays, EnabledMetrics)
    } else {
        stats = getTotalDaysStatsByIndex(index, optimisticDays, EnabledMetrics)
    }
    const today = new Date()
    const todayIndex = Math.ceil((today.getTime() - optimisticDays[0].date.getTime()) / (1000 * 3600 * 24))
    return (
        <>
            <div key={day.date.toDateString() + "stat"} className={`flex flex-row bg-white border-b border-t border-black/1 align-middle h-[60px] items-center  justify-between text-center font-bold"}  ${total && "mt-10 bg-muted"}`}>
                <div className={`font-semibold   bg-[white] border-black/5 text-center flex items-center justify-center w-[80px] h-[40px] text-sm text-muted-foreground align-middle `}>
                    <div className="min-w-[30px] flex justify-center">
                        <div className="text-center">
                            {
                                total ? <div>
                                    <div>Total:</div>
                                    <div className="font-normal pb=[3px]">{todayIndex} Dias </div>
                                </div> :

                                    <div>
                                        <div className="font-normal text-[13px]">Resumo:</div>
                                        <div className="text-[15px] pb-[4px]">{(index + 1) / 30}º Mês </div>
                                    </div>

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
                        <div className="align-middle font-normal text-[12px]">
                            {stats.weight?.total! > 0 && "Ganhou"} {stats.weight?.total! < 0 && "Perdeu"}
                        </div>
                        <div className="text-[13px]">{stats.weight?.total + " kg"}</div>
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