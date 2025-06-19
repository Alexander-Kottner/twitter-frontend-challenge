import type { ChangeEvent } from "react";
import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthWrapper from "../../../pages/auth/AuthWrapper";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import { ButtonType } from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";
import { useAppDispatch } from "../../../redux/hooks";
import { setCurrentUser } from "../../../redux/user";

interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const [data, setData] = useState<Partial<SignUpData>>({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const httpRequestService = useHttpRequestService();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleChange =
    (prop: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [prop]: event.target.value });
    };

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);

    try {
      const { confirmPassword, ...requestData } = data;

      // First, sign up and store the token
      await httpRequestService.signUp(requestData);

      // Then fetch the user data to populate Redux state
      const userData = await httpRequestService.me();
      dispatch(setCurrentUser(userData));

      // Only navigate after successful authentication and user data fetch
      navigate("/");
    } catch (err) {
      console.error("Sign up error:", err);
      setError(true);
      // Clear any stored token if sign up failed
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <div className={"border"}>
        <div className={"container"}>
          <div className={"header"}>
            <img src={logo} alt="Twitter Logo" />
            <StyledH3>{t("title.register")}</StyledH3>
          </div>
          <div className={"input-container"}>
            <LabeledInput
              required
              placeholder={"Enter name..."}
              title={t("input-params.name")}
              error={error}
              onChange={handleChange("name")}
            />
            <LabeledInput
              required
              placeholder={"Enter username..."}
              title={t("input-params.username")}
              error={error}
              onChange={handleChange("username")}
            />
            <LabeledInput
              required
              placeholder={"Enter email..."}
              title={t("input-params.email")}
              error={error}
              onChange={handleChange("email")}
            />
            <LabeledInput
              type="password"
              required
              placeholder={"Enter password..."}
              title={t("input-params.password")}
              error={error}
              onChange={handleChange("password")}
            />
            <LabeledInput
              type="password"
              required
              placeholder={"Confirm password..."}
              title={t("input-params.confirm-password")}
              error={error}
              onChange={handleChange("confirmPassword")}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button
              text={loading ? "Creating account..." : t("buttons.register")}
              buttonType={ButtonType.FOLLOW}
              size={"MEDIUM"}
              onClick={handleSubmit}
              disabled={loading}
            />
            <Button
              text={t("buttons.login")}
              buttonType={ButtonType.OUTLINED}
              size={"MEDIUM"}
              onClick={() => navigate("/sign-in")}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default SignUpPage;
