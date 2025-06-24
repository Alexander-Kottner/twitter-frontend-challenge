import styled, { css } from "styled-components";
import "@fontsource/manrope";

interface InputProps {
    inputSize: InputSize;
    variant: InputVariant;
    disabled?: boolean;
    hasError?: boolean;
}

export enum InputVariant {
    OUTLINED = "OUTLINED",
    FILLED = "FILLED",
    GHOST = "GHOST",
    WHITE = "WHITE",
}

export enum InputSize {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE",
}

const getSizeStyles = (inputSize: InputSize) => {
    switch (inputSize) {
        case InputSize.SMALL:
            return css`
                height: 32px;
                padding: 6px 12px;
                font-size: 13px;
            `;
        case InputSize.MEDIUM:
            return css`
                height: 40px;
                padding: 8px 16px;
                font-size: 15px;
            `;
        case InputSize.LARGE:
            return css`
                height: 48px;
                padding: 12px 20px;
                font-size: 16px;
            `;
        default:
            return css`
                height: 40px;
                padding: 8px 16px;
                font-size: 15px;
            `;
    }
};

const getVariantStyles = (variant: InputVariant, disabled?: boolean, hasError?: boolean) => {
    if (disabled) {
        return css`
            background: ${(props) => props.theme.colors.inactiveBackground};
            color: ${(props) => props.theme.colors.text};
            border: 1px solid ${(props) => props.theme.colors.outline};
            cursor: not-allowed;
            opacity: 0.6;
        `;
    }

    if (hasError) {
        return css`
            border: 1px solid ${(props) => props.theme.colors.error};
            
            &:focus {
                outline: none;
                border: 1px solid ${(props) => props.theme.colors.error};
                box-shadow: 0 0 0 2px ${(props) => props.theme.colors.error}33;
            }
        `;
    }

    switch (variant) {
        case InputVariant.OUTLINED:
            return css`
                background: transparent;
                color: ${(props) => props.theme.colors.black};
                border: 1px solid ${(props) => props.theme.colors.outline};
                
                &:focus {
                    outline: none;
                    border: 1px solid ${(props) => props.theme.colors.main};
                    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.main}33;
                }
                
                &:hover:not(:focus) {
                    border: 1px solid ${(props) => props.theme.colors.main};
                }
            `;
        case InputVariant.FILLED:
            return css`
                background: ${(props) => props.theme.colors.inactiveBackground};
                color: ${(props) => props.theme.colors.black};
                border: 1px solid transparent;
                
                &:focus {
                    outline: none;
                    background: ${(props) => props.theme.colors.white};
                    border: 1px solid ${(props) => props.theme.colors.main};
                    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.main}33;
                }
                
                &:hover:not(:focus) {
                    background: ${(props) => props.theme.colors.hover};
                }
            `;
        case InputVariant.GHOST:
            return css`
                background: transparent;
                color: ${(props) => props.theme.colors.black};
                border: 1px solid transparent;
                
                &:focus {
                    outline: none;
                    border: 1px solid ${(props) => props.theme.colors.main};
                    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.main}33;
                }
                
                &:hover:not(:focus) {
                    background: ${(props) => props.theme.colors.hover};
                }
            `;
        case InputVariant.WHITE:
            return css`
                background: ${(props) => props.theme.colors.white};
                color: ${(props) => props.theme.colors.black};
                border: 1px solid ${(props) => props.theme.colors.outline};
                
                &:focus {
                    outline: none;
                    border: 1px solid ${(props) => props.theme.colors.main};
                    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.main}33;
                }
                
                &:hover:not(:focus) {
                    background: ${(props) => props.theme.colors.inactiveBackground};
                }
            `;
        default:
            return css`
                background: transparent;
                color: ${(props) => props.theme.colors.black};
                border: 1px solid ${(props) => props.theme.colors.outline};
            `;
    }
};

export const StyledInput = styled.input<InputProps>`
    width: 100%;
    border-radius: 8px;
    
    font-family: ${(props) => props.theme.font.default};
    font-style: normal;
    font-weight: 400;
    line-height: 110%;
    
    transition: all 0.3s ease;
    box-sizing: border-box;
    
    ${(props) => getSizeStyles(props.inputSize)}
    ${(props) => getVariantStyles(props.variant, props.disabled, props.hasError)}
    
    &::placeholder {
        color: ${(props) => props.theme.colors.text};
        opacity: 0.7;
    }
    
    &:disabled {
        cursor: not-allowed;
    }
`;

export const StyledInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const StyledLabel = styled.label<{ hasError?: boolean }>`
    font-family: ${(props) => props.theme.font.default};
    font-size: 14px;
    font-weight: 500;
    color: ${(props) => props.hasError ? props.theme.colors.error : props.theme.colors.black};
    margin-bottom: 4px;
`;

export const StyledErrorMessage = styled.span`
    font-family: ${(props) => props.theme.font.default};
    font-size: 12px;
    color: ${(props) => props.theme.colors.error};
    margin-top: 4px;
`;

export const StyledHelperText = styled.span`
    font-family: ${(props) => props.theme.font.default};
    font-size: 12px;
    color: ${(props) => props.theme.colors.text};
    margin-top: 4px;
`;