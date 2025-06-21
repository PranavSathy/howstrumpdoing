import Article from "@/components/article";

export default function Mission() {
  return (
    <Article
      title="How's Trump Doing"
      author={"Pranav Sathyanarayanan"}
      description="The results of the 2024 political election was a wake-up call for
              nearly half of the nation. Donald Trump and his party managed to
              sweep every swing state (including the so-called “Blue Wall”), the
              popular vote, the Senate, and most-likely the House of
              Representatives."
      publishedAt={new Date("2024-12-11")}
      imageUrl={"/trump_vector.webp"}
      body={
        <>
          <p>
            The morning of Nov 6th, texts between family and friends for
            millions of Americans revealed two different interpretations of the
            historic election depending on viewpoint. On the one hand people
            believed it was the beginning of an American Renaissance, and on the
            other hand people believed that American democracy was teetering on
            the brink of collapse.
          </p>
          <p>
            One thing was exceedingly clear, each side is perceiving a
            dramatically different truth. To half the country, we have elected a
            convicted felon, and to the other half, his convictions were
            tantamount to stifling dissent by the political elites. To half the
            country, he provides a voice for their concerns, while the other
            half feel their voice disappearing.
          </p>

          <iframe
            title="Whether Americans say the economy is getting better reflects which party holds the White House"
            aria-label="Interactive line chart"
            id="datawrapper-chart-li1cN"
            src="https://datawrapper.dwcdn.net/li1cN/1/"
            className="border-none min-w-full h-[464px] my-8"
            data-external="1"
          ></iframe>

          <h2>Goals</h2>

          <p>
            My goal with HowsTrumpDoing.com is to educate myself, and anyone
            else who wants to join me, in tracking and chronicling the impact of
            the (as of writing) incoming Trump administration. I want to do that
            by being honest, transparent, and simply research actual facts
            around executive orders, statements, and policies drafted and/or
            endorsed by the 47th POTUS.
          </p>

          <p>
            The execution will rely on AI agents to assess various sources of
            information to distill this information into easy to digest
            information on a weekly basis. These agents will be developed in a
            transparent fashion, available for anyone to suggest modifications
            or contribute to.
          </p>

          <p>
            This is an exercise in AI-enabled citizen journalism, with a focus
            on tracking all of the key economic, social, and environmental
            indicators that are possible over the course of the next 4+ years.{" "}
          </p>

          <p>This endeavor will:</p>

          <ol className="list-decimal list-inside">
            <li>
              Acknowledge that the President won in a fair, democratic process
              that represented the opinions and feelings of a majority of
              Americans.
            </li>
            <li>
              Genuinely wish that he succeeds in office and acts in the best
              interests of the American public while doing so.
            </li>
            <li>
              Aim to diligently research and learn more about the impact of the
              47th POTUS on the economy, social issues, foreign policy and our
              environment.
            </li>
          </ol>

          <p>
            In the process of doing all of this, I would like to invite anyone
            and everyone to help me partake in this journey that’s willing to
            contribute in any way shape and form.
          </p>

          <p>
            I am not interested in opinions, conspiracy theories, or anecdotal
            evidence; this community will be directed towards only factual,
            non-partisan, data-driven research of the impact of Trump’s
            policies.
          </p>
        </>
      }
    />
  );
}
