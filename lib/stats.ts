import { DailyDataTypeArr, enabledMetricsType } from "@/types/programs";

export function getLast30DaysStatsByIndex(indexInput: number, optimisticDays: DailyDataTypeArr, enabledMetrics: enabledMetricsType) {
    console.log("func called")
    // const selectedDate = optimisticDays[index].date;
    // const startDate = new Date(selectedDate);
    // startDate.setDate(selectedDate.getDate() - 30);

    const last30DaysData = optimisticDays.filter((day, index) => index >= indexInput - 29 && index <= indexInput);

    //first non null value for weight
    const firstWeight = last30DaysData.find((day) => day.weight)?.weight;

    //last non null value for weight
    const lastWeight = last30DaysData.reverse().find((day) => day.weight)?.weight;

    const result: any = {};
    let totalDiet = 0;
    let totalExercise = 0;
    let totalDaysUntilNow = 0
    let WeightVariation = parseFloat(lastWeight!) - parseFloat(firstWeight!)

    for (const day of last30DaysData) {
        if (day.date < new Date()) {
            totalDaysUntilNow++
        }

        if (enabledMetrics.dieta) {

            if (day.diet) {
                totalDiet++;
            }
        }

        if (enabledMetrics.treino) {
            if (day.exercise) {
                totalExercise++;
            }
        }
    }

    const percentageDiet = (totalDiet * 100 / totalDaysUntilNow).toFixed(0)
    const percentageExercise = (totalExercise * 100 / totalDaysUntilNow).toFixed(0)

    return {
        ...(enabledMetrics.dieta ? { diet: { total: totalDiet, percentage: percentageDiet !== 'NaN' ? percentageDiet : 0 } } : {}),
        ...(enabledMetrics.treino ? { exercise: { total: totalExercise, percentage: percentageExercise !== 'NaN' ? percentageExercise : 0 } } : {}),
        ...(enabledMetrics.peso ? { weight: { total: WeightVariation ? WeightVariation.toFixed(1) : 0 } } : {}),
    };
}