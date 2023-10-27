import { FC } from "react";
import { Slot } from "expo-router";

type Post = {
  id: string;
  image_url: string;
};

const Post: FC = () => {
  return <Slot />
};

export default Post;
