import Dashboard from "@/components/Dashboard";
import { ErrorBoundary } from "react-error-boundary";
import Error from "./error";

export default function Home() {
  return (
    <ErrorBoundary FallbackComponent={Error}>
      <Dashboard />
    </ErrorBoundary>
  );
}
