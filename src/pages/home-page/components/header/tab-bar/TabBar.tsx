import React, { useState } from "react";
import Tab from "./tab/Tab";
import { useTranslation } from "react-i18next";
import { StyledTabBarContainer } from "./TabBarContainer";

interface TabBarProps {
  onTabChange?: (tab: 'all' | 'following') => void;
}

const TabBar = ({ onTabChange }: TabBarProps) => {
  const [activeFirstPage, setActiveFirstPage] = useState(true);
  const { t } = useTranslation();

  const handleClick = (value: boolean, query: 'all' | 'following') => {
    setActiveFirstPage(value);
    onTabChange?.(query);
  };

  return (
    <>
      <StyledTabBarContainer>
        <Tab
          text={t("For You")}
          active={activeFirstPage}
          onClick={() => handleClick(true, "all")}
        />
        <Tab
          text={t("Following")}
          active={!activeFirstPage}
          onClick={() => handleClick(false, "following")}
        />
      </StyledTabBarContainer>
    </>
  );
};

export default TabBar;
