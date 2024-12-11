import { Layout } from "@/components/layout";
import { faBluesky } from "@fortawesome/free-brands-svg-icons/faBluesky";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons/faXTwitter";
import { faCopy } from "@fortawesome/free-regular-svg-icons/faCopy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home() {
  return (
    <Layout title={"Hows Trump Doing | Mission"}>
      <div className="bg-gray-50 border-gray-200 border-t px-5 lg:px-20">
        <div className="py-5 flex flex-col lg:flex-row lg:max-w-[1280] w-full lg:justify-self-center">
          <div className="flex-[3] pb-2 lg:pb-0 flex flex-col self-end">
            <h1>Hows Trump Doing?</h1>
            <span className="body-s">By Pranav Sathyanarayan</span>
            <span className="body-s">Dec 11, 2024</span>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="flex-[1] object-cover h-40 rounded-md"
            src="/trump_vector.webp"
          />
        </div>
      </div>

      <div className="px-5 lg:px-20">
        <div className="py-5 flex flex-col lg:flex-row lg:max-w-[1280] lg:justify-self-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          <div className="flex-[3] pb-8 lg:pb-0 lg:pr-8">
            <p className="body-xl">
              The results of the 2024 political election was a wake-up call for
              nearly half of the nation. Donald Trump and his party managed to
              sweep every swing state (including the so-called “Blue Wall”), the
              popular vote, the Senate, and most-likely the House of
              Representatives.
            </p>
            <br />
            <p className="body-m">
              The morning of Nov 6th, texts between family and friends for
              millions of Americans revealed two different interpretations of
              the historic election depending on viewpoint. On the one hand
              people believed it was the beginning of an American Renaissance,
              and on the other hand people believed that American democracy was
              teetering on the brink of collapse.
            </p>
            <br />
            <p className="body-m">
              One thing was exceedingly clear, each side is perceiving a
              dramatically different truth. To half the country, we have elected
              a convicted felon, and to the other half, his convictions were
              tantamount to stifling dissent by the political elites. To half
              the country, he provides a voice for their concerns, while the
              other half feel their voice disappearing.
            </p>

            <iframe
              title="Whether Americans say the economy is getting better reflects which party holds the White House"
              aria-label="Interactive line chart"
              id="datawrapper-chart-li1cN"
              src="https://datawrapper.dwcdn.net/li1cN/1/"
              className="border-none min-w-[100%] h-[464px] my-8"
              data-external="1"
            ></iframe>

            <h2>Goals</h2>
            <br />

            <p className="body-m">
              My goal with HowsTrumpDoing.com is to educate myself, and anyone
              else who wants to join me, in tracking and chronicling the impact
              of the (as of writing) incoming Trump administration. I want to do
              that by being honest, transparent, and simply research actual
              facts around executive orders, statements, and policies drafted
              and/or endorsed by the 47th POTUS.
            </p>
            <br />

            <p className="body-m">
              You can think of this as an actual exercise in citizen journalism,
              with a focus on tracking all of the key economic, social, and
              environmental indicators that are possible over the course of the
              next 4+ years.{" "}
            </p>
            <br />

            <p className="body-m">This endeavor will:</p>
            <br />

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
                Aim to diligently research and learn more about the impact of
                the 47th POTUS on the economy, social issues, foreign policy and
                our environment.
              </li>
            </ol>
            <br />

            <p className="body-m">
              In the process of doing all of this, I would like to invite anyone
              and everyone to help me partake in this journey that’s willing to
              contribute in any way shape and form.
            </p>
            <br />

            <p className="body-m">
              I am not interested in opinions, conspiracy theories, or anecdotal
              evidence; this community will be directed towards only factual,
              non-partisan, data-driven research of the impact of Trump’s
              policies.
            </p>
            <br />
          </div>

          <div className="flex-[1] pt-8 lg:pt-0 lg:pl-8 flex flex-col space-y-4">
            <span className="body-title text-gray-500">Share This</span>

            {/* TODO(sathyp): Actually link these out. */}
            <div className="flex space-x-2">
              <FontAwesomeIcon
                icon={faXTwitter}
                className="size-8 rounded-md border border-gray-200 p-1 cursor-pointer hover:shadow"
              />
              <FontAwesomeIcon
                icon={faInstagram}
                className="size-8 rounded-md border border-gray-200 p-1 cursor-pointer hover:shadow"
              />
              <FontAwesomeIcon
                icon={faBluesky}
                className="size-8 rounded-md border border-gray-200 p-1 cursor-pointer hover:shadow"
              />
              <FontAwesomeIcon
                icon={faCopy}
                className="size-8 rounded-md border border-gray-200 p-1 cursor-pointer hover:shadow"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
