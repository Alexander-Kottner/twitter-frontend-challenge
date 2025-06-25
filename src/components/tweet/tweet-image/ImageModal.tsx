import React from "react";
import { StyledBlurredBackground } from "../../common/BlurredBackground";
import ModalPortal from "../../portal/ModalPortal";

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
  show: boolean;
}
const ImageModal = ({ src, alt, onClose, show }: ImageModalProps) => {
  return (
    <ModalPortal isOpen={show} onClose={onClose}>
      <StyledBlurredBackground
        onClick={onClose}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <img
          style={{ maxWidth: "600px" }}
          width={"100%"}
          height={"auto"}
          src={src}
          alt={alt}
          onClick={onClose}
        />
      </StyledBlurredBackground>
    </ModalPortal>
  );
};

export default ImageModal;
