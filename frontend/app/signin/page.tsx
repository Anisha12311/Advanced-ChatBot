import SignIn from "@/components/SignIn";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../error";

const Login = () => {
  return (
    <ErrorBoundary FallbackComponent={Error}>
      <section className="h-full">
        <SignIn />
      </section>
    </ErrorBoundary>
  );
};

export default Login;
