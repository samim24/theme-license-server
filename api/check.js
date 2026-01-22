import data from '../data/licenses.json';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=7200');
  
  const { h, t } = req.query;
  
  // Default response for missing params
  if (!h || !t) {
    return res.json({
      status: "unconfigured",
      tier: "free",
      config: { features: ["footer", "notice", "overlay"] },
      ui: data.ui
    });
  }
  
  // Find matching node
  const node = data.nodes.find(n => 
    n.host === h && n.token === t
  );
  
  // Not found
  if (!node) {
    return res.json({
      status: "invalid",
      tier: "free",
      config: { features: ["footer", "notice", "overlay"] },
      ui: data.ui
    });
  }
  
  // Suspended
  if (node.state !== "on") {
    return res.json({
      status: "suspended",
      tier: "free",
      config: { features: ["overlay"] },
      ui: data.ui,
      reason: "Account suspended"
    });
  }
  
  // Active
  return res.json({
    status: "active",
    tier: node.tier,
    config: node.config || {},
    ui: node.tier === "paid" ? {} : data.ui
  });
}

export const config = {
  runtime: 'edge'
};