import { DailyDataTypeArr, enabledMetricsType } from "@/types/programs";

export function getLast30DaysStatsByIndex(indexInput: number, optimisticDays: DailyDataTypeArr, enabledMetrics: enabledMetricsType) {
    console.log("getLast30DaysStatsByIndex")
    const last30DaysData = optimisticDays.filter((day, index) => index >= indexInput - 29 && index <= indexInput);

    //first non null value for weight
    const firstWeight = last30DaysData.find((day) => day.weight)?.weight;

    //last non null value for weight
    const lastWeight = last30DaysData.reverse().find((day) => day.weight)?.weight;

    const result: any = {};
    let totalDiet = 0;
    let totalExercise = 0;
    let totalCardioDays = 0;
    let totalCardioMinutes = 0;
    let totalDaysUntilNow = 0
    let WeightVariation: any = parseFloat(lastWeight!) - parseFloat(firstWeight!)
    if (isNaN(WeightVariation)) {
        WeightVariation = "0"
    } else if(WeightVariation < 0){
        WeightVariation = `${(WeightVariation).toFixed(1).toString()}`
    } else if (WeightVariation > 0) {
        WeightVariation = `${WeightVariation.toFixed(1)}`
    }

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

        if (enabledMetrics.cardio) {
            if (day.cardio) {
                totalCardioDays++;
                totalCardioMinutes += parseInt(day.cardio);
            }
        }
    }
    const percentageDiet = (totalDiet * 100 / totalDaysUntilNow).toFixed(0)
    const percentageExercise = (totalExercise * 100 / totalDaysUntilNow).toFixed(0)

    return {
        ...(enabledMetrics.dieta ? { diet: { total: totalDiet, percentage: percentageDiet !== 'NaN' ? percentageDiet : 0 } } : {}),
        ...(enabledMetrics.treino ? { exercise: { total: totalExercise, percentage: percentageExercise !== 'NaN' ? percentageExercise : 0 } } : {}),
        ...(enabledMetrics.cardio ? { cardio: { totalDays: totalCardioDays, totalMinutes:totalCardioMinutes } } : {}),
        ...(enabledMetrics.peso ? { weight: { total: parseFloat(WeightVariation) } } : {}),
    };
}

export function getTotalDaysStatsByIndex(indexInput: number, optimisticDays: DailyDataTypeArr, enabledMetrics: enabledMetricsType) {
    //first non null value for weight
    const firstWeight = optimisticDays.find((day) => day.weight)?.weight;
    //last non null value for weight
    const lastWeight = optimisticDays.reverse().find((day) => day.weight)?.weight;
    optimisticDays.reverse()
    const result: any = {};
    let totalDiet = 0;
    let totalExercise = 0;
    let totalCardioDays = 0;
    let totalCardioMinutes = 0;
    let totalDaysUntilNow = 0
    let WeightVariation: any = parseFloat(lastWeight!) - parseFloat(firstWeight!)
    if (isNaN(WeightVariation)) {
        WeightVariation = "0"
    } else if(WeightVariation < 0){
        WeightVariation = `${(WeightVariation).toFixed(1).toString()}`
    } else if (WeightVariation > 0) {
        WeightVariation = `${WeightVariation.toFixed(1)}`
    }

    for (const day of optimisticDays) {
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

        if (enabledMetrics.cardio) {
            if (day.cardio) {
                totalCardioDays++;
                totalCardioMinutes += parseInt(day.cardio);
            }
        }
    }

    const percentageDiet = (totalDiet * 100 / totalDaysUntilNow).toFixed(0)
    const percentageExercise = (totalExercise * 100 / totalDaysUntilNow).toFixed(0)

    return {
        ...(enabledMetrics.dieta ? { diet: { total: totalDiet, percentage: percentageDiet !== 'NaN' ? percentageDiet : 0 } } : {}),
        ...(enabledMetrics.treino ? { exercise: { total: totalExercise, percentage: percentageExercise !== 'NaN' ? percentageExercise : 0 } } : {}),
        ...(enabledMetrics.cardio ? { cardio: { totalDays: totalCardioDays, totalMinutes:totalCardioMinutes } } : {}),
        ...(enabledMetrics.peso ? { weight: { total: parseFloat(WeightVariation) } } : {}),
    };
}