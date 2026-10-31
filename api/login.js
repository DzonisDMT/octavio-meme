import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "octavio_access";
const MAX_AGE = 604800;

function equal(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method not allowed");
  }

  const secret = process.env.OCTAVIO_SITE_PASSWORD;
  if (!secret) return res.status(503).json({error:"Password protection is not configured."});

  const supplied = req.body && typeof req.body.password === "string" ? req.body.password : "";
  if (!equal(supplied, secret)) return res.status(401).json({error:"Incorrect password."});

  const issued = Math.floor(Date.now()/1000).toString();
  const signature = createHmac("sha256", secret).update(issued).digest("base64url");
  const token = issued + "." + signature;
  res.setHeader("Set-Cookie", COOKIE + "=" + encodeURIComponent(token) + "; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=" + MAX_AGE);
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ok:true});
}
