import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700"]
})


export const metadata: Metadata = {
  title: "LiveCode Editor",
  description: "LiveCode- A complete Dev environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased`}
      >
        <ThemeProvider
         attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>  
        <Provider>
        <Toaster/>
        {children}
        </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
