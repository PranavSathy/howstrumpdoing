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

interface LegislationType {
  title: string;
  link: string;
  status: string;
  description: string;
}

type SanityArticle = SanityDocument<ArticleType>;
type SanityLegislation = SanityDocument<LegislationType>;

const N_MOST_RECENT_LEGISLATIONS_QUERY = `*[
  _type == "legislation"
]|order(_updatedAt desc)[0...$limit]{_id, title, link, status, description}`;

export async function getNMostRecentLegislations(limit: number) {
  return client.fetch<SanityLegislation[]>(
    N_MOST_RECENT_LEGISLATIONS_QUERY,
    { limit },
    { next: { revalidate: 30 } }
  );
}

export type Legislation = Awaited<
  ReturnType<typeof getNMostRecentLegislations>
>[number];

const N_MOST_RECENT_POSTS_QUERY = `*[
    _type == "post"
    && defined(slug.current)
  ]|order(publishedAt desc)[0...$limit]{_id, slug, publishedAt, title, description, image, author}`;

export async function getNMostRecentPosts(limit: number) {
  const posts = await client.fetch<SanityArticle[]>(
    N_MOST_RECENT_POSTS_QUERY,
    { limit },
    { next: { revalidate: 30 } }
  );
  return posts.map((p) => ({
    ...p,
    image: p.image ? urlFor(p.image)?.width(320).height(160).url() : undefined,
  }));
}

export type PostPreview = Awaited<
  ReturnType<typeof getNMostRecentPosts>
>[number];

const ALL_POSTS_SLUGS_QUERY = `*[
    _type == "post"
    && defined(slug.current)
  ]|order(publishedAt desc){_id, slug}`;

export async function getAllPostSlugs() {
  return client.fetch<SanityArticle[]>(
    ALL_POSTS_SLUGS_QUERY,
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
