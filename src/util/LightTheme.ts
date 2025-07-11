export const LightTheme: Theme = {
  background: "#fff",
  colors: {
    main: "#4A99E9",
    light: "#A5CCF4",
    dark: "#428AD2",
    error: "#E03C39",
    white: "#FFFFFF",
    inactiveBackground: "#F0F3F4",
    containerLine: "#F0F3F4",
    hover: "#E7E7E8",
    outline: "#D1D9DD",
    text: "#566370",
    black: "#000000",
    errorContainer: "#E5397F",
    success: "#4CAF50",
    successContainer: "#4CAF50",
  },
  hover: {
    default: "#428AD2",
    follow: "#428AD2",
    error: "#FF0000",
    outlined: "#f3f3f3",
    disabled: "#A5CCF4",
  },
  text: {
    default: "#566370",
    title: "#000000",
    error: "#E03C39",
    success: "#4CAF50",
  },
  font: {
    default: "Manrope",
    title: "Inter",
  },
};

export type Theme = {
  background: string;
  colors: {
    main: string;
    light: string;
    dark: string;
    error: string;
    white: string;
    inactiveBackground: string;
    containerLine: string;
    hover: string;
    outline: string;
    text: string;
    black: string;
    errorContainer: string;
    success: string;
    successContainer: string;
  };
  hover: {
    default: string;
    follow: string;
    error: string;
    outlined: string;
    disabled: string;
  };
  text: {
    default: string;
    title: string;
    error: string;
    success: string;
  };
  font: {
    default: string;
    title: string;
  };
};
