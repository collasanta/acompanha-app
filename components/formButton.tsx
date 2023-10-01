import { DailyDataType } from "@/types/programs"
import { Button } from "./ui/button"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { SettingsIcon } from "lucide-react"
import { Switch } from "./ui/switch"
import { setDietLink, setFormFilled, setFormsLink, setTrainingLink } from "@/lib/programs"

export const FormButton = ({ checkPoints, day, EnabledMetrics, isAdmin }: { checkPoints: any, day: DailyDataType, EnabledMetrics: any, isAdmin: boolean }) => {
    const getButtonText = () => {
        if (checkPoints.find(item => item.id === day.checkpointId!)?.description === "initial") return "Formulário de Avaliação Inicial 📐"
        if (checkPoints.find(item => item.id === day.checkpointId!)?.description === "review") return "Formulário de Avaliação 📐"
        if (checkPoints.find(item => item.id === day.checkpointId!)?.description === "final") return "Formulário de Avaliação Final 📐"
    }
    const buttonText = getButtonText()
    return (
        <>
            <div className={`btn-primary disabled:z-index[-1] flex flex-row space-x-4 py-2 justify-center items-center ${checkPoints.find(item => item.id === day.checkpointId).formFilled && "bg-white" }`}>
                <Button className={`text-xs text-white ${checkPoints.find(item => item.id === day.checkpointId!)?.formFilled && "bg-gray-400 hover:bg-gray-400"}`}>
                    {
                        checkPoints.find(item => item.id === day.checkpointId!)?.formFilled ? buttonText + "✅" :

                            <Link target="_blank" href={checkPoints.find(item => item.id === day.checkpointId!)?.formUrl && !checkPoints.find(item => item.id === day.checkpointId!)?.formFilled ? checkPoints.find(item => item.id === day.checkpointId!)?.formUrl : "#"}>
                                {buttonText}
                            </Link>
                    }
                </Button>
                {isAdmin && (
                    <Popover>
                        <PopoverTrigger>
                            <SettingsIcon className="w-8 h-8 p-2 rounded-lg text-white bg-gray-400" />
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px]">
                            <div className="space-y-5">
                                <div className="flex space-x-2 items-center align-middle">
                                    <div className="min-w-[80px]">📐 Forms:</div>
                                    <div> <input defaultValue={checkPoints.find(item => item.id === day.checkpointId!)?.formUrl} placeholder={"  colar link aqui"} className="bg-secondary rounded-lg text-cyan-700 pl-3" onBlur={(e) => setFormsLink(day.checkpointId!, e.target.value, checkPoints.find(item => item.id === day.checkpointId!)?.formUrl)}></input></div>
                                </div>
                                <div className="flex flex-row items-center justify-end mr-4">
                                    <div className="text-gray-600 text-sm"> Paciente Preencheu? </div>
                                    <Switch className="ml-4 " checked={checkPoints.find(item => item.id === day.checkpointId!)?.formFilled} onCheckedChange={(e) => setFormFilled(day.checkpointId!, !!e, checkPoints.find(item => item.id === day.checkpointId!)?.formFilled)}></Switch >
                                </div>
                                {
                                    EnabledMetrics.dieta && (
                                        <div className="flex space-x-2 items-center align-middle">
                                            <div className="min-w-[80px]">🥦 Dieta:</div>
                                            <div> <input defaultValue={checkPoints.find(item => item.id === day.checkpointId!)?.dietPlanUrl} placeholder={"  colar link aqui"} className="bg-secondary rounded-lg  text-cyan-700 pl-3" onBlur={(e) => setDietLink(day.checkpointId!, e.target.value, checkPoints.find(item => item.id === day.checkpointId!)?.dietPlanUrl)}></input></div>
                                        </div>
                                    )
                                }
                                {
                                    EnabledMetrics.treino && (
                                        <div className="flex space-x-2 items-center align-middle">
                                            <div className="min-w-[80px]">💪 Treino:</div>
                                            <div> <input defaultValue={checkPoints.find(item => item.id === day.checkpointId!)?.trainingPlanUrl} placeholder={"  colar link aqui"} className="bg-secondary rounded-lg  text-cyan-700 pl-3" onBlur={(e) => setTrainingLink(day.checkpointId!, e.target.value, checkPoints.find(item => item.id === day.checkpointId!)?.trainingPlanUrl)}></input></div>
                                        </div>
                                    )
                                }
                            </div>
                        </PopoverContent>
                    </Popover>
                )
                }
            </div>
        </>
    )
}