"use client";

import { useState } from "react";
import { properties } from "../lib/content";
import { PropertyCard } from "./site";

const areas = [...new Set(properties.map(item => item.area))];
const types = [...new Set(properties.map(item => item.type))];

export function PropertySearch() {
  const [area,setArea] = useState("");
  const [type,setType] = useState("");
  const [beds,setBeds] = useState("");
  const [baths,setBaths] = useState("");
  const [price,setPrice] = useState("");
  const [status,setStatus] = useState("");
  const results = properties.filter(item =>
    status !== "For Rent" && (!area || item.area===area) && (!type || item.type===type) &&
    (!beds || item.beds>=Number(beds)) && (!baths || item.baths>=Number(baths)) &&
    (!price || item.amount<=Number(price))
  );

  return <>
    <form className="filters" onSubmit={event => event.preventDefault()} onReset={() => {setArea("");setType("");setBeds("");setBaths("");setPrice("");setStatus("");}}>
      <label>Status<select value={status} onChange={event => setStatus(event.target.value)}><option value="">All statuses</option><option>For Sale</option><option>For Rent</option></select></label>
      <label>Neighborhood<select value={area} onChange={event => setArea(event.target.value)}><option value="">All neighborhoods</option>{areas.map(option => <option key={option}>{option}</option>)}</select></label>
      <label>Property type<select value={type} onChange={event => setType(event.target.value)}><option value="">All types</option>{types.map(option => <option key={option}>{option}</option>)}</select></label>
      <label>Bedrooms<select value={beds} onChange={event => setBeds(event.target.value)}><option value="">Any bedrooms</option>{[2,3,4,5,6].map(option => <option value={option} key={option}>{option}+</option>)}</select></label>
      <label>Bathrooms<select value={baths} onChange={event => setBaths(event.target.value)}><option value="">Any bathrooms</option>{[2,3,4,5].map(option => <option value={option} key={option}>{option}+</option>)}</select></label>
      <label>Maximum price<select value={price} onChange={event => setPrice(event.target.value)}><option value="">Any price</option>{[2,4,5,10].map(option => <option value={option*1e6} key={option}>${option}M</option>)}</select></label>
      <button className="button" type="reset">Reset filters</button>
    </form>
    <p className="results-count" aria-live="polite">{results.length} {results.length===1 ? "property" : "properties"}</p>
    {results.length ? <div className="property-grid">{results.map(item => <PropertyCard key={item.slug} item={item}/>)}</div> : <p className="empty-results">No listings match these filters. Try choosing a different neighborhood or price.</p>}
  </>;
}
