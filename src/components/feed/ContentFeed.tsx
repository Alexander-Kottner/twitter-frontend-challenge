import React, { useState } from "react";
import Feed from "./Feed";
import { useGetPosts, useGetFollowingPosts } from "../../hooks/usePosts";

interface ContentFeedProps {
  activeTab?: 'all' | 'following';
}

const ContentFeed = ({ activeTab = 'all' }: ContentFeedProps) => {
  const { data: allPosts, isLoading: allPostsLoading } = useGetPosts();
  const { data: followingPosts, isLoading: followingPostsLoading } = useGetFollowingPosts();

  const posts = activeTab === 'following' ? followingPosts : allPosts;
  const loading = activeTab === 'following' ? followingPostsLoading : allPostsLoading;

  return <Feed posts={posts || []} loading={loading} />;
};

export default ContentFeed;
