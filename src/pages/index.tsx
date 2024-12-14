import { Arrow, IndicatorCard } from "@/components/indicator_card";
import { Layout } from "@/components/layout";
import { LegislationCard } from "@/components/legislation_card";
import { LineChart } from "@/components/line_chart";
import { getObservation, type Observation } from "@/lib/fred";
import { getNMostRecentPosts, PostPreview } from "@/lib/sanity";
import { formatDistanceToNow } from "date-fns";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useState } from "react";

interface Indicator {
  label: string;
  data: Observation[];
  inverted?: boolean;
}

interface Props {
  gdp: Indicator;
  unemployment: Indicator;
  wageGrowth: Indicator;
  inflation: Indicator;
  interestRate: Indicator;
  cpi: Indicator;
  debt: Indicator;
  importPriceIndex: Indicator;

  mostRecentPost: PostPreview;
  posts: PostPreview[];
}

type EconomicIndicator = {
  [K in keyof Props]: Props[K] extends Indicator ? K : never;
}[keyof Props];

export const getStaticProps = (async () => {
  const gdp = await getObservation("GDP");
  const unemployment = await getObservation("UNRATE");
  const wageGrowth = await getObservation("FRBATLWGTUMHWGO");
  const inflation = await getObservation("MEDCPIM158SFRBCLE");
  const interestRate = await getObservation("DFF");
  const cpi = await getObservation("CPIAUCSL");
  const debt = await getObservation("GFDEBTN");
  const importPriceIndex = await getObservation("IR");

  const [mostRecentPost, ...posts] = await getNMostRecentPosts(4);

  return {
    props: {
      gdp: { label: "GDP", data: gdp },
      unemployment: {
        label: "Unemployment",
        data: unemployment,
        inverted: true,
      },
      wageGrowth: { label: "Wage Growth", data: wageGrowth },
      inflation: { label: "Inflation", data: inflation, inverted: true },
      interestRate: {
        label: "Interest Rate",
        data: interestRate,
        inverted: true,
      },
      cpi: { label: "CPI", data: cpi, inverted: true },
      debt: { label: "Total Debt", data: debt, inverted: true },
      importPriceIndex: {
        label: "Import Price Index",
        data: importPriceIndex,
        inverted: true,
      },

      mostRecentPost,
      posts,
    },
  };
}) satisfies GetStaticProps<Props>;

const INDICATORS_TO_RENDER: Array<EconomicIndicator> = [
  "gdp",
  "unemployment",
  "wageGrowth",
  "inflation",
  "interestRate",
  "cpi",
  "debt",
  "importPriceIndex",
];

const PERCENT_RENDERER = (d: Observation) =>
  Number(d.value / 100).toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 2,
  });

const INDICATOR_METRIC_RENDERER: Map<
  EconomicIndicator,
  (d: Observation) => string
> = new Map([
  [
    "gdp",
    (d) =>
      `USD ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(d.value / 1000)} Trillion`,
  ],
  ["unemployment", PERCENT_RENDERER],
  ["wageGrowth", PERCENT_RENDERER],
  ["inflation", PERCENT_RENDERER],
  ["interestRate", PERCENT_RENDERER],
  ["cpi", (d) => `${d.value}`],
  [
    "debt",
    (d) =>
      `USD ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(d.value / 1000)} Trillion`,
  ],
  ["importPriceIndex", (d) => `${d.value}`],
]);

