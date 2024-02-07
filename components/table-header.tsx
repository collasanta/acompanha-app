import { enabledMetricsType } from "@/types/programs"

export function TableHeader({ EnabledMetrics }
    : { EnabledMetrics: enabledMetricsType }) {
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
                    <div className="w-[50px] text-[14px] bg-white">
                        Treino 💪
                    </div>}
                {EnabledMetrics.cardio &&
                    <div className="w-[50px] text-[14px] bg-white">
                        Cardio 👟
                    </div>}
                {EnabledMetrics.peso &&
                    <div className="w-[50px] text-[14px] bg-white flex flex-col">
                        Peso <div>📊</div>
                    </div>}
                <div className="w-[50px] bg-white  text-[14px] flex flex-col ">
                    Notas
                    <div>✍</div>
                </div>
            </div>
        </>
    )
}