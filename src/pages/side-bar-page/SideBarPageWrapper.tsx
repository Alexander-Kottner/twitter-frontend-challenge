import styled from "styled-components";

export const StyledSideBarPageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  transition: ease-in-out 0.3s;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding-left: 15%;
  padding-right: 15%;
  overflow: hidden; /* Prevent page-level scrolling */
  position: fixed;
  top: 0;
  left: 0;

  @media (max-width: 600px) {
    justify-content: flex-start;
    flex-direction: column;
    padding-left: 0;
    padding-right: 0;
    position: relative;
  }
`;
