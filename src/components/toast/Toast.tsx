import React, { useState } from "react";
import { StyledToastContainer } from "./ToastContainer";
import { AlertIcon, CheckIcon } from "../icon/Icon";

export enum ToastType {
  ALERT = "ALERT",
  SUCCESS = "SUCCESS",
}

interface ToastProps {
  message: string;
  type: ToastType;
  show?: boolean;
}

const Toast = ({ message, type, show }: ToastProps) => {
  const [isShown, setIsShown] = useState<boolean>(show ?? true);

  const iconMap = {
    [ToastType.ALERT]: <AlertIcon />,
    [ToastType.SUCCESS]: <CheckIcon />,
  };

  const toastIcon = iconMap[type] || null;

  return (
    <>
      {isShown && (
        <StyledToastContainer type={type} onClick={() => setIsShown(false)}>
          {toastIcon}
          <p>{message}</p>
        </StyledToastContainer>
      )}
    </>
  );
};

export default Toast;
