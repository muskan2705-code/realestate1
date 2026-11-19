import type { Metadata } from "next";
import { Header } from "../components/interactive";
import { Footer } from "../components/site";
import "./globals.css";

export const metadata: Metadata = {
  title:{default:"Veyora — A more considered way to find home",template:"%s | Veyora"},
  description:"Explore thoughtfully selected homes and neighborhoods with Veyora.",
};

export default function Layout({children}: Readonly<{children:React.ReactNode}>) {
  return <html lang="en"><body><Header/>{children}<Footer/></body></html>;
}
