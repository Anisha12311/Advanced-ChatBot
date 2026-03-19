"use client";
import Dashboard from "@/components/Dashboard";
import { ErrorBoundary } from "react-error-boundary";
import Error from "./error";
import "../style/chatbox.css";
import { useEffect } from "react";
import socket from "./socket";
import RootLayout from "./layout";
import { AuthProvider } from "@/context/AuthContext";

export default function Home() {
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <ErrorBoundary FallbackComponent={Error}>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </ErrorBoundary>
  );
}
