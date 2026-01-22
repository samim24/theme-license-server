import fetch from "node-fetch";

export default async function handler(req, res) {
  const { domain, token } = req.query;

  if(!domain || !token) return res.status(400).json({ valid:false, message:"Missing domain or token" });

  try {
    const githubUrl = "https://raw.githubusercontent.com/samim24/theme-licenses/main/licenses.json";
    const response = await fetch(githubUrl);
    const data = await response.json();

    const domainData = data.domains[domain];

    if(!domainData) return res.json({ valid:false, message:"Domain not registered" });
    if(domainData.token !== token) return res.json({ valid:false, message:"Invalid token" });

    // Check domain active/inactive
    const isActive = domainData.status === "active";

    return res.json({
      valid: isActive,
      type: domainData.type,
      footer_credit: data.footer_credit,
      admin_notice: data.admin_notice
    });
  } catch(err){
    return res.status(500).json({ valid:false, message:"Server error" });
  }
}