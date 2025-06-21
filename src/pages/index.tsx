import { Arrow, IndicatorCard } from "@/components/indicator_card";
import { Layout } from "@/components/layout";
import { LineChart } from "@/components/line_chart";
import {
  calculatePercentDifference,
  getObservation,
  type Observation,
} from "@/lib/fred";
import {
  getNMostRecentLegislations,
  getNMostRecentPosts,
  Legislation,
  PostPreview,
} from "@/lib/sanity";
import { format, formatDistanceToNow } from "date-fns";
import { GetStaticProps } from "next";
import Link from "next/link";
import React, { useState } from "react";

interface Indicator {
  label: string;
  data: Observation[];
  inverted?: boolean;
  citation: string;
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

  legislations: Legislation[];
}

type EconomicIndicator = {
  [K in keyof Props]: Props[K] extends Indicator ? K : never;
}[keyof Props];

const QUARTERLY_INDICATORS: Set<EconomicIndicator> = new Set(["gdp", "debt"]);

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
  const legislations = await getNMostRecentLegislations(5);

  return {
    props: {
      gdp: {
        label: "GDP",
        data: gdp,
        citation:
          "U.S. Bureau of Economic Analysis, Gross Domestic Product [GDP], retrieved from FRED, Federal Reserve Bank of St. Louis; https://fred.stlouisfed.org/series/GDP",
      },
      unemployment: {
        label: "Unemployment",
        data: unemployment,
        inverted: true,
        citation:
          "U.S. Bureau of Labor Statistics, Unemployment Rate [UNRATE], retrieved from FRED, Federal Reserve Bank of St. Louis; https://fred.stlouisfed.org/series/UNRATE",
      },
      wageGrowth: {
        label: "Wage Growth",
        data: wageGrowth,
        citation:
          "Federal Reserve Bank of Atlanta, Unweighted Median Hourly Wage Growth: Overall [FRBATLWGTUMHWGO], retrieved from FRED, Federal Reserve Bank of St. Louis; https://fred.stlouisfed.org/series/FRBATLWGTUMHWGO",
      },
      inflation: {
        label: "Inflation",
        data: inflation,
        inverted: true,
        citation:
          "Federal Reserve Bank of Cleveland, Median Consumer Price Index [MEDCPIM158SFRBCLE], retrieved from FRED, Federal Reserve Bank of St. Louis; https://fred.stlouisfed.org/series/MEDCPIM158SFRBCLE",
      },
      interestRate: {
        label: "Interest Rate",
        data: interestRate,
        inverted: true,
        citation:
          "Board of Governors of the Federal Reserve System (US), Federal Funds Effective Rate [DFF], retrieved from FRED, Federal Reserve Bank of St. Louis; https://fred.stlouisfed.org/series/DFF",
      },
      cpi: {
        label: "CPI",
        data: cpi,
        inverted: true,
        citation:
          "U.S. Bureau of Labor Statistics, Consumer Price Index for All Urban Consumers: All Items in U.S. City Average [CPIAUCSL], retrieved from FRED, Federal Reserve Bank of St. Louis; https://fred.stlouisfed.org/series/CPIAUCSL",
      },
      debt: {
        label: "Total Debt",
        data: debt,
        inverted: true,
        citation:
          "U.S. Department of the Treasury. Fiscal Service, Federal Debt: Total Public Debt [GFDEBTN], retrieved from FRED, Federal Reserve Bank of St. Louis; https://fred.stlouisfed.org/series/GFDEBTN",
      },
      importPriceIndex: {
        label: "Import Price Index",
        data: importPriceIndex,
        inverted: true,
        citation:
          "U.S. Bureau of Labor Statistics, Import Price Index (End Use): All Commodities [IR], retrieved from FRED, Federal Reserve Bank of St. Louis; https://fred.stlouisfed.org/series/IR",
      },

      mostRecentPost,
      posts,
      legislations,
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
      }).format(d.value / 1_000_000)} Trillion`,
  ],
  ["importPriceIndex", (d) => `${d.value}`],
]);

function AutoLinkText({ text }: { text: string }) {
  const urlRegex = /https?:\/\/[^\s]+/g;

  const parts = text.split(urlRegex);
  const urls = text.match(urlRegex);

  return (
    <span>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {urls && urls[index] && (
            <a
              href={urls[index]}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {urls[index]}
            </a>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}

// TODO(sathyp): No need to pass all props, just the keys that are economics.
function Indicators(props: Props) {
  const [selectedMetric, setSelectedMetric] =
    useState<EconomicIndicator | null>(null);

  const selectedMetricPercentage = selectedMetric
    ? calculatePercentDifference(props[selectedMetric].data)
    : 0;

  return (
    <div className="py-10 bg-gray-50 border-gray-200 border-y">
      <div className="flex flex-col px-5 lg:px-20 space-y-2 max-w-[1280px] w-full justify-self-center">
        <span className="text-gray-500 font-medium text-xs">
          Since Jan 20, 2025
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
              percentage={calculatePercentDifference(props[indicator].data)}
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
                {Number((selectedMetricPercentage ?? 0) / 100).toLocaleString(
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
                Since Jan 20, 2025
              </span>
            </div>
            <div className="bg-white border max-w-[1120px] border-gray-200 rounded-md">
              <LineChart
                data={props[selectedMetric].data}
                invertColors={props[selectedMetric].inverted}
                quarterly={QUARTERLY_INDICATORS.has(selectedMetric)}
              />
            </div>
            <p className="font-semibold chart-citation text-gray-500">
              <AutoLinkText
                text={`${props[selectedMetric].citation} , ${format(new Date(), "MMMM d, yyyy")}`}
              />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// function LegislationToWatch(props: { legislations: Legislation[] }) {
//   return (
//     <div className="flex-[1] pt-8 lg:pt-0 lg:pl-8 flex flex-col space-y-4">
//       <span className="body-title text-gray-500">Legislation To Watch</span>

//       {props.legislations.map((l) => (
//         <LegislationCard
//           key={l._id}
//           title={l.title}
//           subtext={l.status}
//           link={l.link}
//         />
//       ))}
//     </div>
//   );
// }

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
        {/* TODO(sathyp): This has been difficult to keep up with, will re-enable this later. */}
        {/* <LegislationToWatch legislations={props.legislations} /> */}
      </div>
    </Layout>
  );
}
