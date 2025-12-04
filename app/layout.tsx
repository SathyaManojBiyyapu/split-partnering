import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Split Partnering",
  description: "Match people on real-world offers and deals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
