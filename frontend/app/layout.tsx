import NavBar from "@/components/common/NavBar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(" test layout");
  return (
    <html lang="en">
      <body className="h-screen flex flex-col bg-[#eef0f8] dark:bg-gray-900">
        <NavBar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
