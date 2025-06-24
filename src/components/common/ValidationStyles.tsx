import styled from "styled-components";

export const StyledErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.error};
  font-size: 12px;
  margin: 4px 0 8px 8px;
  font-family: ${(props) => props.theme.font.default};
  font-weight: 400;
`;

export const StyledCharacterCounter = styled.div<{ isWarning?: boolean; isError?: boolean }>`
  font-size: 12px;
  margin-left: 10%;
  margin-top: 4px;
  color: ${(props) => {
    if (props.isError) return props.theme.colors.error;
    if (props.isWarning) return '#ff8c00';
    return '#666';
  }};
  font-family: ${(props) => props.theme.font.default};
`;

export const StyledValidationInfo = styled.div`
  font-size: 12px;
  color: #666;
  margin: 4px 0 8px 8px;
  font-family: ${(props) => props.theme.font.default};
`;