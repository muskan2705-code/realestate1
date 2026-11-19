import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ArticleCard, AboutSection, Button, ContactSection, FinalCTA, Heading, NeighborhoodCard, Photo, PropertyCard } from "../components/site";
import { FAQ, Reveal, Testimonials } from "../components/interactive";
import { articles, neighborhoods, properties, services, steps } from "../lib/content";

export default function Home() {
  return <main className="home">
    <section className="hero">
      <div className="hero-photo hero-desktop"><Photo file="hero.png" alt="Modern stone house at sunset" sizes="100vw" priority/></div>
      <div className="hero-photo hero-mobile"><Photo file="hero-detail.png" alt="Modern stone house at sunset" sizes="100vw"/></div>
      <div className="hero-shade"/>
      <div className="hero-copy">
        <p className="eyebrow">Where better living begins</p>
        <h1>Spaces for a brighter tomorrow.</h1>
        <p>Where thoughtful architecture, prime locations, and extraordinary living come together.</p>
        <Button light>Explore Properties</Button>
      </div>
    </section>

    <AboutSection/>
    <section className="section surface"><div className="wrap">
      <Heading label="Recent Listing" title="Discover our latest listings and explore places that could become your next home"/>
      <div className="property-grid home-properties">{properties.map((item,i) => <Reveal key={item.slug} delay={i*0.06}><PropertyCard item={item}/></Reveal>)}</div>
      <div className="section-action"><Button>View All Properties</Button></div>
    </div></section>

    <section className="section"><div className="wrap">
      <Heading label="Neighborhoods" title="Every neighborhood has a story to tell — find the one that feels like yours."/>
      <div className="neighborhood-grid">{neighborhoods.map((item,i) => <Reveal key={item.slug} delay={i*0.05}><NeighborhoodCard item={item}/></Reveal>)}</div>
      <div className="section-action"><Button href="/neighborhood">View All Neighborhoods</Button></div>
    </div></section>

    <section className="section dark"><div className="wrap">
      <Heading label="Services" title="Expert guidance, tailored services, and lasting support — all under one roof."/>
      <div className="services">{services.map((item,i) => <Reveal key={item.slug} className={"service-row service-"+i}>
        <div className="service-copy"><h3>{item.name}</h3><p>{item.description}</p><ul>{item.chips.map(chip => <li key={chip}>{chip}</li>)}</ul><Link className="text-link" href={"/"+item.slug}>Learn more <ArrowUpRight size={17}/></Link></div>
        <div className="media service-photo"><Photo file={item.image} alt="Real estate and interiors"/></div>
      </Reveal>)}</div>
    </div></section>

    <section className="section"><div className="wrap">
      <Heading label="Process" title="From the first conversation to the final keys — we make every step count."/>
      <div className="split process"><Reveal className="media process-photo"><Photo file="process.png" alt="Contemporary home interior"/></Reveal><ol className="steps">
        {steps.map(([title,description],i) => <li key={title}><Reveal delay={i*0.05} className="step"><span className="step-index">0{i+1}</span><div><h3>{title}</h3><p>{description}</p></div></Reveal></li>)}
      </ol></div>
    </div></section>

    <section className="section surface"><div className="wrap">
      <Heading label="Testimonial" title="Real stories, meaningful experiences — hear what our clients have to say."/>
      <Reveal><Testimonials/></Reveal>
      <div className="ready"><h3>Ready to find your place?</h3><Button>Explore Properties</Button></div>
    </div></section>

    <section className="section dark"><div className="wrap">
      <Heading label="FAQ" title="Everything you need to know to get started"/>
      <div className="faq-layout"><Reveal className="faq-aside"><div className="media"><Photo file="faq-cta.png" alt="An architectural detail"/></div><Button href="/contact" light>Talk to an Agent</Button></Reveal><Reveal><FAQ/></Reveal></div>
    </div></section>

    <section className="section"><div className="wrap">
      <Heading label="Journal" title="News, stories, guides, and inspiration for elevated island living every day"/>
      <div className="article-grid">{articles.map((item,i) => <Reveal key={item.slug} delay={i*0.05}><ArticleCard item={item}/></Reveal>)}</div>
      <div className="section-action"><Button href="/journal">View All Articles</Button></div>
    </div></section>

    <ContactSection/>
    <FinalCTA/>
  </main>;
}
