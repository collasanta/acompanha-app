import { DailyDataTypeArr, enabledMetricsType } from "@/types/programs";
import { JsonValue } from "@prisma/client/runtime/library";
import React from "react";
import { TableHeader } from "./table-header";
import { TableBody } from "./table-body";


export const TrackingTable = ({ Days, enabledMetrics }:
    { Days: DailyDataTypeArr, enabledMetrics: JsonValue }) => {
    const EnabledMetrics = enabledMetrics as unknown as enabledMetricsType
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