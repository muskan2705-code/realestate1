import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, Layers3, MapPin, Maximize, MoveUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { properties, neighborhoods, articles, about } from "../lib/content";
import { Counter, Reveal, SubmissionForm } from "./interactive";

export function Photo({file,alt="",sizes="(max-width: 700px) 100vw, 50vw",priority=false}: {file:string;alt?:string;sizes?:string;priority?:boolean}) {
  return <Image src={"/media/"+file} alt={alt} fill sizes={sizes} preload={priority}/>;
}

export function Button({children,href="/properties",light=false}: {children:ReactNode;href?:string;light?:boolean}) {
  return <Link className={light ? "button light" : "button"} href={href}>{children}<ArrowUpRight size={17} aria-hidden="true"/></Link>;
}

export function Heading({label,title}: {label:string;title:string}) {
  return <Reveal className="section-heading"><p className="eyebrow">{label}</p><h2>{title}</h2></Reveal>;
}

export function PageHeading({label,title,description}: {label:string;title:string;description?:string}) {
  return <div className="page-heading"><p className="eyebrow">{label}</p><h1>{title}</h1>{description && <p>{description}</p>}</div>;
}

export function Specifications({item}: {item:typeof properties[number]}) {
  const specs = [[Maximize,item.size+" sq ft"],[Layers3,item.floors+(item.floors===1?" Floor":" Floors")],[BedDouble,item.beds+" Bedrooms"],[Bath,item.baths+" Bathrooms"]] as const;
  return <ul className="specs">{specs.map(([Icon,label]) => <li key={label}><Icon size={16} aria-hidden="true"/>{label}</li>)}</ul>;
}

export function PropertyCard({item}: {item:typeof properties[number]}) {
  return <Link className="property-card card-link" href={"/properties/"+item.slug}>
    <div className="media property-image"><Photo file={item.image} alt={item.name}/><span className="sale">For Sale</span><span className="card-arrow"><MoveUpRight size={19}/></span></div>
    <div className="property-info"><div className="property-title"><h3>{item.name}</h3><p>{item.price}</p></div><p className="meta"><MapPin size={15}/>{item.area}<span>·</span>{item.type}</p><Specifications item={item}/></div>
  </Link>;
}

export function NeighborhoodCard({item}: {item:typeof neighborhoods[number]}) {
  return <Link href={"/neighborhood/"+item.slug} className="media neighborhood-card card-link"><Photo file={item.image} alt={item.name} sizes="(max-width: 700px) 100vw, (max-width: 1040px) 50vw, 25vw"/><span className="neighborhood-caption"><span><span>{item.area}</span><h3>{item.name}</h3></span><ArrowUpRight size={20}/></span></Link>;
}

export function ArticleCard({item}: {item:typeof articles[number]}) {
  return <Link href={"/journal/"+item.slug} className="article-card card-link"><div className="media"><Photo file={item.image} alt={item.name} sizes="(max-width: 700px) 100vw, 33vw"/><span className="sale">{item.category}</span></div><div className="article-info"><p>{item.date}</p><h3>{item.name}</h3></div></Link>;
}

export function AboutSection() {
  return <section className="section wrap about-section" id="about"><Reveal><p className="eyebrow">About Us</p></Reveal><Reveal className="about-copy"><h2>{about}</h2>
    <div className="stats"><div><strong><Counter value={240} suffix="+"/></strong><span>Homes Sold</span></div><div><strong><Counter value={18} suffix="+"/></strong><span>Years in Practice</span></div><div><strong><Counter value={680} prefix="$" suffix="M"/></strong><span>Sales Volume</span></div></div>
  </Reveal></section>;
}

export function ContactSection({property}: {property?:string}) {
  return <section className="section dark" id="contact"><div className="wrap contact-layout">
    <div><Heading label="Get In Touch" title="Let's start a conversation"/><SubmissionForm key={property} kind="inquiry" property={property}/></div>
    <Reveal className="media contact-image"><Photo file="contact.png" alt="Contemporary home interior"/></Reveal>
  </div></section>;
}

export function FinalCTA() {
  return <section className="final-cta media"><Photo file="final.png" alt="" sizes="100vw"/><div className="final-shade"/><Reveal className="final-content"><h2>From vision to reality — we craft your dream home</h2><Button light>Explore Properties</Button></Reveal></section>;
}

const footerLinks = [
  {name:"Veyora", links:[["Home","/"],["About","/about"],["Agents","/agent"],["Journal","/journal"],["Contact","/contact"]]},
  {name:"Properties",links:[["Buy or Rent","/properties"],["Sell or Lease","/sell"],["Maintain","/maintain"]]},
  {name:"Neighborhoods",links:neighborhoods.map(item => [item.name,"/neighborhood/"+item.slug])},
  {name:"Legal",links:[["Privacy Policy","/privacy-policy"],["Terms & Conditions","/terms-conditions"],["404","/404"]]},
];

export function Footer() {
  return <footer className="site-footer dark"><div className="wrap">
    <div className="newsletter"><h2>Join our newsletter for the latest in real-estate journey.</h2><SubmissionForm kind="newsletter"/></div>
    <div className="footer-links">{footerLinks.map(group => <div key={group.name}><h3>{group.name}</h3>{group.links.map(([label,href]) => <Link key={href} href={href}>{label}</Link>)}</div>)}
      <div><h3>Contact</h3><a href="mailto:hello@veyora.com">hello@veyora.com</a><a href="tel:+18408412569">+1 840 841 25 69</a><a href="https://www.google.com/maps/search/?api=1&query=20+Hudson+Yards+New+York">20 Hudson Yards, New York</a></div>
    </div>
    <div className="footer-mark" aria-hidden="true">Veyora</div><p className="copyright">© 2026 Veyora. A more considered way to find home.</p>
  </div></footer>;
}

export function DetailGallery({images,title}: {images:string[];title:string}) {
  if (!images.length) return null;
  return <div className="detail-gallery">{images.map((file,i)=><div key={file} className="media"><Photo file={file} alt={title+" — view "+(i+2)}/></div>)}</div>;
}
