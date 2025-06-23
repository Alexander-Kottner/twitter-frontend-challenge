import React from "react";
import FollowUserBox from "../../../../components/follow-user/FollowUserBox";
import { useTranslation } from "react-i18next";
import { StyledSuggestionBoxContainer } from "./SuggestionBoxContainer";
import { useGetRecommendedUsers } from "../../../../hooks/useUsers";
import type { User } from "../../../../service";

const SuggestionBox = () => {
  const { t } = useTranslation();
  const { data: users = [], isLoading } = useGetRecommendedUsers(6, 0);

  if (isLoading) {
    return (
      <StyledSuggestionBoxContainer>
        <h6>{t("suggestion.who-to-follow")}</h6>
        <p>Loading suggestions...</p>
      </StyledSuggestionBoxContainer>
    );
  }

  return (
    <StyledSuggestionBoxContainer>
      <h6>{t("suggestion.who-to-follow")}</h6>
      {users.length > 0 ? (
        users
          .filter((value: User, index: number, array: User[]) => {
            return array.indexOf(value) === index;
          })
          .map((user: User) => (
            <FollowUserBox
              key={user.id}
              name={user.name!}
              username={user.username}
              profilePicture={user.profilePicture!}
              id={user.id}
            />
          ))
      ) : (
        <p>No suggestions available</p>
      )}
    </StyledSuggestionBoxContainer>
  );
};

export default SuggestionBox;
