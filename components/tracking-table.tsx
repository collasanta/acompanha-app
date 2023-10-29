import { DailyDataTypeArr, enabledMetricsType } from "@/types/programs";
import { checkpointType } from "@/types/checkpoints";
import { JsonValue } from "@prisma/client/runtime/library";
import React from "react";
import { TableHeader } from "./table-header";
import { TableBody } from "./table-body";


export const TrackingTable = ({ Days, enabledMetrics, checkPoints, isAdmin }:
    { Days: DailyDataTypeArr, enabledMetrics: JsonValue, checkPoints?: Array<checkpointType>, isAdmin?: boolean }) => {
    const EnabledMetrics = enabledMetrics as unknown as enabledMetricsType
    console.log("render trackingtable")
    return (
        <>
            <div className="flex justify-center bg-white">
                <div className="max-w-[550px] w-full mb-[100px] shadow-lg border-r-2 border-l-2 border-b-2 ">
                    <div className="flex flex-col w-full">
                            <TableHeader EnabledMetrics={EnabledMetrics} />                        
                            <TableBody EnabledMetrics={EnabledMetrics} Days={Days} />
                    </div>
                </div>
            </div>
        </>
    )
}