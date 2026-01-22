import fetch from "node-fetch"; // required in Vercel Node.js

export default async function(req,res){
  const { theme, domain, token } = req.query;

  if(!token) return res.json({ valid:false });

  const url = "https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/theme-license-server/main/licenses.json?ts="+Date.now();
  const db = await fetch(url).then(r=>r.json());

  const lic = db?.themes?.[theme]?.[domain];
  if(!lic || lic.status!=="active") return res.json({ valid:false });

  if(lic.token !== token) return res.json({ valid:false });

  res.json({ valid:true, type:lic.type });
}