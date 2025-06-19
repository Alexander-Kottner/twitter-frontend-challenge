import React from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from "styled-components";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import global_en from "../../translations/en/global.json";
import global_es from "../../translations/es/global.json";
import { store, persistor } from "../../redux/store";
import { LightTheme } from "../../util/LightTheme";
import { ROUTER } from "./Router";
import Loader from "../loader/Loader";

i18next.use(initReactI18next).init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: {
      translation: global_en,
    },
    es: {
      translation: global_es,
    },
  },
  fallbackLng: "en",
});

// Wrapper component to ensure theme is always available
const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={LightTheme}>
      {children}
    </ThemeProvider>
  );
};

export const Layout = () => {
  return (
    <I18nextProvider i18n={i18next}>
      <Provider store={store}>
        <ThemeWrapper>
          <PersistGate loading={<Loader />} persistor={persistor}>
            <RouterProvider router={ROUTER} />
          </PersistGate>
        </ThemeWrapper>
      </Provider>
    </I18nextProvider>
  );
};
