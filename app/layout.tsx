import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Creator Registration", description: "Creator registration for Influencer Analytics" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
