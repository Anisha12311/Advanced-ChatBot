"use client";
import SignIn from "@/components/SignIn";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../error";

const Login = () => {
  return (
    <ErrorBoundary FallbackComponent={Error}>
      <div className="h-[calc(100vh-3rem)]">
        <SignIn />
      </div>
    </ErrorBoundary>
  );
};

export default Login;
