import React, {useState} from "react";
import Button from "../button/Button";
import UserDataBox from "../user-data-box/UserDataBox";
import {useTranslation} from "react-i18next";
import {ButtonVariant, ButtonSize} from "../button/StyledButton";
import {StyledFollowUserBoxContainer} from "./StyledFollowUserBox";
import {useFollowUser, useUnfollowUser, useGetCurrentUser} from "../../hooks/useUsers";
import type { Author } from "../../service";

interface FollowUserBoxProps {
  profilePicture?: string;
  name: string;
  username: string;
  id: string;
  followed?: boolean;
}

const FollowUserBox = ({
                         profilePicture,
                         name,
                         username,
                         id,
                         followed
                       }: FollowUserBoxProps) => {
  const {t} = useTranslation();
  const {data: currentUser} = useGetCurrentUser();

  // Determine if user is already being followed
  const initialFollowState = followed || currentUser?.following?.some((f: Author) => f.id === id) || false;
  const [isFollowing, setIsFollowing] = useState(initialFollowState);

  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();

  const handleClick = async () => {
    try {
      if (isFollowing) {
        await unfollowUserMutation.mutateAsync(id);
        setIsFollowing(false);
      } else {
        await followUserMutation.mutateAsync(id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error with follow/unfollow:", error);
    }
  };

  const isPending = followUserMutation.isPending || unfollowUserMutation.isPending;

  return (
      <StyledFollowUserBoxContainer>
        <UserDataBox
            name={name}
            username={username}
            profilePicture={profilePicture}
            id={id}
        />
        <Button
            text={isFollowing ? t("buttons.unfollow") : t("buttons.follow")}
            buttonVariant={
              isFollowing ? ButtonVariant.OUTLINED : ButtonVariant.FILLED
            }
            size={ButtonSize.SMALL}
            onClick={handleClick}
            disabled={isPending}
        />
      </StyledFollowUserBoxContainer>
  );
};

export default FollowUserBox;
