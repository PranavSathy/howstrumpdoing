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
  const data = await fred.series.getObservationsForSeries(observation);
  return data.observations
    .map((o) => ({
      date: o.date,
      value: Number(o.value),
    }))
    .filter((v) => isAfter(v.date, "2019-12-31"));
}
