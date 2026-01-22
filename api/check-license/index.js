import fetch from "node-fetch";

function normalizeDomain(domain) {
  return domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
    .toLowerCase();
}

export default async function handler(req, res) {
  let { domain, token } = req.query;

  if (!domain || !token) {
    return res.json({ valid: false, reason: "missing_data" });
  }

  domain = normalizeDomain(domain);
  token = token.trim();

  try {
    const githubUrl =
      "https://raw.githubusercontent.com/samim24/theme-licenses/main/licenses.json";

    const response = await fetch(githubUrl + "?t=" + Date.now());
    const data = await response.json();

    const domainData = data.domains[domain];

    if (!domainData) {
      return res.json({ valid: false, reason: "domain_not_found" });
    }

    if (domainData.token !== token) {
      return res.json({ valid: false, reason: "token_mismatch" });
    }

    if (domainData.status !== "active") {
      return res.json({ valid: false, reason: "domain_inactive" });
    }

    return res.json({
      valid: true,
      type: domainData.type,
      footer_credit: data.footer_credit,
      admin_notice: data.admin_notice
    });

  } catch (e) {
    return res.json({ valid: false, reason: "server_error" });
  }
}