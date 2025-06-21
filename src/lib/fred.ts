import { isAfter } from "date-fns";
import Fred from "node-fred";

const fred = new Fred(process.env.FRED_API_KEY ?? "");

export interface Observation {
  date: string;
  value: number;
}

type FredObservations =
  | "GDP"
  | "UNRATE"
  | "FRBATLWGTUMHWGO"
  | "MEDCPIM158SFRBCLE"
  | "DFF"
  | "CPIAUCSL"
  | "GFDEBTN"
  | "IR";

export async function getObservation(
  observation: FredObservations
): Promise<Observation[]> {
  console.log(`Querying FRED Observation data for Series: ${observation}`);
  try {
    const data = await fred.series.getObservationsForSeries(observation);
    return data.observations
      .map((o) => ({
        date: o.date,
        value: Number(o.value),
      }))
      .filter((v) => isAfter(v.date, "2019-12-31"));
  } catch {
    return [];
  }
}

export const INAUGURATION_DAY = new Date(2025, 1, 20);

export function findClosestBefore(
  observations: Observation[],
  targetDate: Date
): Observation | null {
  const targetTime = targetDate.getTime();

  return (
    observations
      .filter((obs) => new Date(obs.date).getTime() <= targetTime)
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0] || null
  );
}

export function calculatePercentDifference(
  observations: Observation[]
): number | null {
  const today = new Date();

  const obsBeforeJan2025 = findClosestBefore(observations, INAUGURATION_DAY);
  const obsBeforeToday = findClosestBefore(observations, today);

  if (!obsBeforeJan2025 || !obsBeforeToday || obsBeforeJan2025.value === 0) {
    return null;
  }

  const percentDiff =
    ((obsBeforeToday.value - obsBeforeJan2025.value) / obsBeforeJan2025.value) *
    100;
  return percentDiff;
}
