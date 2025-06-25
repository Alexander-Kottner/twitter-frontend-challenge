import React, { useCallback, useRef, useEffect } from "react";
import { Post } from "../../service";
import { StyledContainer } from "../common/Container";
import Tweet from "../tweet/Tweet";
import Loader from "../loader/Loader";

interface InfiniteFeedProps {
  data: {
    pages: Post[][];
    pageParams: any[];
  } | undefined;
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  error: any;
}

const InfiniteFeed = ({ 
  data, 
  isLoading, 
  hasNextPage, 
  fetchNextPage, 
  isFetchingNextPage,
  error
}: InfiniteFeedProps) => {
  const observer = useRef<IntersectionObserver>();
  
  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading || isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  // Handle error state
  if (error) {
    return (
      <StyledContainer width={"100%"} alignItems={"center"} padding={"20px"}>
        <p style={{ color: '#e74c3c' }}>Error loading posts. Please try again.</p>
      </StyledContainer>
    );
  }

  // Handle initial loading state
  if (isLoading) {
    return (
      <StyledContainer width={"100%"} alignItems={"center"}>
        <Loader />
      </StyledContainer>
    );
  }

  // Flatten all pages into a single array of posts
  const allPosts = data?.pages.flat() || [];
  
  // Remove duplicates based on post id
  const uniquePosts = allPosts.filter((post, index, self) => {
    return self.findIndex((p) => p.id === post.id) === index;
  });

  // Handle empty state
  if (uniquePosts.length === 0) {
    return (
      <StyledContainer width={"100%"} alignItems={"center"} padding={"40px"}>
        <p style={{ color: '#657786', fontSize: '16px' }}>
          No posts to show
        </p>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer width={"100%"} alignItems={"center"}>
      {uniquePosts.map((post: Post, index: number) => {
        // Safety check to ensure post exists and has required properties
        if (!post || !post.id) {
          return null;
        }
        
        // Add ref to the last post for intersection observer
        if (uniquePosts.length === index + 1) {
          return (
            <div ref={lastPostElementRef} key={post.id} style={{ width: '100%' }}>
              <Tweet post={post} />
            </div>
          );
        } else {
          return <Tweet key={post.id} post={post} />;
        }
      })}
      
      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <StyledContainer padding="20px" width="100%">
          <Loader />
        </StyledContainer>
      )}
      
      {/* End of feed indicator */}
      {!hasNextPage && uniquePosts.length > 0 && (
        <StyledContainer padding="20px" width="100%">
          <p style={{ 
            color: '#657786', 
            fontSize: '14px', 
            textAlign: 'center',
            margin: 0 
          }}>
            You've seen all posts
          </p>
        </StyledContainer>
      )}
    </StyledContainer>
  );
};

export default InfiniteFeed;