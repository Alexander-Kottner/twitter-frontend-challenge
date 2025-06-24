import React, { useEffect, useState, ChangeEvent } from "react";
import Button from "../button/Button";
import TweetInput from "../tweet-input/TweetInput";
import ImageContainer from "../tweet/tweet-image/ImageContainer";
import { BackArrowIcon } from "../icon/Icon";
import ImageInput from "../common/ImageInput";
import { useTranslation } from "react-i18next";
import { ButtonVariant, ButtonSize } from "../button/StyledButton";
import { StyledTweetBoxContainer } from "./TweetBoxContainer";
import { StyledContainer } from "../common/Container";
import { StyledButtonContainer } from "./ButtonContainer";
import { useCreatePost } from "../../hooks/usePosts";
import { useGetCurrentUser } from "../../hooks/useUsers";

interface TweetBoxProps {
    parentId?: string;
    close?: () => void;
    mobile?: boolean;
    isCommentModal?: boolean;
    borderless?: boolean;
}

const TweetBox: React.FC<TweetBoxProps> = (props) => {
    const { parentId, close, mobile, isCommentModal } = props;
    const [content, setContent] = useState<string>("");
    const [images, setImages] = useState<File[]>([]);
    const [imagesPreview, setImagesPreview] = useState<string[]>([]);

    const { t } = useTranslation();
    const { data: user } = useGetCurrentUser();
    const createPostMutation = useCreatePost();

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleSubmit = async (): Promise<void> => {
        try {
            await createPostMutation.mutateAsync({
                content: content,
                parentId: parentId,
                images: images,
            });
            
            // Clear the form
            setContent("");
            setImages([]);
            setImagesPreview([]);
            
            close && close();
        } catch (e) {
            console.log(e);
        }
    };

    const handleRemoveImage = (index: number): void => {
        const newImages = images.filter((i, idx) => idx !== index);
        const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
        setImages(newImages);
        setImagesPreview(newImagesPreview);
    };

    const handleAddImage = (newImages: File[]): void => {
        setImages(newImages);
        const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
        setImagesPreview(newImagesPreview);
    };

    return (
        <StyledTweetBoxContainer>
            {mobile && (
                <StyledContainer
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <BackArrowIcon onClick={close}/>
                    <Button
                        text={"Tweet"}
                        buttonVariant={ButtonVariant.FILLED}
                        size={ButtonSize.SMALL}
                        onClick={handleSubmit}
                        disabled={content.length === 0 || createPostMutation.isPending}
                    />
                </StyledContainer>
            )}
            <StyledContainer style={{width: "100%"}}>
                <TweetInput
                    onChange={handleChange}
                    maxLength={240}
                    placeholder={t("placeholder.tweet")}
                    value={content}
                    src={user?.profilePicture}
                />
                <StyledContainer padding={"0 0 0 10%"}>
                    <ImageContainer
                        editable
                        images={imagesPreview}
                        removeFunction={handleRemoveImage}
                    />
                </StyledContainer>
                <StyledButtonContainer>
                    <ImageInput setImages={handleAddImage} parentId={parentId}/>
                    {!mobile && (
                        <Button
                            text={"Tweet"}
                            buttonVariant={ButtonVariant.FILLED}
                            size={ButtonSize.SMALL}
                            onClick={handleSubmit}
                            disabled={
                                content.length <= 0 ||
                                content.length > 240 ||
                                images.length > 4 ||
                                images.length < 0 ||
                                createPostMutation.isPending
                            }
                        />
                    )}
                </StyledButtonContainer>
            </StyledContainer>
        </StyledTweetBoxContainer>
    );
};

export default TweetBox;