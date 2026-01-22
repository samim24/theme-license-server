import fetch from "node-fetch";

function normalize(d) {
  return d
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/:\d+$/, '')
    .replace(/\/$/, '')
    .toLowerCase();
}

export default async function handler(req, res) {
  let { domain, token } = req.query;

  if (!domain || !token) {
    return res.json({ valid: false, reason: "missing_data" });
  }

  domain = normalize(domain);
  token = token.trim();

  try {
    const githubUrl =
      "https://raw.githubusercontent.com/samim24/theme-licenses/main/licenses.json";

    const response = await fetch(githubUrl + '?v=' + Date.now());
    const data = await response.json();

    let matchedDomain = null;

    // 🔑 IMPORTANT PART (THIS FIXES YOUR ISSUE)
    for (const d in data.domains) {
      if (normalize(d) === domain) {
        matchedDomain = data.domains[d];
        break;
      }
    }

    if (!matchedDomain) {
      return res.json({ valid: false, reason: "domain_not_found", domain });
    }

    if (matchedDomain.token !== token) {
      return res.json({ valid: false, reason: "token_mismatch" });
    }

    if (matchedDomain.status !== "active") {
      return res.json({ valid: false, reason: "domain_inactive" });
    }

    return res.json({
      valid: true,
      type: matchedDomain.type,
      footer_credit: data.footer_credit,
      admin_notice: data.admin_notice
    });

  } catch (e) {
    return res.json({ valid: false, reason: "server_error" });
  }
}