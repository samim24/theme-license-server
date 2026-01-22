import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const { domain, token } = req.query;

    if (!domain || !token) {
      return res.status(400).json({
        valid: false,
        reason: "missing_params"
      });
    }

    const filePath = path.join(process.cwd(), "licenses.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);

    const record = data.domains?.[domain];

    if (!record) {
      return res.json({ valid: false, reason: "domain_not_found" });
    }

    if (record.status !== "active") {
      return res.json({ valid: false, reason: "inactive_domain" });
    }

    if (record.token !== token) {
      return res.json({ valid: false, reason: "token_mismatch" });
    }

    return res.json({
      valid: true,
      type: record.type
    });

  } catch (e) {
    return res.status(500).json({
      valid: false,
      error: e.message
    });
  }
}