import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AboutSection, ArticleCard, Button, ContactSection, DetailGallery, FinalCTA, Heading, NeighborhoodCard, PageHeading, Photo, PropertyCard, Specifications } from "../../components/site";
import { PropertySearch } from "../../components/property-search";
import { agents, articles, neighborhoods, properties, services } from "../../lib/content";

import detailData from "../../lib/details.json";

const details: Partial<Record<string, {descriptions:string[];features:string[];images:string[]}>> = detailData;
const emptyDetail = {descriptions:[],features:[],images:[]};

const pages: Record<string,string> = {
  properties:"Properties", neighborhood:"Neighborhoods", agent:"Agents", about:"About", journal:"Journal",
  "privacy-policy":"Privacy Policy", "terms-conditions":"Terms & Conditions",
  sell:"Sell or Lease", maintain:"Property Management",
};

const collections = {properties,neighborhood:neighborhoods,journal:articles,agent:agents};

export function generateStaticParams() {
  return [
    ...Object.keys(pages).map(page=>({path:[page]})),
    ...Object.entries(collections).flatMap(([route,items])=>items.map(item=>({path:[route,item.slug]}))),
  ];
}

type Props = {params:Promise<{path:string[]}>};

export async function generateMetadata({params}:Props): Promise<Metadata> {
  const [route,slug] = (await params).path;
  const collection = collections[route as keyof typeof collections];
  return {title:slug ? collection?.find(item=>item.slug===slug)?.name : pages[route]};
}

function AgentCard({agent}:{agent:typeof agents[number]}) {
  return <Link href={"/agent/"+agent.slug} className="article-card card-link"><div className="media agent-image"><Photo file={agent.slug+".png"} alt={agent.name} sizes="(max-width: 700px) 100vw, 33vw"/></div><div className="article-info"><h3>{agent.name}</h3><p>{agent.role}</p></div></Link>;
}

