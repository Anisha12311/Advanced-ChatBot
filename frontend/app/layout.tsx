"use client";
import NavBar from "@/components/common/NavBar";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNav =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/resetpassword" ||
    pathname === "/forgetpassword";
  return (
    <html lang="en">
      <body className="h-screen flex flex-col bg-[#eef0f8] dark:bg-gray-900">
        <AuthProvider>
          <ToastContainer />
          {!hideNav && <NavBar />}

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
