import styled from "styled-components";

export const StyledUserSuggestionContainer = styled.div`
  flex: 1;
  width: 100%;
  height: 100vh;
  padding-left: 16px;
  padding-top: 16px;
  gap: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto; /* Allow scrolling only for the right sidebar content if needed */
  scrollbar-width: none; /* Hide scrollbar in Firefox */

  /* Hide scrollbar in Webkit browsers */
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;
