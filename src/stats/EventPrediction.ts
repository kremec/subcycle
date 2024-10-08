import { Event, EventPeriod } from '../app/Types'
import { getAverageEventCycleLength, getAverageEventPeriodLength, getEventPeriods } from './CycleStats'

export const getPredictions = (eventPeriods: EventPeriod[], predictionPeriod: number, averageEventCycleLength: number, averageEventPeriodLength: number) => {
    const predictedDates: Date[] = []
    var lastEventPeriodStartDate = eventPeriods[eventPeriods.length - 1].start
    for (let sequentialPrediction = 0; sequentialPrediction < predictionPeriod; sequentialPrediction++) {
        lastEventPeriodStartDate = new Date(new Date(lastEventPeriodStartDate).setDate(lastEventPeriodStartDate.getDate() + averageEventCycleLength))
        for (let dayInPredictedPeriod = 0; dayInPredictedPeriod < averageEventPeriodLength; dayInPredictedPeriod++) {
            const date = new Date(new Date(lastEventPeriodStartDate).setDate(lastEventPeriodStartDate.getDate() + dayInPredictedPeriod))
            predictedDates.push(date)
        }
    }

    return predictedDates
}

export const getMenstruationPredictions = (events: Event[], predictionPeriod: number): Event[] => {
    const menstruationPeriods: EventPeriod[] = getEventPeriods(events, ["menstruationLight", "menstruationModerate", "menstruationHeavy", "menstruationSpotting"])

    var averageMenstruationCycleLength = getAverageEventCycleLength(menstruationPeriods)
    if (Number.isNaN(averageMenstruationCycleLength))
        return []

    const averageMenstruationPeriodLength = Math.round(getAverageEventPeriodLength(menstruationPeriods))

    const predictedDates = getPredictions(menstruationPeriods, predictionPeriod, averageMenstruationCycleLength, averageMenstruationPeriodLength)
    return predictedDates.map((date) => ({ date, menstruationLight: false, menstruationModerate: true, menstruationHeavy: false, menstruationSpotting: false, ovulation: false, pill: false, prediction: true }))
}

export const getOvulationPredictions = (events: Event[], predictionPeriod: number) => {
    const ovulationPeriods: EventPeriod[] = getEventPeriods(events, ["ovulation"])

    var averageOvulationCycleLength = getAverageEventCycleLength(ovulationPeriods)
    if (Number.isNaN(averageOvulationCycleLength))
        return []

    const averageOvulationPeriodLength = Math.round(getAverageEventPeriodLength(ovulationPeriods))

    const predictedDates = getPredictions(ovulationPeriods, predictionPeriod, averageOvulationCycleLength, averageOvulationPeriodLength)
    return predictedDates.map((date) => ({ date, menstruationLight: false, menstruationModerate: false, menstruationHeavy: false, menstruationSpotting: false, ovulation: true, pill: false, prediction: true }))
}
