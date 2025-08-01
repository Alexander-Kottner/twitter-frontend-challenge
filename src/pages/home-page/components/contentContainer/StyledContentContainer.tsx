import styled from "styled-components";

export const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  flex: 2;
  height: 100vh;
  border-right: 1px solid ${(props) => props.theme.colors.containerLine};
  overflow: hidden; /* Prevent this container from scrolling */

  .tweet-box-container {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 600px) {
    .tweet-box-container {
      display: none;
    }
  }
`;
