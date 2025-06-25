import React from "react";
import { Author } from "../../../service";
import UserDataBox from "../../user-data-box/UserDataBox";
import { StyledContainer } from "../../common/Container";
import { StyledSearchResultModalContainer } from "./SearchResultModalContainer";
import DropdownPortal from "../../portal/DropdownPortal";

interface SearchResultModalProps {
  show: boolean;
  results: Author[];
  onClose?: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}
export const SearchResultModal = ({
  show,
  results,
  onClose,
  triggerRef,
}: SearchResultModalProps) => {
  return (
    <DropdownPortal isOpen={show} onClose={onClose} triggerRef={triggerRef}>
      <StyledContainer style={{ width: "100%" }}>
        <StyledSearchResultModalContainer>
          {(results.length === 0 && <div>No results</div>) ||
            results.map((author) => {
              return (
                <UserDataBox
                  key={"search-result-" + author.id}
                  username={author.username}
                  name={author.name!}
                  id={author.id}
                  profilePicture={author.profilePicture!}
                />
              );
            })}
        </StyledSearchResultModalContainer>
      </StyledContainer>
    </DropdownPortal>
  );
};

export default SearchResultModal;
