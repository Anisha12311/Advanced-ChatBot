import NavBar from "@/components/common/NavBar";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col bg-[#eef0f8] dark:bg-gray-900">
        <ToastContainer />
        <NavBar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
