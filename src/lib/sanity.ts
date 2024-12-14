import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { createClient, PortableTextBlock, SanityDocument } from "next-sanity";

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

interface ArticleType {
  title: string;
  author: string;
  slug: { current: string };
  description: string;
  publishedAt: string;
  image: SanityImageSource;
  body: PortableTextBlock;
}

type SanityArticle = SanityDocument<ArticleType>;

// TODO(sathyp): Have this query literally every article.
const N_MOST_RECENT_POSTS_QUERY = `*[
    _type == "post"
    && defined(slug.current)
  ]|order(publishedAt desc)[0...12]{_id, slug}`;

export async function getNMostRecentPosts() {
  return client.fetch<SanityArticle[]>(
    N_MOST_RECENT_POSTS_QUERY,
    {},
    { next: { revalidate: 30 } }
  );
}

const POST_QUERY_FOR_SLUG = `*[_type == "post" && slug.current == $slug][0]`;

export async function getPost(slug: string) {
  const post = await client.fetch<SanityArticle>(
    POST_QUERY_FOR_SLUG,
    { slug },
    { next: { revalidate: 30 } }
  );
  const postImageUrl = post.image
    ? urlFor(post.image)?.width(320).height(160).url()
    : undefined;

  return {
    post,
    postImageUrl,
  };
}
