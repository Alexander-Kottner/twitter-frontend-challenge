import React, {useState} from "react";
import ProfileInfo from "./ProfileInfo";
import {useParams} from "react-router-dom";
import Modal from "../../components/modal/Modal";
import {useTranslation} from "react-i18next";
import {ButtonType} from "../../components/button/StyledButton";
import Button from "../../components/button/Button";
import ProfileFeed from "../../components/feed/ProfileFeed";
import {StyledContainer} from "../../components/common/Container";
import {StyledH5} from "../../components/common/text";
import {useGetProfileView, useFollowUser, useUnfollowUser, useDeleteProfile} from "../../hooks/useUsers";
import {useCurrentUser} from "../../hooks/useCurrentUser";
import type { Author } from "../../service";

const ProfilePage = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalValues, setModalValues] = useState({
    text: "",
    title: "",
    type: ButtonType.DEFAULT,
    buttonText: "",
  });

  const {t} = useTranslation();
  const {id} = useParams<{ id: string }>();
  const {currentUser} = useCurrentUser();

  // Use profileView which calls the existing /api/user/:id endpoint
  const {data: profileView, error: profileError} = useGetProfileView(id!);

  // Use profileView as the display profile
  const displayProfile = profileView;
  const isFollowing = profileView?.isFollowed ?? false;

  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();
  const deleteProfileMutation = useDeleteProfile();

  const handleButtonType = () => {
    if (currentUser?.id === id) {
      return {
        component: ButtonType.DELETE,
        text: t("buttons.delete"),
      };
    } else if (isFollowing) {
      return {
        component: ButtonType.OUTLINED,
        text: t("buttons.unfollow"),
      };
    } else {
      return {
        component: ButtonType.DEFAULT,
        text: t("buttons.follow"),
      };
    }
  };

  const handleButtonAction = () => {
    if (currentUser?.id === id) {
      setModalValues({
        text: t("modal-content.delete-account"),
        title: t("modal-title.delete-account"),
        type: ButtonType.DELETE,
        buttonText: t("buttons.delete"),
      });
      setShowModal(true);
    } else {
      handleFollowAction();
    }
  };

  const handleFollowAction = async () => {
    if (!id) return;

    try {
      if (isFollowing) {
        await unfollowUserMutation.mutateAsync(id);
      } else {
        await followUserMutation.mutateAsync(id);
      }
    } catch (error) {
      console.error("Error with follow action:", error);
    }
  };

  const handleSubmit = async () => {
    if (currentUser?.id === id) {
      try {
        await deleteProfileMutation.mutateAsync();
        setShowModal(false);
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  return (
      <>
        <StyledContainer
            maxHeight={"100vh"}
            borderRight={"1px solid #ebeef0"}
            maxWidth={'600px'}
        >
          {displayProfile && (
              <>
                <StyledContainer
                    borderBottom={"1px solid #ebeef0"}
                    maxHeight={"212px"}
                    padding={"16px"}
                >
                  <StyledContainer
                      alignItems={"center"}
                      padding={"24px 0 0 0"}
                      flexDirection={"row"}
                      justifyContent={"space-between"}
                  >
                    <ProfileInfo
                        name={displayProfile.name!}
                        username={displayProfile.username}
                        profilePicture={displayProfile.profilePicture}
                    />
                    <Button
                        buttonType={handleButtonType().component}
                        size={"100px"}
                        onClick={handleButtonAction}
                        text={handleButtonType().text}
                        disabled={followUserMutation.isPending || unfollowUserMutation.isPending}
                    />
                  </StyledContainer>
                </StyledContainer>
                <StyledContainer width={"100%"}>
                  {profileView ? (
                      <ProfileFeed/>
                  ) : (
                      <StyledH5>Private account</StyledH5>
                  )}
                </StyledContainer>
                <Modal
                    show={showModal}
                    text={modalValues.text}
                    title={modalValues.title}
                    acceptButton={
                      <Button
                          buttonType={modalValues.type}
                          text={modalValues.buttonText}
                          size={"MEDIUM"}
                          onClick={handleSubmit}
                          disabled={deleteProfileMutation.isPending}
                      />
                    }
                    onClose={() => {
                      setShowModal(false);
                    }}
                />
              </>
          )}
        </StyledContainer>
      </>
  );
};

export default ProfilePage;
