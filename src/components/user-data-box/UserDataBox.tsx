import React from "react";
import Avatar from "../common/avatar/Avatar";
import icon from "../../assets/icon.jpg";
import { useNavigate } from "react-router-dom";
import {
  StyledUserContainer,
  StyledUserInfoContainer,
  StyledUserText,
  StyledUsernameText,
} from "./StyledUserDataBox";

interface UserDataBoxProps {
  name?: string;
  username?: string;
  profilePicture?: string;
  id: string;
  onClick?: () => void;
}
export const UserDataBox = ({
  name,
  username,
  profilePicture,
  id,
  onClick,
}: UserDataBoxProps) => {
  const navigate = useNavigate();

  return (
    <StyledUserContainer onClick={onClick}>
      <Avatar
        width={"48px"}
        height={"48px"}
        src={profilePicture ?? icon}
        onClick={() => onClick ?? navigate(`/profile/${id}`)}
        alt={name ?? "Name"}
      />
      <StyledUserInfoContainer>
        <StyledUserText>{name ?? "Name"}</StyledUserText>
        <StyledUsernameText>{"@" + (username ?? "Username")}</StyledUsernameText>
      </StyledUserInfoContainer>
    </StyledUserContainer>
  );
};

export default UserDataBox;
