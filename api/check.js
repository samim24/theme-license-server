import licenses from '../data/licenses.json';
import ui from '../data/ui.json';

export default function handler(req, res) {
  const { theme, domain, key, local_version } = req.query;

  if (!theme || !domain || !key) return res.json({ valid: false, ui });

  const cleanDomain = domain.replace(/^www\./, '');

  if (!licenses[theme]) return res.json({ valid: false, ui });

  const site = licenses[theme][cleanDomain];

  if (
    site &&
    site.key === key &&
    site.status === 'active'
  ) {
    return res.json({
      valid: true,
      license: site.license,
      version: site.version,
      cache_clear: Number(local_version) !== Number(site.version),
      ui
    });
  }

  return res.json({ valid: false, ui });
}