import React, {useEffect, useState} from "react";
import {StyledTweetContainer} from "./TweetContainer";
import AuthorData from "./user-post-data/AuthorData";
import type {Post, PostImage} from "../../service";
import {StyledReactionsContainer} from "./ReactionsContainer";
import Reaction from "./reaction/Reaction";
import {useHttpRequestService} from "../../service/HttpRequestService";
import {IconType} from "../icon/Icon";
import {StyledContainer} from "../common/Container";
import ThreeDots from "../common/ThreeDots";
import DeletePostModal from "./delete-post-modal/DeletePostModal";
import ImageContainer from "./tweet-image/ImageContainer";
import CommentModal from "../comment/comment-modal/CommentModal";
import {useNavigate} from "react-router-dom";
import {useCurrentUser} from "../../hooks/useCurrentUser";

interface TweetProps {
  post: Post;
}

const Tweet = ({post}: TweetProps) => {
  const [actualPost, setActualPost] = useState<Post>(post);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const [postImages, setPostImages] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState<boolean>(false);
  const service = useHttpRequestService();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    // Reset images first when post changes
    setPostImages([]);
    setImagesLoading(false);
    
    // Fetch post images if the post has images
    if (post.images && post.images.length > 0) {
      fetchPostImages();
    }
  }, [post.id]);

  const fetchPostImages = async () => {
    try {
      setImagesLoading(true);
      const images: PostImage[] = await service.getPostImages(post.id);
      // Sort images by index and extract URLs
      const sortedImageUrls = images
        .sort((a, b) => a.index - b.index)
        .map(img => img.url);
      setPostImages(sortedImageUrls);
    } catch (error) {
      console.error("Error fetching post images:", error);
      // Fallback to post.images if available
      setPostImages(post.images || []);
    } finally {
      setImagesLoading(false);
    }
  };

  const getCountByType = (type: string): number => {
    return actualPost?.reactions?.filter((r) => r.type === type).length ?? 0;
  };

  const handleReaction = async (type: string) => {
    const reacted = actualPost.reactions?.find(
        (r) => r.type === type && r.userId === currentUser?.id
    );
    if (reacted) {
      await service.deleteReaction(reacted.id);
    } else {
      await service.createReaction(actualPost.id, type);
    }
    const newPost = await service.getPostById(post.id);
    setActualPost(newPost);
  };

  const hasReactedByType = (type: string): boolean => {
    return (
      actualPost?.reactions?.some(
        (r) => r.type === type && r.userId === currentUser?.id
      ) ?? false
    );
  };

  return (
      <StyledTweetContainer>
        <StyledContainer
            style={{width: "100%"}}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            maxHeight={"48px"}
        >
          <AuthorData
              id={post.author.id}
              name={post.author.name ?? "Name"}
              username={post.author.username}
              createdAt={post.createdAt}
              profilePicture={post.author.profilePicture}
          />
          {post.authorId === currentUser?.id && (
              <>
                <DeletePostModal
                    show={showDeleteModal}
                    id={post.id}
                    onClose={() => {
                      setShowDeleteModal(false);
                    }}
                />
                <ThreeDots
                    onClick={() => {
                      setShowDeleteModal(!showDeleteModal);
                    }}
                />
              </>
          )}
        </StyledContainer>
        <StyledContainer onClick={() => navigate(`/post/${post.id}`)}>
          <p>{post.content}</p>
        </StyledContainer>
        {/* Use fetched S3 images or show loading state */}
        {(postImages.length > 0 || (post.images && post.images.length > 0)) && (
            <StyledContainer padding={"0 0 0 10%"}>
              {!imagesLoading ? (
                <ImageContainer images={postImages.length > 0 ? postImages : post.images || []}/>
              ) : (
                <StyledContainer padding={"16px"} alignItems={"center"}>
                  <p>Loading images...</p>
                </StyledContainer>
              )}
            </StyledContainer>
        )}
        <StyledReactionsContainer>
          <Reaction
              img={IconType.CHAT}
              count={actualPost?.comments?.length}
              reactionFunction={() =>
                  window.innerWidth > 600
                      ? setShowCommentModal(true)
                      : navigate(`/compose/comment/${post.id}`)
              }
              increment={0}
              reacted={false}
          />
          <Reaction
              img={IconType.RETWEET}
              count={getCountByType("RETWEET")}
              reactionFunction={() => handleReaction("RETWEET")}
              increment={1}
              reacted={hasReactedByType("RETWEET")}
          />
          <Reaction
              img={IconType.LIKE}
              count={getCountByType("LIKE")}
              reactionFunction={() => handleReaction("LIKE")}
              increment={1}
              reacted={hasReactedByType("LIKE")}
          />
        </StyledReactionsContainer>
        <CommentModal
            show={showCommentModal}
            post={post}
            onClose={() => setShowCommentModal(false)}
        />
      </StyledTweetContainer>
  );
};

export default Tweet;
