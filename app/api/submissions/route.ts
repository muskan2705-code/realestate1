import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > 12000) return NextResponse.json({message:"Please shorten your submission."},{status:413});

  let input: Record<string, unknown>;
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid submission");
    input = data as Record<string, unknown>;
  } catch {
    return NextResponse.json({message:"Invalid submission."},{status:400});
  }

  const kind = input.kind;
  const field = (key:string) => typeof input[key] === "string" ? input[key].trim() : "";
  const email = field("email").toLowerCase();
  const firstName = field("firstName");
  const lastName = field("lastName");
  const intent = field("intent");
  const phone = field("phone");
  const neighborhood = field("neighborhood");
  const preferences = field("preferences");
  const intentOptions = ["Buy","Rent","Sell","Lease","Property management","Book a viewing"];

  if ((kind !== "newsletter" && kind !== "inquiry") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254) {
    return NextResponse.json({message:"Enter a valid email address."},{status:400});
  }
  if (kind==="inquiry" && (!firstName || !lastName || !intentOptions.includes(intent) || firstName.length>100 || lastName.length>100 || phone.length>40 || neighborhood.length>100 || preferences.length>2000)) {
    return NextResponse.json({message:"Check your name, inquiry type, and property preferences."},{status:400});
  }

  const record = {email, submittedAt:new Date().toISOString(), ...(kind==="inquiry" ? {firstName,lastName,intent,phone,neighborhood,preferences} : {})};
  try {
    const directory = process.env.VEYORA_DATA_DIR || path.join(process.cwd(),".data");
    await mkdir(directory,{recursive:true});
    await appendFile(path.join(directory,kind+".jsonl"),JSON.stringify(record)+"\n",{encoding:"utf8",mode:0o600});
  } catch {
    return NextResponse.json({message:"We couldn’t save your submission. Please try again."},{status:503});
  }
  return NextResponse.json({message:kind==="inquiry" ? "Thank you. Your inquiry has been received." : "Thank you for subscribing."},{status:201});
}
