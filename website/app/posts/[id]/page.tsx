import Image from "next/image";
import { supabaseMachineClient } from "../../lib/supabase";
import { cache } from "react";
import format from "date-fns/format";
import { notFound } from "next/navigation";

type Post = {
  id: string;
  image_url: string;
  inserted_at: string;
  user_id: string;
  comments: {
    count: number;
  }[];
  location: string;
  caption: string;
};

export const getPost = cache(async (postId: string) => {
  const { data: posts } = await supabaseMachineClient
    .from("posts")
    .select(
      "id, image_url, inserted_at, user_id, comments!comments_post_id_fkey(count), location, caption"
    )
    .eq("id", postId)
    .limit(1);
  const post = posts ? posts[0] : null;
  return post;
});

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}) {
  const post = await getPost(id);
  return {
    title: "See the latest Zach Selfie!",
    description: post?.caption || "",
    keywords: ["Zach", "Huxford", "Hot", "Sexy", "Beautiful", "Handsome"],
    authors: [{ name: "Zach Huxford" }],
    creator: "Zach Huxford",
    publisher: "Zach Huxford",
    openGraph: {
      title: "See the latest Zach Selfie!",
      description: post?.caption || "",
      siteName: "Daily Zach",
      images: [
        {
          url: post?.image_url,
        },
      ],
    },
  };
}

export default async function Post({
  params: { id },
}: {
  params: { id: string };
}) {
  const post = await getPost(id);
  if (!post) {
    notFound();
  }
  const postDate = new Date(post?.inserted_at || Date.now());
  const postTime = format(postDate, "h:mm aaa");
  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-20 bg-[#000000] justify-between">
      <div className="relative flex place-items-center flex-col">
        <Image
          className="relative mb-20"
          src={post?.image_url}
          alt="Daily Zach Logo"
          width={180}
          height={180}
          priority
        />
        <h1 className="text-2xl md:text-4xl font-bold text-white text-center">
          {post?.caption && (
            <>
              {post?.caption} <br />
            </>
          )}
          {post?.location ? `${post.location} · ${postTime}` : postTime}
          <br />
          <br />
          View in App
        </h1>
      </div>
    </main>
  );
}
