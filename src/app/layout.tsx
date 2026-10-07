import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { getNavbarCategories } from "@/lib/supabase/queries/categories";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiqora | Events & Sports Match Ticketing",
  description:
    "Book events, football matches, sports showdowns, and live experiences with Tiqora.",
  icons: {
    icon: "/new-logo.webp",
    shortcut: "/new-logo.webp",
    apple: "/new-logo.webp",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const [{ data: { user } }, navbarCategories] = await Promise.all([
    supabase.auth.getUser(),
    getNavbarCategories(),
  ]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} dark h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('tiqora-theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-[#2563EB]/20 selection:text-[#2563EB]">
        <Navbar initialUser={user} categories={navbarCategories} />
        <main className="flex-1">{children}</main>
        <Footer categories={navbarCategories} />
        <Toaster />
      </body>
    </html>
  );
}
