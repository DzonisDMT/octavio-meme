const COOKIE = "octavio_access";
const MAX_AGE = 604800;

async function sign(value, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {name:"HMAC",hash:"SHA-256"}, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  return btoa(String.fromCharCode(...bytes)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
}

async function allowed(request, secret) {
  const raw = request.headers.get("cookie") || "";
  const item = raw.split(";").map(x => x.trim()).find(x => x.startsWith(COOKIE + "="));
  if (!item) return false;
  const token = decodeURIComponent(item.slice(COOKIE.length + 1));
  const parts = token.split(".");
  if (parts.length !== 2 || !/^\d+$/.test(parts[0])) return false;
  const age = Math.floor(Date.now()/1000) - Number(parts[0]);
  if (age < 0 || age > MAX_AGE) return false;
  return parts[1] === await sign(parts[0], secret);
}

const page = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#141418"><title>Private Reef — OCTAVIO</title><style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(ellipse at 50% 0,#263b43,#141418 60%);color:#f6f3ec;font-family:Arial,sans-serif}.card{width:min(100%,420px);padding:36px;border:1px solid #44464d;border-radius:22px;background:#1d1d23;text-align:center;box-shadow:0 24px 80px #0008}.mark{font-size:13px;letter-spacing:.2em;color:#ff9b48;font-weight:bold}.octo{font-size:56px;margin:18px}h1{font-size:25px;margin:0 0 10px}p{color:#b8b7c0;line-height:1.5;margin:0 0 24px}input,button{width:100%;padding:15px;border-radius:10px;font-size:16px}input{border:1px solid #55545e;background:#111116;color:white}button{margin-top:12px;border:0;background:#ff9b48;color:#171318;font-weight:bold;cursor:pointer}.error{min-height:22px;margin-top:14px;color:#ff8d8d;font-size:13px}.foot{margin-top:24px;font-size:11px;color:#777681;letter-spacing:.12em}</style><body><main class="card"><div class="mark">$OCTAVIO · PRIVATE ACCESS</div><div class="octo">🐙</div><h1>WELCOME TO THE REEF</h1><p>This part of the reef is password protected. Enter the shared password to continue.</p><form id="login"><input id="pw" type="password" autocomplete="current-password" placeholder="Enter password" required><button>ENTER THE REEF</button><div class="error" id="error"></div></form><div class="foot">JUST AN OCTAVIO RUNNING A NODE</div></main><script>
document.getElementById("login").addEventListener("submit",async e=>{e.preventDefault();const b=e.currentTarget.querySelector("button"),m=document.getElementById("error");b.disabled=true;b.textContent="CHECKING…";m.textContent="";try{const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:document.getElementById("pw").value})});if(r.ok)location.reload();else m.textContent="Incorrect password. Try again."}catch(_){m.textContent="Connection error. Try again."}finally{b.disabled=false;b.textContent="ENTER THE REEF"}});
</script></body></html>`;

export async function middleware(request) {
  const secret = process.env.OCTAVIO_SITE_PASSWORD;
  if (!secret) return new Response("Password protection is not configured.", {status:503});
  if (await allowed(request, secret)) return;
  return new Response(page, {status:401,headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
}

export const config = {matcher:["/((?!api/login).*)"]};
