import { IndicatorCard } from "@/components/indicator_card";
import { Layout } from "@/components/layout";
import { LegislationCard } from "@/components/legislation_card";

function Indicators() {
  return (
    // TODO(sathyp): This overflows X and looks ugly.
    <div className="grid py-10 bg-gray-50 border-gray-200 border-y px-5 lg:px-20">
      <div className="flex flex-col space-y-2 overflow-x-auto max-w-[1280] w-full justify-self-center">
        <span className="text-gray-500 font-medium text-xs">
          Since taking office
        </span>

        <div className="flex flex-row space-x-2">
          <IndicatorCard label="GDP" percentage={-0.7} />
          <IndicatorCard label="Unemployment" percentage={5.2} />
          <IndicatorCard label="Wage Growth" percentage={1.68} />
          <IndicatorCard label="Inflation" percentage={-0.23} />
          <IndicatorCard label="Interest Rate" percentage={2.8} />
          <IndicatorCard label="CPI" percentage={2.78} />
          <IndicatorCard label="Approval Rating" percentage={-12.5} />
        </div>
      </div>
    </div>
  );
}

function LegislationToWatch() {
  return (
    <div className="flex-[1] pt-8 lg:pt-0 lg:pl-8 flex flex-col space-y-4">
      <span className="font-title text-gray-500">Legislation To Watch</span>

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
  date: string;
  img: string;
}

function OlderArticle({ title, headline, date, img }: ArticleProps) {
  return (
    <div className="flex flex-col space-y-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className="h-40 rounded-md" src={img} />
      <h3>{title}</h3>
      <p className="body-s">{headline}</p>
      <span className="font-title text-gray-500">{date}</span>
    </div>
  );
}

function TopArticle({ title, headline, date, img, author }: ArticleProps) {
  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className="h-56 rounded-md" src={img} />
      <div className="flex flex-col space-y-2">
        <span className="font-title text-gray-500">{date}</span>
        <h2>{title}</h2>
        <p className="body-l">{headline}</p>
        <span className="font-semibold text-sm">By {author}</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout title={"Hows Trump Doing"}>
      <Indicators />

      <div className="p-5 lg:p-20 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200 lg:max-w-[1280] lg:justify-self-center">
        <div className="flex-[3] pb-8 lg:pb-0 lg:pr-8 flex flex-col divide-y divide-gray-200">
          {/* Top Article */}
          <div className="pb-8">
            <TopArticle
              img="https://images.unsplash.com/photo-1478576573461-bb5026f9b302?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              author="Pranav Sathyanarayanan"
              title="What is the Social Security Fairness Act of 2023 About?"
              headline="Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt."
              date="3 Days Ago"
            />
          </div>

          {/* Next 3 */}
          <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 pt-8">
            <OlderArticle
              img="https://images.unsplash.com/photo-1478576573461-bb5026f9b302?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              title="Trump Cabinet nominees targeted in attacks ranging from 'bomb threats' to 'swatting'"
              headline="Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt."
              date="3 Days Ago"
              author="Pranav Sathyanarayanan"
            />

            <OlderArticle
              img="https://images.unsplash.com/photo-1478576573461-bb5026f9b302?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              title="Trump Cabinet nominees targeted in attacks ranging from 'bomb threats' to 'swatting'"
              headline="Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt."
              date="3 Days Ago"
              author="Pranav Sathyanarayanan"
            />

            <OlderArticle
              img="https://images.unsplash.com/photo-1478576573461-bb5026f9b302?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              title="Trump Cabinet nominees targeted in attacks ranging from 'bomb threats' to 'swatting'"
              headline="Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt."
              date="3 Days Ago"
              author="Pranav Sathyanarayanan"
            />
          </div>
        </div>
        <LegislationToWatch />
      </div>
    </Layout>
  );
}
