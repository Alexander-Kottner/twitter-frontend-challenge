import React, { ReactNode } from "react";
import { StyledBlurredBackground } from "../common/BlurredBackground";
import { ModalCloseButton } from "../common/ModalCloseButton";
import { StyledTweetModalContainer } from "../tweet-modal/TweetModalContainer";
import ModalPortal from "../portal/ModalPortal";

interface PostModalProps {
  onClose: () => void;
  show: boolean;
  children: ReactNode;
}

export const PostModal = ({ onClose, show, children }: PostModalProps) => {
  return (
    <ModalPortal isOpen={show} onClose={onClose}>
      <StyledBlurredBackground onClick={onClose}>
        <StyledTweetModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalCloseButton onClick={onClose} />
          {children}
        </StyledTweetModalContainer>
      </StyledBlurredBackground>
    </ModalPortal>
  );
};
