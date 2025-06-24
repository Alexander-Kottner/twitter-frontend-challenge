import React, { useState } from "react";
import { BackArrowIcon } from "../../components/icon/Icon";
import Button from "../../components/button/Button";
import { Post } from "../../service";
import AuthorData from "../../components/tweet/user-post-data/AuthorData";
import ImageContainer from "../../components/tweet/tweet-image/ImageContainer";
import { useLocation } from "react-router-dom";
import TweetInput from "../../components/tweet-input/TweetInput";
import ImageInput from "../../components/common/ImageInput";
import { useTranslation } from "react-i18next";
import { ButtonVariant, ButtonSize } from "../../components/button/StyledButton";
import { StyledContainer } from "../../components/common/Container";
import { StyledLine } from "../../components/common/Line";
import { StyledP } from "../../components/common/text";
import { useGetPostById, useCreatePost } from "../../hooks/usePosts";
import { useGetCurrentUser } from "../../hooks/useUsers";

const CommentPage = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const postId = useLocation().pathname.split("/")[3];
  const { t } = useTranslation();

  const { data: post } = useGetPostById(postId);
  const { data: user } = useGetCurrentUser();
  const createPostMutation = useCreatePost();

  const exit = () => {
    window.history.back();
  };

  const handleSubmit = async () => {
    try {
      await createPostMutation.mutateAsync({
        content,
        parentId: postId,
        images,
      });

      setContent("");
      setImages([]);
      exit();
    } catch (e) {
      console.log(e);
    }
  };

  const handleRemoveImage = (index: number): void => {
    const newImages = images.filter((i, idx) => idx !== index);
    setImages(newImages);
  };

  return (
    <StyledContainer padding={"16px"} borderBottom={"1px solid #ebeef0"}>
      <StyledContainer
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"0 0 16px 0"}
      >
        <BackArrowIcon onClick={exit} />
        <Button
          text={t("buttons.reply")}
          buttonVariant={ButtonVariant.FILLED}
          size={ButtonSize.SMALL}
          onClick={handleSubmit}
          disabled={content.length === 0 || createPostMutation.isPending}
        />
      </StyledContainer>
      {post && (
        <StyledContainer gap={"16px"}>
          <AuthorData
            id={post.authorId}
            name={post.author.name ?? "Name"}
            username={post.author.username}
            createdAt={post.createdAt}
            profilePicture={post.author.profilePicture}
          />
          <StyledContainer flexDirection={"row"}>
            <StyledLine />
            <StyledContainer gap={"8px"}>
              <StyledP primary>{post.content}</StyledP>
              {post.images && <ImageContainer images={post.images} />}
            </StyledContainer>
          </StyledContainer>
          <StyledContainer gap={"4px"}>
            <TweetInput
              maxLength={240}
              placeholder={t("placeholder.comment")}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              src={user?.profilePicture}
            />
            {images.length > 0 && (
              <ImageContainer
                editable
                images={images.map((i) => URL.createObjectURL(i))}
                removeFunction={handleRemoveImage}
              />
            )}
            <StyledContainer padding={"0 0 0 10%"}>
              <ImageInput
                setImages={setImages}
                parentId={`comment-page-${postId}`}
              />
            </StyledContainer>
          </StyledContainer>
        </StyledContainer>
      )}
    </StyledContainer>
  );
};

export default CommentPage;