export default async function InternalPage({params}:Props) {
  const [route,slug,...rest] = (await params).path;
  if (rest.length || !pages[route]) notFound();

  if (slug) {
    if (route==="properties") {
      const item = properties.find(value => value.slug===slug);
      if (!item) notFound();
      const detail = details[item.slug] ?? emptyDetail;
      return <main><div className="wrap section detail">
        <Link className="back-link" href="/properties">All properties</Link>
        <PageHeading label={"For Sale · "+item.area} title={item.name} description={item.price}/>
        <div className="media detail-photo"><Photo file={item.image} alt={item.name} sizes="100vw" priority/></div>
        <div className="detail-summary"><div><h2>About this property</h2>{detail.descriptions.length ? detail.descriptions.map(text=><p key={text}>{text}</p>) : <p>{item.description}</p>}</div><div><Specifications item={item}/><Button href={"/contact?property="+encodeURIComponent(item.name)}>Book a Viewing</Button></div></div>
        {detail.features.length>0 && <section className="detail-features"><h2>Features</h2><ul>{detail.features.map(feature=><li key={feature}>{feature}</li>)}</ul></section>}
        <DetailGallery images={detail.images} title={item.name}/>
        <Heading label="Listings" title="Explore more properties"/>
        <div className="property-grid">{properties.filter(other=>other.slug!==slug).slice(0,2).map(other=><PropertyCard key={other.slug} item={other}/>)}</div>
      </div><FinalCTA/></main>;
    }
    if (route==="neighborhood") {
      const item = neighborhoods.find(value=>value.slug===slug);
      if (!item) notFound();
      const listings = properties.filter(property=>property.area===item.name);
      const detail = details[item.slug] ?? emptyDetail;
      return <main><div className="wrap section detail">
        <Link className="back-link" href="/neighborhood">All neighborhoods</Link>
        <PageHeading label={item.area} title={item.name} description={item.description}/>
        <div className="media detail-photo"><Photo file={item.image} alt={item.name} sizes="100vw" priority/></div>
        <div className="detail-summary"><div><h2>Explore {item.name}</h2>{detail.descriptions.length ? detail.descriptions.map(text=><p key={text}>{text}</p>) : <p>{item.description}</p>}</div><Button href={"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(item.name+", New York")}>View on Map</Button></div>
        <DetailGallery images={detail.images} title={item.name}/>
        {listings.length>0 && <><Heading label="Properties" title={"Homes in "+item.name}/><div className="property-grid">{listings.map(property=><PropertyCard key={property.slug} item={property}/>)}</div></>}
      </div><FinalCTA/></main>;
    }
    if (route==="journal") {
      const item = articles.find(value=>value.slug===slug || value.slug.replace(/\.$/,"")===slug);
      if (!item) notFound();
      return <main><article className="wrap section detail">
        <Link className="back-link" href="/journal">Back to journal</Link>
        <PageHeading label={item.category} title={item.name} description={item.date}/>
        <div className="media detail-photo"><Photo file={item.image} alt={item.name} sizes="100vw" priority/></div>
        <div className="prose-body">{item.body.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div>
        <Heading label="Journal" title="Continue reading"/>
        <div className="article-grid">{articles.filter(other=>other.slug!==item.slug).map(other=><ArticleCard key={other.slug} item={other}/>)}</div>
      </article><FinalCTA/></main>;
    }
    if (route==="agent") {
      const agent=agents.find(value=>value.slug===slug);
      if (!agent) notFound();
      return <main><section className="wrap section split"><div><Link className="back-link" href="/agent">All agents</Link><PageHeading label={agent.role} title={agent.name}/><Button href="/contact">Contact the Team</Button></div><div className="media agent-profile"><Photo file={agent.slug+".png"} alt={agent.name} priority/></div></section><FinalCTA/></main>;
    }
    notFound();
  }

  switch (route) {
    case "properties": return <main><section className="wrap section"><PageHeading label="Properties" title="Find a place that feels like home." description="Explore our current listings across New York."/><PropertySearch/></section><FinalCTA/></main>;
    case "neighborhood": return <main><section className="wrap section"><PageHeading label="Neighborhoods" title="Find the neighborhood that feels like yours." description="Get to know the places we call home, from Manhattan to Brooklyn."/><div className="neighborhood-grid">{neighborhoods.map(item=><NeighborhoodCard key={item.slug} item={item}/>)}</div></section><FinalCTA/></main>;
    case "journal": return <main><section className="wrap section"><PageHeading label="Journal" title="News, stories, guides, and inspiration for elevated island living every day"/><div className="article-grid">{articles.map(item=><ArticleCard key={item.slug} item={item}/>)}</div></section><FinalCTA/></main>;
    case "agent": return <main><section className="wrap section"><PageHeading label="The People Behind Veyora" title="A Team That Knows New York by Heart." description="Behind every successful move is a team that understands the city, knows the market, and puts people before properties."/><div className="agent-grid">{agents.map(agent=><AgentCard key={agent.slug} agent={agent}/>)}</div></section><ContactSection/><FinalCTA/></main>;
    case "about": return <main><section className="wrap section detail"><PageHeading label="About Veyora" title="A more considered way to find home."/><div className="media detail-photo"><Photo file="hero.png" alt="Modern stone residence" sizes="100vw" priority/></div></section><AboutSection/><ContactSection/><FinalCTA/></main>;
    case "sell":
    case "maintain": {
      const service=services.find(item=>item.slug===route)!;
      return <main><section className="wrap section split"><div><PageHeading label="Services" title={service.name} description={service.description}/><ul className="legal-list">{service.chips.map(chip=><li key={chip}>{chip}</li>)}</ul><Button href="/contact">Get in Touch</Button></div><div className="media service-profile"><Photo file={service.image} alt="Residential architecture" priority/></div></section><ContactSection/><FinalCTA/></main>;
    }
    case "privacy-policy":
    case "terms-conditions": return <main className="wrap section"><PageHeading label="Legal" title={pages[route]}/><div className="prose-body legal-copy">
      {route==="privacy-policy" ? <><h2>Information you submit</h2><p>Submitting an inquiry saves your contact information and any preferences you provide. Newsletter signups save your email address.</p><h2>Questions about your information</h2><p>To ask about your submission or request removal, contact <a href="mailto:hello@veyora.com">hello@veyora.com</a>.</p></> : <><h2>Property information</h2><p>Listings are provided for browsing. Confirm availability, prices, and property details directly with Veyora before making a decision.</p><h2>Inquiries</h2><p>A viewing inquiry is a request. An appointment is confirmed after the team contacts you.</p></>}
    </div></main>;
    default: notFound();
  }
}
