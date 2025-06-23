import React from "react";
import Feed from "./Feed";
import { useGetCommentsByPostId } from "../../hooks/usePosts";

interface CommentFeedProps {
  postId: string;
}
const CommentFeed = ({ postId }: CommentFeedProps) => {
  const { data: posts, isLoading: loading } = useGetCommentsByPostId(postId);

  return (
    <>
      <Feed posts={posts || []} loading={loading} />
    </>
  );
};
export default CommentFeed;
