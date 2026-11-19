import type { Metadata } from "next";
import { ContactSection } from "../../components/site";
import { properties } from "../../lib/content";

export const metadata: Metadata = { title:"Contact Us" };

export default async function ContactPage({searchParams}: {searchParams:Promise<{property?:string|string[]}>}) {
  const requested = (await searchParams).property;
  const property = properties.find(item=>item.name===requested)?.name;
  return <main><ContactSection property={property}/></main>;
}
