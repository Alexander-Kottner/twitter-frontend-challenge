import styled from "styled-components";
import "@fontsource/manrope";

export const StyledUserContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: stretch;
  height: 100%;
  min-height: 48px;
  gap: 4px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  box-sizing: border-box;
`;

export const StyledUserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  width: 100%;
  padding-left: 8px;
  padding-top: 8px;
`;

export const StyledUserText = styled.p`
  font-family: ${(props) => props.theme.font.default};
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 110%;
  letter-spacing: -0.15px;
  margin: 0;
`;

export const StyledUsernameText = styled(StyledUserText)`
  color: ${(props) => props.theme.colors.text};
`;