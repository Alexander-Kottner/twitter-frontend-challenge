import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import AuthWrapper from "../AuthWrapper";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import { ButtonVariant, ButtonSize } from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";
import { useAppDispatch } from "../../../redux/hooks";
import { setCurrentUser } from "../../../redux/user";
import Toast, { ToastType } from "../../../components/toast/Toast";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const httpRequestService = useHttpRequestService();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);

    try {
      // First, sign in and store the token
      await httpRequestService.signIn({ email, password });

      // Then fetch the user data to populate Redux state
      const userData = await httpRequestService.me();
      dispatch(setCurrentUser(userData));

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      // Navigate after a brief delay to show the toast
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Sign in error:", err);
      setError(true);
      // Clear any stored token if sign in failed
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      {showSuccessToast && (
        <Toast 
          type={ToastType.SUCCESS} 
          message={"Log in exitoso!"}
        />
      )}
      <div className={"border"}>
        <div className={"container"}>
          <div className={"header"}>
            <img src={logo} alt={"Twitter Logo"} />
            <StyledH3>{t("title.login")}</StyledH3>
          </div>
          <div className={"input-container"}>
            <LabeledInput
              required
              placeholder={"Enter user..."}
              title={t("input-params.username")}
              error={error}
              onChange={(e) => setEmail(e.target.value)}
            />
            <LabeledInput
              type="password"
              required
              placeholder={"Enter password..."}
              title={t("input-params.password")}
              error={error}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className={"error-message"}>{error && t("error.login")}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Button
              text={loading ? "Signing in..." : t("buttons.login")}
              buttonVariant={ButtonVariant.FILLED}
              size={ButtonSize.MEDIUM}
              onClick={handleSubmit}
              disabled={loading}
            />
            <Button
              text={t("buttons.register")}
              buttonVariant={ButtonVariant.OUTLINED}
              size={ButtonSize.MEDIUM}
              onClick={() => navigate("/sign-up")}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default SignInPage;
