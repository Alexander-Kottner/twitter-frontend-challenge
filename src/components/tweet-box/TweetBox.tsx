import React, { useEffect, useState, ChangeEvent } from "react";
import Button from "../button/Button";
import TweetInput from "../tweet-input/TweetInput";
import { useHttpRequestService } from "../../service/HttpRequestService";
import { setLength, updateFeed } from "../../redux/user";
import ImageContainer from "../tweet/tweet-image/ImageContainer";
import { BackArrowIcon } from "../icon/Icon";
import ImageInput from "../common/ImageInput";
import { useTranslation } from "react-i18next";
import { ButtonType } from "../button/StyledButton";
import { StyledTweetBoxContainer } from "./TweetBoxContainer";
import { StyledContainer } from "../common/Container";
import { StyledButtonContainer } from "./ButtonContainer";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../service";
import { RootState } from "../../redux/store";

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

    const { length, query } = useSelector((state: RootState) => state.user);
    const httpService = useHttpRequestService();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const service = useHttpRequestService();
    const [user, setUser] = useState<User | undefined>();

    useEffect(() => {
        handleGetUser().then(r => setUser(r));
    }, []);

    const handleGetUser = async (): Promise<User> => {
        return await service.me();
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleSubmit = async (): Promise<void> => {
        try {
            // Create the post first
            const postData: { content: string; parentId?: string } = {
                content: content
            };
            
            if (parentId) {
                postData.parentId = parentId;
            }
            
            const createdPost = await httpService.createPost(postData);
            
            // If there are images, handle the image upload process
            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    const image = images[i];
                    const fileExt = image.name.split('.').pop();
                    
                    // Get the S3 upload URL
                    const uploadUrlResponse = await httpService.getImageUploadUrl(createdPost.id, fileExt!, i);
                    
                    // Upload to S3
                    await httpService.uploadImageToS3(uploadUrlResponse.uploadUrl, image);
                    
                    // Link the image to the post
                    await httpService.linkImageToPost(createdPost.id, uploadUrlResponse.key, i);
                }
            }
            
            // Clear the form
            setContent("");
            setImages([]);
            setImagesPreview([]);
            
            // Update the feed based on context
            if (parentId && !isCommentModal) {
                // If it's a comment on PostPage, fetch comments for the specific post
                const comments = await httpService.getCommentsByPostId(parentId);
                const updatedPosts = Array.from(new Set([...comments])).filter(
                    (post) => post.parentId === parentId
                );
                dispatch(updateFeed(updatedPosts));
                dispatch(setLength(updatedPosts.length));
            } else if (parentId && isCommentModal) {
                // If it's a comment from modal, refresh the entire feed
                dispatch(setLength(length + 1));
                const posts = await (query === "following" 
                    ? httpService.getFollowingPosts() 
                    : httpService.getPosts(length + 1)
                );
                dispatch(updateFeed(posts));
            } else if (!parentId) {
                // If it's a new post, fetch posts based on current tab
                dispatch(setLength(length + 1));
                const posts = await (query === "following" 
                    ? httpService.getFollowingPosts() 
                    : httpService.getPosts(length + 1)
                );
                dispatch(updateFeed(posts));
            }
            
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
                        buttonType={ButtonType.DEFAULT}
                        size={"SMALL"}
                        onClick={handleSubmit}
                        disabled={content.length === 0}
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
                            buttonType={ButtonType.DEFAULT}
                            size={"SMALL"}
                            onClick={handleSubmit}
                            disabled={
                                content.length <= 0 ||
                                content.length > 240 ||
                                images.length > 4 ||
                                images.length < 0
                            }
                        />
                    )}
                </StyledButtonContainer>
            </StyledContainer>
        </StyledTweetBoxContainer>
    );
};

export default TweetBox;