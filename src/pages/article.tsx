import { Layout } from "@/components/layout";
import { faBluesky } from "@fortawesome/free-brands-svg-icons/faBluesky";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons/faXTwitter";
import { faCopy } from "@fortawesome/free-regular-svg-icons/faCopy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Article() {
  return (
    <Layout title={"HTD | Article Title"}>
      <div className="bg-gray-50 border-gray-200 border-t px-5 lg:px-20">
        <div className="py-5 flex flex-col lg:flex-row lg:max-w-[1280] w-full lg:justify-self-center">
          <div className="flex-[3] pb-2 lg:pb-0 flex flex-col self-end">
            <h1>What is the Social Security Fairness Act of 2023 About?</h1>
            <span className="body-s">By Pranav Sathyanarayan</span>
            <span className="body-s">Nov 28, 2024</span>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="flex-[1] object-cover h-40 rounded-md"
            src="https://images.unsplash.com/photo-1478576573461-bb5026f9b302?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </div>
      </div>

      <div className="px-5 lg:px-20">
        <div className="py-5 flex flex-col lg:flex-row lg:max-w-[1280] lg:justify-self-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          <div className="flex-[3] pb-8 lg:pb-0 lg:pr-8">
            <p className="body-xl">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Neque porro quisquam est.
            </p>
            <br />
            <p className="body-m">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Neque porro quisquam est. Nemo enim
              ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
              sed quia consequuntur magni dolores eos qui ratione voluptatem
              sequi nesciunt. Neque porro quisquam est.
            </p>
            <br />
            <p className="body-m">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Neque porro quisquam est. Nemo enim
              ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
              sed quia consequuntur magni dolores eos qui ratione voluptatem
              sequi nesciunt. Neque porro quisquam est. Nemo enim ipsam
              voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed
              quia consequuntur magni dolores eos qui ratione voluptatem sequi
              nesciunt. Neque porro quisquam est. Nemo enim ipsam voluptatem
              quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi
              nesciunt.
            </p>
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