// TODO(sathyp): No need to pass all props, just the keys that are economics.
function Indicators(props: Props) {
  const [selectedMetric, setSelectedMetric] =
    useState<EconomicIndicator | null>(null);

  // TODO(sathyp): This should be indexed on Trump taking office.
  const percentDiff = (data: Observation[]) => {
    const A = data[data.length - 1].value ?? 0;
    const B = data[0].value ?? 0;
    return (100 * (A - B)) / B;
  };

  const selectedMetricPercentage = selectedMetric
    ? percentDiff(props[selectedMetric].data)
    : 0;

  return (
    <div className="py-10 bg-gray-50 border-gray-200 border-y">
      <div className="flex flex-col px-5 lg:px-20 space-y-2 max-w-[1280px] w-full justify-self-center">
        <span className="text-gray-500 font-medium text-xs">
          {/* TODO(sathyp): This should say since Trump took office. */}
          Since Jan 1, 2020
        </span>

        <div className="flex flex-row overflow-x-auto space-x-2">
          {INDICATORS_TO_RENDER.map((indicator) => (
            <IndicatorCard
              key={indicator}
              selected={selectedMetric === indicator}
              onClick={() =>
                setSelectedMetric(
                  selectedMetric === indicator ? null : indicator
                )
              }
              label={props[indicator].label}
              percentage={percentDiff(props[indicator].data)}
              inverted={props[indicator].inverted}
            />
          ))}
        </div>

        {selectedMetric != null && props[selectedMetric].data.length > 0 && (
          <div className="pt-2 flex flex-col space-y-2 text-gray-900">
            <div className="flex space-x-2 items-end">
              <h2>{props[selectedMetric].label}</h2>
              {INDICATOR_METRIC_RENDERER.has(selectedMetric) && (
                <h3 className="text-gray-500">
                  {INDICATOR_METRIC_RENDERER.get(selectedMetric)!(
                    props[selectedMetric].data[
                      props[selectedMetric].data.length - 1
                    ]
                  )}
                </h3>
              )}
            </div>
            <div className="flex space-x-2">
              <span className="chart-percentage">
                {Number(selectedMetricPercentage / 100).toLocaleString(
                  undefined,
                  {
                    style: "percent",
                    minimumFractionDigits: 2,
                  }
                )}
              </span>
              <Arrow
                classes="self-end"
                percentage={selectedMetricPercentage}
                inverted={props[selectedMetric].inverted}
              />
              <span className="body-title text-gray-500 self-end">
                Since Jan 1, 2020
              </span>
            </div>
            <div className="bg-white border max-w-[1120px] border-gray-200 rounded-md">
              <LineChart
                data={props[selectedMetric].data}
                invertColors={props[selectedMetric].inverted}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LegislationToWatch() {
  return (
    <div className="flex-[1] pt-8 lg:pt-0 lg:pl-8 flex flex-col space-y-4">
      <span className="body-title text-gray-500">Legislation To Watch</span>

      <LegislationCard
        title="H.R. 390: Maurice D. Hinchey Hudson River Valley National Heritage
      Area Enhancement Act"
        subtext="Passed House on Mar 7, 2025"
      />

      <LegislationCard
        title="S. 3970: A bill to amend title 38, United States Code, to ensure that the Secretary of Veterans Affairs repays members of the Armed Forces for certain contributions made by such members towards Post-9/11 Educational Assistance, and for other purposes."
        subtext="Passed House on Jan 27, 2025"
      />

      <LegislationCard
        title="H.R. 3738: Veterans Economic Opportunity and Transition Administration Act"
        subtext="Passed House on Mar 7, 2025"
      />

      <LegislationCard
        title="S. 656: Veteran Improvement Commercial Driver License Act of 2023"
        subtext="Passed House on Jan 27, 2025"
      />

      <LegislationCard
        title="H.R. 390: Maurice D. Hinchey Hudson River Valley National Heritage Area Enhancement Act"
        subtext="Passed House on Mar 7, 2025"
      />
    </div>
  );
}

interface ArticleProps {
  title: string;
  headline: string;
  author: string;
  date: Date;
  img: string;
  url: string;
}

function OlderArticle({ title, headline, date, img, url }: ArticleProps) {
  return (
    <Link href={url} className="flex-1 flex flex-col space-y-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className="h-40 rounded-md" src={img} />
      <h3 className="hover:underline">{title}</h3>
      <p className="body-s">{headline}</p>
      <span className="body-title text-gray-500">
        {formatDistanceToNow(date, { addSuffix: true })}
      </span>
    </Link>
  );
}

function TopArticle({ title, headline, date, img, url, author }: ArticleProps) {
  return (
    <Link
      href={url}
      className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className="h-56 rounded-md" src={img} />
      <div className="flex flex-col space-y-2">
        <span className="body-title text-gray-500">
          {formatDistanceToNow(date, { addSuffix: true })}
        </span>
        <h2 className="hover:underline">{title}</h2>
        <p className="body-l">{headline}</p>
        <span className="font-semibold text-sm">By {author}</span>
      </div>
    </Link>
  );
}

export default function Home(props: Props) {
  return (
    <Layout title={"Hows Trump Doing"}>
      <Indicators {...props} />

      <div className="p-5 lg:p-20 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200 lg:max-w-[1280px] lg:justify-self-center">
        <div className="flex-[3] pb-8 lg:pb-0 lg:pr-8 flex flex-col divide-y divide-gray-200">
          {/* Top Article */}
          <div className="pb-8">
            <TopArticle
              url={`/${props.mostRecentPost.slug.current}`}
              img={props.mostRecentPost.image ?? ""}
              author={props.mostRecentPost.author}
              title={props.mostRecentPost.title}
              headline={props.mostRecentPost.description}
              date={new Date(props.mostRecentPost.publishedAt)}
            />
          </div>

          {/* Next 3 */}
          <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 pt-8">
            {props.posts.map((p) => (
              <OlderArticle
                key={p._id}
                url={`/${p.slug.current}`}
                img={p.image ?? ""}
                title={p.title}
                headline={p.description}
                date={new Date(p.publishedAt)}
                author={p.author}
              />
            ))}

            {[...Array(3 - props.posts.length)].map((_, idx) => (
              <div key={idx} className="flex-1"></div>
            ))}
          </div>
        </div>
        <LegislationToWatch />
      </div>
    </Layout>
  );
}
