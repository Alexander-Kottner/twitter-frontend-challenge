import { ButtonVariant, ButtonSize, StyledButton } from "./StyledButton";
import React, { MouseEventHandler } from "react";

interface ButtonProps {
  text: string;
  size: ButtonSize;
  buttonVariant: ButtonVariant;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  children?: React.ReactNode;
}

const Button = ({ 
  text, 
  size, 
  buttonVariant, 
  onClick, 
  disabled = false, 
  type = "button",
  className,
  children 
}: ButtonProps) => {
  return (
    <StyledButton
      size={size}
      variant={buttonVariant}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children ? children : text}
    </StyledButton>
  );
};

export default Button;



