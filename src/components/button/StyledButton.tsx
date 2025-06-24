import styled, { css } from "styled-components";
import "@fontsource/manrope";

interface ButtonProps {
    size: ButtonSize;
    variant: ButtonVariant;
    disabled?: boolean;
}

export enum ButtonVariant {
    OUTLINED = "OUTLINED",
    FILLED = "FILLED",
    GHOST = "GHOST",
    WHITE = "WHITE",
}

export enum ButtonSize {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE",
}

const getSizeStyles = (size: ButtonSize) => {
    switch (size) {
        case ButtonSize.SMALL:
            return css`
                width: 100px;
                height: 32px;
                padding: 6px 12px;
                font-size: 13px;
            `;
        case ButtonSize.MEDIUM:
            return css`
                width: 150px;
                height: 40px;
                padding: 8px 16px;
                font-size: 15px;
            `;
        case ButtonSize.LARGE:
            return css`
                width: 200px;
                height: 48px;
                padding: 12px 20px;
                font-size: 16px;
            `;
        default:
            return css`
                width: 150px;
                height: 40px;
                padding: 8px 16px;
                font-size: 15px;
            `;
    }
};

const getVariantStyles = (variant: ButtonVariant, disabled?: boolean) => {
    if (disabled) {
        return css`
            background: ${(props) => props.theme.colors.light};
            color: ${(props) => props.theme.colors.white};
            border: none;
            cursor: not-allowed;
            opacity: 0.6;
        `;
    }

    switch (variant) {
        case ButtonVariant.OUTLINED:
            return css`
                background: transparent;
                color: ${(props) => props.theme.colors.main};
                border: 1px solid ${(props) => props.theme.colors.outline};
                
                &:hover {
                    background: ${(props) => props.theme.hover.outlined};
                }
            `;
        case ButtonVariant.FILLED:
            return css`
                background: ${(props) => props.theme.colors.main};
                color: ${(props) => props.theme.colors.white};
                border: none;
                
                &:hover {
                    background: ${(props) => props.theme.hover.default};
                }
            `;
        case ButtonVariant.GHOST:
            return css`
                background: transparent;
                color: ${(props) => props.theme.colors.text};
                border: none;
                
                &:hover {
                    background: ${(props) => props.theme.colors.hover};
                }
            `;
        case ButtonVariant.WHITE:
            return css`
                background: ${(props) => props.theme.colors.white};
                color: ${(props) => props.theme.colors.black};
                border: 1px solid ${(props) => props.theme.colors.outline};
                
                &:hover {
                    background: ${(props) => props.theme.colors.inactiveBackground};
                }
            `;
        default:
            return css`
                background: ${(props) => props.theme.colors.main};
                color: ${(props) => props.theme.colors.white};
                border: none;
            `;
    }
};

export const StyledButton = styled.button<ButtonProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 40px;
    
    font-family: ${(props) => props.theme.font.default};
    font-style: normal;
    font-weight: 800;
    line-height: 110%;
    text-align: center;
    
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.3s ease;
    
    ${(props) => getSizeStyles(props.size)}
    ${(props) => getVariantStyles(props.variant, props.disabled)}
    
    &:active {
        transform: ${(props) => props.disabled ? 'none' : 'scale(0.95)'};
    }
    
    &:focus {
        outline: 2px solid ${(props) => props.theme.colors.main};
        outline-offset: 2px;
    }
`;
