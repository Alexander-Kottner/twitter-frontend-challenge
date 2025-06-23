import React from "react";
import Feed from "./Feed";
import { useGetPostsFromProfile } from "../../hooks/usePosts";
import { useParams } from "react-router-dom";

const ProfileFeed = () => {
  const { id } = useParams<{ id: string }>();
  const { data: posts, isLoading: loading } = useGetPostsFromProfile(id!);

  return (
    <>
      <Feed posts={posts || []} loading={loading} />
    </>
  );
};
export default ProfileFeed;
