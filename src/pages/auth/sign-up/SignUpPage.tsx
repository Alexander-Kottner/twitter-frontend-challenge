import type { ChangeEvent } from "react";
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
import { useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { StyledErrorMessage } from "../../../components/common/ValidationStyles";
import Toast, { ToastType } from "../../../components/toast/Toast";

interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const httpRequestService = useHttpRequestService();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const handleSubmit = async (values: SignUpData, { setFieldError }: any) => {
    setLoading(true);

    try {
      const { confirmPassword, ...requestData } = values;

      // Sign up and store the token
      await httpRequestService.signUp(requestData);

      // Invalidate user query to refetch user data
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      // Navigate after a brief delay to show the toast
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: any) {
      console.error("Sign up error:", err);
      
      // Handle specific field errors from backend
      if (err.response?.data?.message?.includes('username')) {
        setFieldError('username', 'Username already exists');
      } else if (err.response?.data?.message?.includes('email')) {
        setFieldError('email', 'Email already exists');
      } else {
        setFieldError('email', 'Registration failed. Please try again.');
      }
      
      // Clear any stored token if sign up failed
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
          message={"Registro exitoso!"}
        />
      )}
      <div className={"border"}>
        <div className={"container"}>
          <div className={"header"}>
            <img src={logo} alt="Twitter Logo" />
            <StyledH3>{t("title.register")}</StyledH3>
          </div>
          <Formik
            initialValues={{
              name: '',
              username: '',
              email: '',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={SignUpSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, handleChange, handleBlur, submitForm }) => (
              <Form>
                <div className={"input-container"}>
                  <LabeledInput
                    required
                    placeholder={"Enter name..."}
                    title={t("input-params.name")}
                    error={!!(errors.name && touched.name)}
                    onChange={handleChange}
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                  />
                  {errors.name && touched.name && (
                    <StyledErrorMessage>{errors.name}</StyledErrorMessage>
                  )}
                  
                  <LabeledInput
                    required
                    placeholder={"Enter username..."}
                    title={t("input-params.username")}
                    error={!!(errors.username && touched.username)}
                    onChange={handleChange}
                    name="username"
                    value={values.username}
                    onBlur={handleBlur}
                  />
                  {errors.username && touched.username && (
                    <StyledErrorMessage>{errors.username}</StyledErrorMessage>
                  )}
                  
                  <LabeledInput
                    required
                    placeholder={"Enter email..."}
                    title={t("input-params.email")}
                    error={!!(errors.email && touched.email)}
                    onChange={handleChange}
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email && (
                    <StyledErrorMessage>{errors.email}</StyledErrorMessage>
                  )}
                  
                  <LabeledInput
                    type="password"
                    required
                    placeholder={"Enter password..."}
                    title={t("input-params.password")}
                    error={!!(errors.password && touched.password)}
                    onChange={handleChange}
                    name="password"
                    value={values.password}
                    onBlur={handleBlur}
                  />
                  {errors.password && touched.password && (
                    <StyledErrorMessage>{errors.password}</StyledErrorMessage>
                  )}
                  
                  <LabeledInput
                    type="password"
                    required
                    placeholder={"Confirm password..."}
                    title={t("input-params.confirm-password")}
                    error={!!(errors.confirmPassword && touched.confirmPassword)}
                    onChange={handleChange}
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onBlur={handleBlur}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <StyledErrorMessage>{errors.confirmPassword}</StyledErrorMessage>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginTop: "20px", gap: "8px", alignItems: "center" }}>
                  <Button
                    text={loading ? "Creating account..." : t("buttons.register")}
                    buttonVariant={ButtonVariant.FILLED}
                    size={ButtonSize.MEDIUM}
                    onClick={submitForm}
                    disabled={loading}
                  />
                  <Button
                    text={t("buttons.login")}
                    buttonVariant={ButtonVariant.OUTLINED}
                    size={ButtonSize.MEDIUM}
                    onClick={() => navigate("/sign-in")}
                    disabled={loading}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default SignUpPage;
