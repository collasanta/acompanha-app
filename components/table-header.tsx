"use client"

import { enabledMetricsType } from "@/types/programs"

export function TableHeader({EnabledMetrics} 
    : {EnabledMetrics:enabledMetricsType}) {
    return (
        <>
            <div className={` bg-white border-[1.5px] w-full z-30 sticky top-[0px] h-[50px] items-center font-semibold flex  text-muted-foreground  justify-between text-center`}>
                <div className="border-r-2 text-center w-[80px] bg-white py-2 ">
                    📆
                </div>
                {EnabledMetrics.dieta &&
                    <div className="w-[50px] text-[14px] bg-white">
                        Dieta 🥦
                    </div>}
                {EnabledMetrics.treino &&
                    <div className="w-[55px] text-[14px] bg-white">
                        Treino 💪
                    </div>}
                {EnabledMetrics.peso &&
                    <div className="w-[55px] text-[14px] bg-white flex flex-col">
                        Peso <a>📊</a>
                    </div>}
                <div className="w-[70px] bg-white  border-l-2 text-[14px] flex flex-col ">
                    Notas
                    <a>✍</a>
                </div>
            </div>
        </>
    )
}