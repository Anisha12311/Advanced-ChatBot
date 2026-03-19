import SignUp from "@/components/SignUp";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../error";

const Register = () => {
  return (
    <ErrorBoundary FallbackComponent={Error}>
     
      <section className="h-full">
        <SignUp />
      </section>
    </ErrorBoundary>
  );
};

export default Register;
