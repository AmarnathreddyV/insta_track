import "./globals.css";

export const metadata = {
  title: "Influencer Analytics | Creator Registration",
  description: "Register your creator profile and connect your Instagram account.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
