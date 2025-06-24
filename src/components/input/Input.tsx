import React, { ChangeEventHandler, FocusEventHandler, forwardRef } from "react";
import {
  InputVariant,
  InputSize,
  StyledInput,
  StyledInputContainer,
  StyledLabel,
  StyledErrorMessage,
  StyledHelperText,
} from "./StyledInput";

interface InputProps {
  size: InputSize;
  variant: InputVariant;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  name?: string;
  id?: string;
  label?: string;
  errorMessage?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  readOnly?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    size,
    variant,
    placeholder,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    disabled = false,
    type = "text",
    name,
    id,
    label,
    errorMessage,
    helperText,
    required = false,
    className,
    autoComplete,
    autoFocus = false,
    maxLength,
    minLength,
    pattern,
    readOnly = false,
  }, ref) => {
    const hasError = Boolean(errorMessage);
    const inputId = id || name;

    return (
      <StyledInputContainer className={className}>
        {label && (
          <StyledLabel htmlFor={inputId} hasError={hasError}>
            {label}
            {required && " *"}
          </StyledLabel>
        )}
        
        <StyledInput
          ref={ref}
          inputSize={size}
          variant={variant}
          hasError={hasError}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          type={type}
          name={name}
          id={inputId}
          required={required}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          readOnly={readOnly}
          aria-invalid={hasError}
          aria-describedby={
            errorMessage ? `${inputId}-error` : 
            helperText ? `${inputId}-helper` : undefined
          }
        />
        
        {errorMessage && (
          <StyledErrorMessage id={`${inputId}-error`} role="alert">
            {errorMessage}
          </StyledErrorMessage>
        )}
        
        {helperText && !errorMessage && (
          <StyledHelperText id={`${inputId}-helper`}>
            {helperText}
          </StyledHelperText>
        )}
      </StyledInputContainer>
    );
  }
);

Input.displayName = "Input";

export default Input;