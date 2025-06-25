import React from "react";
import Toast, { ToastType } from "./Toast";

const SuccessToast = ({ message }: { message: string }) => {
  return <Toast type={ToastType.SUCCESS} message={message} />;
};

export default SuccessToast;