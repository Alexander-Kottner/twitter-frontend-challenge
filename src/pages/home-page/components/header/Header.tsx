import React from "react";
import TabBar from "./tab-bar/TabBar";
import logo from "../../../../assets/logo.png";
import {StyledHeaderContainer} from "./HeaderContainer";
import ProfileLogoutPrompt from "../../../../components/profile-logout/ProfileLogoutPrompt";

interface HeaderProps {
  onTabChange?: (tab: 'all' | 'following') => void;
}

const Header = ({ onTabChange }: HeaderProps) => {

  return (
      <>
        <StyledHeaderContainer>
          <ProfileLogoutPrompt margin={'58px 16px'} direction={'column'}/>
          <div className="title-container">
            <img src={logo} className="logo" alt="Logo"/>
          </div>
          <TabBar onTabChange={onTabChange}/>
        </StyledHeaderContainer>
      </>
  );
};

export default Header;
