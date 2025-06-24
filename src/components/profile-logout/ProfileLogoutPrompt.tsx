import LogoutPrompt from "../navbar/logout-prompt/LogoutPrompt";
import {
    StyledLogoutPrompt,
    StyledProfileLogoutPromptContainer
} from "./StyledProfileLogoutPromptContainer";
import React, {useState, useEffect, useRef} from "react";
import icon from "../../assets/icon.jpg";
import {StyledP} from "../common/text";
import {StyledContainer} from "../common/Container";
import {useGetCurrentUser} from "../../hooks/useUsers";


interface ProfileLogoutPromptProps {
    margin: string
    direction: string
}

const ProfileLogoutPrompt = ({margin, direction}: ProfileLogoutPromptProps) => {
    const [logoutOpen, setLogoutOpen] = useState(false);
    const { data: user } = useGetCurrentUser();
    const componentRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        setLogoutOpen(!logoutOpen);
    };

    const handleButtonClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    // Close logout prompt when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setLogoutOpen(false);
            }
        };

        if (logoutOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [logoutOpen]);

    return (
        <StyledContainer
            ref={componentRef}
            maxHeight={"48px"}
            flexDirection={"row"}
            className={'profile-info'}
            alignItems={'center'}
            gap={'8px'}
            onClick={handleLogout}
            cursor={'pointer'}
        >
            <StyledProfileLogoutPromptContainer direction={direction}>
                <img src={user?.profilePicture ?? icon} className="icon" alt="Icon"/>
                {logoutOpen &&
                    <StyledLogoutPrompt margin={margin} onClick={(event) => handleButtonClick(event)}>
                        <LogoutPrompt show={logoutOpen}/>
                    </StyledLogoutPrompt>
                }
            </StyledProfileLogoutPromptContainer>
            <StyledContainer padding={"4px 0"} gap={"4px"} className={'user-info'}>
                <StyledP primary>{user?.name}</StyledP>
                <StyledP primary={false}>{`@${user?.username}`}</StyledP>
            </StyledContainer>
        </StyledContainer>
    )
}

export default ProfileLogoutPrompt