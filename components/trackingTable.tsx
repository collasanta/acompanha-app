'use client'

import { getProgramTableNumberOfCols } from "@/lib/programs";
import { cn, formatDateToDdMmYy } from "@/lib/utils";
import { DailyDataType, DailyDataTypeArr } from "@/types/programs";

export const TrackingTable = ({ Days, enabledMetrics, cols }: { Days: DailyDataTypeArr, enabledMetrics: Object, cols: number }) => {
    console.log("cols", cols)

    return (
        <>
            <div className="bg-muted flex justify-center max-w-[750px] mx-auto w-full">
                <div className="max-w-[550px]">
                    <div className="flex flex-col w-full">

                        {/* CABEÇALHO */}
                        <div className={`font-semibold flex p-2 text-muted-foreground border-b border-black/5 justify-between text-center`}>
                            <div className="bg-gray text-center rounded-lg min-w-[100px]">Data</div>
                            <div className="min-w-[50px]">Dieta</div>
                            <div className="min-w-[50px]">Treino</div>
                            <div className="min-w-[50px]">Peso</div>
                            <div className="min-w-[50px]">Notas</div>
                        </div>

                        {/* DIAS */}
                        <div className="flex flex-row space-x-4 border-b border-black/5 p-1 justify-between text-center">
                            <div className="bg-gray text-center rounded-lg min-w-[100px] p-[5px]">23/07/1997</div>
                            <div className="min-w-[50px] p-[5px] bg-white rounded-lg cursor-pointer">Sim</div>
                            <div className="min-w-[50px] p-[5px] bg-white rounded-lg cursor-pointer">Sim</div>
                            <div className="min-w-[50px] p-[5px] bg-white rounded-lg cursor-pointer">80kg</div>
                            <div className="min-w-[50px] p-[5px] bg-white rounded-lg cursor-pointer">✍</div>
                        </div>
                        <div className="flex flex-row space-x-4 border-b border-black/5 p-1 justify-between text-center">
                            <div className="bg-gray text-center rounded-lg min-w-[100px] p-[5px]">23/07/1997</div>
                            <div className="min-w-[50px] p-[5px] bg-white rounded-lg">Sim</div>
                            <div className="min-w-[50px] p-[5px] bg-white rounded-lg">Sim</div>
                            <div className="min-w-[50px] p-[5px] bg-white rounded-lg">80kg</div>
                            <div className="min-w-[50px] p-[5px] bg-white rounded-lg">✍</div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}