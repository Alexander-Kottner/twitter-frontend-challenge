import React, {useState} from "react";
import {StyledTweetContainer} from "./TweetContainer";
import AuthorData from "./user-post-data/AuthorData";
import type {Post, PostImage} from "../../service";
import {StyledReactionsContainer} from "./ReactionsContainer";
import Reaction from "./reaction/Reaction";
import {IconType} from "../icon/Icon";
import {StyledContainer} from "../common/Container";
import ThreeDots from "../common/ThreeDots";
import DeletePostModal from "./delete-post-modal/DeletePostModal";
import ImageContainer from "./tweet-image/ImageContainer";
import CommentModal from "../comment/comment-modal/CommentModal";
import {useNavigate} from "react-router-dom";
import {useCurrentUser} from "../../hooks/useCurrentUser";
import { useGetPostImages, useCreateReaction, useDeleteReaction } from "../../hooks/usePosts";

interface TweetProps {
  post: Post;
}

const Tweet = ({post}: TweetProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  
  // Use React Query for post images
  const { data: postImages, isLoading: imagesLoading } = useGetPostImages(post.id);
  const createReactionMutation = useCreateReaction();
  const deleteReactionMutation = useDeleteReaction();

  const handleReaction = async (type: string) => {
    try {
      if (type === "LIKE") {
        if (post.hasLiked) {
          await deleteReactionMutation.mutateAsync({ postId: post.id, reactionType: type });
        } else {
          await createReactionMutation.mutateAsync({ postId: post.id, reaction: type });
        }
      } else if (type === "RETWEET") {
        if (post.hasRetweeted) {
          await deleteReactionMutation.mutateAsync({ postId: post.id, reactionType: type });
        } else {
          await createReactionMutation.mutateAsync({ postId: post.id, reaction: type });
        }
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  // Sort images by index and extract URLs with proper typing
  const sortedImageUrls = postImages
    ?.sort((a: PostImage, b: PostImage) => a.index - b.index)
    .map((img: PostImage) => img.url) || [];

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
        
        {/* Use React Query fetched images or fallback to post.images */}
        {(sortedImageUrls.length > 0 || (post.images && post.images.length > 0)) && (
            <StyledContainer padding={"0 0 0 10%"}>
              {!imagesLoading ? (
                <ImageContainer images={sortedImageUrls.length > 0 ? sortedImageUrls : post.images || []}/>
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
              count={post.qtyComments || 0}
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
              count={post.qtyRetweets || 0}
              reactionFunction={() => handleReaction("RETWEET")}
              increment={1}
              reacted={post.hasRetweeted || false}
          />
          <Reaction
              img={IconType.LIKE}
              count={post.qtyLikes || 0}
              reactionFunction={() => handleReaction("LIKE")}
              increment={1}
              reacted={post.hasLiked || false}
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
