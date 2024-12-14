import Article from "@/components/article";
import { getNMostRecentPosts, getPost } from "@/lib/sanity";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { PortableText } from "next-sanity";

export const getStaticPaths = (async () => {
  const posts = await getNMostRecentPosts();
  const paths = posts.map((d) => ({
    params: { slug: d.slug.current as string },
  }));

  return {
    paths,
    fallback: false,
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  const { post, postImageUrl } = await getPost(params?.slug as string);

  return {
    props: {
      post,
      postImageUrl,
    },
  };
}) satisfies GetStaticProps;

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <Article
      title={props.post.title}
      author={props.post.author}
      description={props.post.description}
      publishedAt={new Date(props.post.publishedAt)}
      imageUrl={props.postImageUrl}
      body={
        Array.isArray(props.post.body) && (
          <PortableText value={props.post.body} />
        )
      }
    />
  );
}
