import styled from "styled-components";

export const StyledFeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  flex: 1;
  overflow-y: auto; /* Make this container scrollable */
  scrollbar-width: none; /* Hide scrollbar in Firefox */

  /* Hide scrollbar in Webkit browsers */
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 600px) {
    margin-bottom: 48px;
  }
`;
