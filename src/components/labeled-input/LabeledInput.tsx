import React, { ChangeEvent, useRef, useState } from "react";
import { StyledInputContainer } from "./InputContainer";
import { StyledInputTitle } from "./InputTitle";
import { StyledInputElement } from "./StyledInputElement";

interface InputWithLabelProps {
  type?: "password" | "text";
  title: string;
  placeholder: string;
  required: boolean;
  error?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const LabeledInput = ({
  title,
  placeholder,
  required,
  error,
  onChange,
  type = "text",
  name,
  value,
  onBlur,
}: InputWithLabelProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focus, setFocus] = useState(false);

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocus(false);
    onBlur?.(event);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <StyledInputContainer
      className={`${error ? "error" : ""}`}
      onClick={handleClick}
    >
      <StyledInputTitle
        className={`${focus ? "active-label" : ""} ${error ? "error" : ""}`}
      >
        {title}
      </StyledInputTitle>
      <StyledInputElement
        type={type}
        required={required}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
        className={error ? "error" : ""}
        ref={inputRef}
        name={name}
        value={value}
      />
    </StyledInputContainer>
  );
};

export default LabeledInput;
