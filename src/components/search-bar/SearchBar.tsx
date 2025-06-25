import React, { ChangeEvent, useState, useRef } from "react";
import SearchResultModal from "./search-result-modal/SearchResultModal";
import { useTranslation } from "react-i18next";
import { StyledSearchBarContainer } from "./SearchBarContainer";
import { StyledSearchBarInput } from "./SearchBarInput";
import { useSearchUsers } from "../../hooks/useUsers";

export const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Use React Query hook for search with debouncing
  const { data: results = [], isLoading } = useSearchUsers(query, 4, 0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClose = () => {
    setQuery("");
  };

  return (
    <StyledSearchBarContainer>
      <StyledSearchBarInput
        ref={searchInputRef}
        onChange={handleChange}
        value={query}
        placeholder={t("placeholder.search")}
      />
      <SearchResultModal 
        show={query.length > 0} 
        results={results} 
        onClose={handleClose}
        triggerRef={searchInputRef}
      />
    </StyledSearchBarContainer>
  );
};
