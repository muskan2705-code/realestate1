"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, Menu, Plus, Star, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { neighborhoods, questions, reviews } from "../lib/content";

export function Reveal({children, delay=0, className}: {children:ReactNode; delay?:number; className?:string}) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : {opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.12}} transition={{duration:0.55,delay}}>{children}</motion.div>;
}

const navigation = [["Properties","/properties"],["Neighborhoods","/neighborhood"],["Agents","/agent"],["About","/about"],["Journal","/journal"]];

export function Header() {
  const [open,setOpen] = useState(false);
  useEffect(() => {
    function close(event: KeyboardEvent) { if(event.key === "Escape") setOpen(false); }
    window.addEventListener("keydown",close);
    return () => window.removeEventListener("keydown",close);
  },[]);
  return <header className="site-header"><div className="nav-shell">
    <Link href="/" className="brand" aria-label="Veyora home" onClick={() => setOpen(false)}>Veyora</Link>
    <nav id="main-nav" className={open ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
      <div className="property-menu"><Link href="/properties" onClick={() => setOpen(false)}>Properties <ChevronDown size={13}/></Link><div className="nav-dropdown">
        <Link href="/properties" onClick={() => setOpen(false)}>Buy or Rent</Link><Link href="/sell" onClick={() => setOpen(false)}>Sell or Lease</Link><Link href="/maintain" onClick={() => setOpen(false)}>Maintain</Link>
      </div></div>
      {navigation.slice(1).map(([label,href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
      <Link href="/contact" className="mobile-contact" onClick={() => setOpen(false)}>Contact Us</Link>
    </nav>
    <Link href="/contact" className="button nav-contact">Contact Us</Link>
    <button className="icon-button menu-toggle" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
  </div></header>;
}

export function Counter({value,prefix="",suffix=""}: {value:number;prefix?:string;suffix?:string}) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref,{once:true});
  const reduced = useReducedMotion();
  const [count,setCount] = useState(value);
  useEffect(() => {
    if (!visible || reduced) return;
    const animation = animate(0,value,{duration:1.25,ease:"easeOut",onUpdate:v => setCount(Math.round(v))});
    return () => animation.stop();
  },[visible,reduced,value]);
  return <span ref={ref} aria-label={prefix+value+suffix}>{prefix}{count}{suffix}</span>;
}

export function Testimonials() {
  const [active,setActive] = useState(0);
  const reduced = useReducedMotion();
  const [name,quote,note,photo] = reviews[active];
  function step(direction:number) {
    setActive(current => (current + direction + reviews.length) % reviews.length);
  }
  return <div className="review-grid">
    <div className="rating">
      <div className="stars" aria-label="Rated 4.9 out of 5">{Array.from({length:5},(_,i) => <Star key={i} size={17} fill="currentColor"/>)}</div>
      <div className="rating-number">4.9<span>/5</span></div><p>Based on 180+ verified client reviews.</p>
      <ul><li>120+ homes sold</li><li>Local expertise in every area</li><li>Trusted from search to closing</li></ul>
    </div>
    <div className="review-panel" aria-roledescription="carousel" aria-label="Client testimonials">
      <div className="review-content" aria-live="polite"><AnimatePresence mode="wait" initial={false}>
        <motion.div key={name} initial={{opacity:0,x:reduced?0:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:reduced?0:-12}} transition={{duration:reduced?0:0.22}}>
          <blockquote>“{quote}”</blockquote>
          <div className="review-person"><Image src={"/media/"+photo} alt="" width={56} height={56}/><div><strong>{name}</strong>{note && <p>{note}</p>}</div></div>
        </motion.div>
      </AnimatePresence></div>
      <div className="review-controls"><button type="button" className="icon-button" aria-label="Previous testimonial" onClick={() => step(-1)}><ArrowLeft size={19}/></button><span>{active+1} / {reviews.length}</span><button type="button" className="icon-button" aria-label="Next testimonial" onClick={() => step(1)}><ArrowRight size={19}/></button></div>
    </div>
  </div>;
}

export function FAQ() {
  const [active,setActive] = useState<number|null>(null);
  const reduced = useReducedMotion();
  return <div className="accordion">{questions.map(([question,answer],i) => <div className="faq-item" key={question}>
    <button type="button" aria-expanded={active===i} aria-controls={"faq-"+i} onClick={() => setActive(active===i?null:i)}>{question}<Plus size={19} className={active===i ? "rotate-45" : ""}/></button>
    <div id={"faq-"+i}><AnimatePresence initial={false}>{active===i && <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:reduced?0:0.25}} className="overflow-hidden"><p>{answer}</p></motion.div>}</AnimatePresence></div>
  </div>)}</div>;
}

export function SubmissionForm({kind,property}: {kind:"inquiry"|"newsletter";property?:string}) {
  const [status,setStatus] = useState<"idle"|"pending"|"success"|"error">("idle");
  const [message,setMessage] = useState("");
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("pending");
    setMessage("");
    try {
      const data = Object.fromEntries(new FormData(form));
      const result = await fetch("/api/submissions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,kind})});
      const reply = await result.json();
      if (!result.ok) throw new Error(reply.message || "Please try again.");
      form.reset();
      setStatus("success");
      setMessage(reply.message);
    } catch(error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }
  return <form className={kind==="inquiry" ? "inquiry-form" : "newsletter-form"} onSubmit={submit}>
    {kind==="inquiry" ? <>
      <label>First Name<input name="firstName" autoComplete="given-name" maxLength={100} placeholder="First name" required/></label>
      <label>Last Name<input name="lastName" autoComplete="family-name" maxLength={100} placeholder="Last name" required/></label>
      <label>Email Address<input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required/></label>
      <label>Phone Number<input name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="Your phone number"/></label>
      <label>I am looking to<select name="intent" defaultValue={property ? "Book a viewing" : ""} required><option value="" disabled>Select an option</option>{["Buy","Rent","Sell","Lease","Property management","Book a viewing"].map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Neighborhood<select name="neighborhood" defaultValue=""><option value="">Select a neighborhood</option>{[...neighborhoods.map(n=>n.name),"Chelsea","Upper East Side","Other"].map(value => <option key={value}>{value}</option>)}</select></label>
      <label className="form-wide">Property Preferences<textarea name="preferences" rows={4} maxLength={2000} defaultValue={property ? "I’d like to arrange a viewing for "+property+"." : ""} placeholder="Tell us what you’re looking for"/></label>
    </> : <label className="newsletter-input"><span className="sr-only">Email address</span><input required type="email" name="email" maxLength={254} autoComplete="email" placeholder="Enter your email"/></label>}
    <button className={kind==="inquiry" ? "button" : "button light"} type="submit" disabled={status==="pending"}>{status==="pending" ? "Sending…" : kind==="inquiry" ? "Send My Inquiry" : "Subscribe"}</button>
    <p className="form-status" role={status==="error" ? "alert" : "status"}>{message}</p>
  </form>;
}
