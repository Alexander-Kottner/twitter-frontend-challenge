import React, {useEffect, useState} from "react";
import Modal from "../../modal/Modal";
import Button from "../../button/Button";
import { StyledContainer } from "../../common/Container";
import { useTranslation } from "react-i18next";
import {ButtonVariant, ButtonSize} from "../../button/StyledButton";
import logo from "../../../assets/logo.png";
import {useNavigate} from "react-router-dom";
import SwitchButton from "../../switch/SwitchButton";
import {StyledP} from "../../common/text";
import {useGetCurrentUser} from "../../../hooks/useUsers";
import {performLogout} from "../../../service/HttpRequestService";

interface LogoutPromptProps {
  show: boolean;
}

const LogoutPrompt = ({ show }: LogoutPromptProps) => {
  const [showPrompt, setShowPrompt] = useState<boolean>(show);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { data: user } = useGetCurrentUser();


  const handleClick = () => {
    setShowModal(true);
  };


  const handleLanguageChange = () => {
    if (i18n.language === "es") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("es");
    }
  };

  const handleLogout = () => {
    performLogout();
    navigate("/sign-in");
  };

  useEffect(() => {
    setShowPrompt(show);
  }, [show]);

  return (
    <>
      {showPrompt && (
        <StyledContainer>
          <StyledContainer
            flexDirection={"row"}
            gap={"16px"}
            borderBottom={"1px solid #ebeef0"}
            padding={"16px"}
            alignItems={"center"}
          >
            <StyledP primary>Es:</StyledP>
            <SwitchButton
              checked={i18n.language === "es"}
              onChange={handleLanguageChange}
            />
          </StyledContainer>
          <StyledContainer onClick={handleClick} alignItems={"center"}>
            <StyledP primary>{`${t("buttons.logout")} @${
              user?.username
            }`}</StyledP>
          </StyledContainer>
        </StyledContainer>
      )}
      <Modal
        show={showModal}
        text={t("modal-content.logout")}
        img={logo}
        title={t("modal-title.logout")}
        acceptButton={
              <Button
                text={t("buttons.logout")}
                buttonVariant={ButtonVariant.FILLED}
                size={ButtonSize.MEDIUM}
                onClick={handleLogout}
              />
        }
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default LogoutPrompt;
