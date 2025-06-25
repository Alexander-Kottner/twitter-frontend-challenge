import React from "react";
import InfiniteFeed from "./InfiniteFeed";
import { useGetInfinitePosts, useGetInfiniteFollowingPosts } from "../../hooks/usePosts";

interface ContentFeedProps {
  activeTab?: 'all' | 'following';
}

const ContentFeed = ({ activeTab = 'all' }: ContentFeedProps) => {
  // Use infinite queries for the feed
  const {
    data: infiniteAllPosts,
    isLoading: infiniteAllPostsLoading,
    hasNextPage: hasNextAllPage,
    fetchNextPage: fetchNextAllPage,
    isFetchingNextPage: isFetchingNextAllPage,
    error: allPostsError,
  } = useGetInfinitePosts();

  const {
    data: infiniteFollowingPosts,
    isLoading: infiniteFollowingPostsLoading,
    hasNextPage: hasNextFollowingPage,
    fetchNextPage: fetchNextFollowingPage,
    isFetchingNextPage: isFetchingNextFollowingPage,
    error: followingPostsError,
  } = useGetInfiniteFollowingPosts();

  if (activeTab === 'following') {
    return (
      <InfiniteFeed
        data={infiniteFollowingPosts}
        isLoading={infiniteFollowingPostsLoading}
        hasNextPage={hasNextFollowingPage || false}
        fetchNextPage={fetchNextFollowingPage}
        isFetchingNextPage={isFetchingNextFollowingPage}
        error={followingPostsError}
      />
    );
  }

  return (
    <InfiniteFeed
      data={infiniteAllPosts}
      isLoading={infiniteAllPostsLoading}
      hasNextPage={hasNextAllPage || false}
      fetchNextPage={fetchNextAllPage}
      isFetchingNextPage={isFetchingNextAllPage}
      error={allPostsError}
    />
  );
};

export default ContentFeed;
