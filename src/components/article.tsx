import { Layout } from "@/components/layout";
import { faBluesky } from "@fortawesome/free-brands-svg-icons/faBluesky";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons/faXTwitter";
import { faCopy } from "@fortawesome/free-regular-svg-icons/faCopy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

interface Props {
  title: string;
  author: string;
  description: string;
  publishedAt: Date;
  imageUrl?: string;
  body: ReactNode;
}

export default function Article(props: Props) {
  return (
    <Layout title={props.title}>
      <div className="bg-gray-50 border-gray-200 border-t px-5 lg:px-20">
        <div className="py-5 flex flex-col lg:flex-row lg:max-w-[1280px] w-full lg:justify-self-center">
          <div className="flex-[3] pb-2 lg:pb-0 lg:pr-8 flex flex-col lg:self-end">
            <h1>{props.title}</h1>
            <span className="body-s">By {props.author}</span>
            <span className="body-s">
              {new Date(props.publishedAt).toLocaleDateString()}
            </span>
          </div>

          {props.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={props.imageUrl}
              alt={props.title!}
              className="flex-[1] object-cover lg:max-w-[320px] md:max-h-[160px] rounded-md lg:ml-8"
              height={160}
            />
          )}
        </div>
      </div>

      <div className="px-5 lg:px-20">
        <div className="py-5 flex flex-col lg:flex-row lg:max-w-[1280px] lg:justify-self-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          <div className="flex-[3] pb-8 lg:pb-0 lg:pr-8">
            <p className="body-xl mb-4">{props.description}</p>
            <article className="prose max-w-none prose-p:body-m prose-h1:prose-h1 prose-h2:prose-h2 prose-h3:prose-h3">
              {props.body}
            </article>
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
