() => {
  const out = [], vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !e.closest('[hidden],[aria-hidden="true"]'); };
  const name = e => {
    if (e.getAttribute('aria-label')) return e.getAttribute('aria-label');
    if (e.getAttribute('aria-labelledby')) return e.getAttribute('aria-labelledby').split(' ').map(i => (document.getElementById(i)||{}).textContent||'').join(' ');
    if (e.labels && e.labels.length) return [...e.labels].map(l => l.textContent).join(' ');
    return (e.innerText || e.textContent || e.getAttribute('title') || e.getAttribute('alt') || '').trim();
  };
  for (const e of document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[tabindex]')) {
    const t = e.getAttribute('tabindex');
    if (t && +t > 0) out.push(`positive tabindex on ${e.outerHTML.slice(0,60)}`);
    if (e.closest('[aria-hidden="true"]') && t !== '-1' && !e.closest('.hp')) out.push(`focusable inside aria-hidden: ${e.outerHTML.slice(0,60)}`);
    if (vis(e) && !name(e).trim()) out.push(`no accessible name: ${e.outerHTML.slice(0,80)}`);
  }
  for (const e of document.querySelectorAll('input:not([type=hidden]),select,textarea'))
    if (!e.closest('.hp') && !(e.labels && e.labels.length) && !e.getAttribute('aria-label')) out.push(`unlabelled field #${e.id}`);
  for (const e of document.querySelectorAll('[role=img],img,svg[role=img]'))
    if (!name(e) && !e.closest('[aria-hidden="true"]')) out.push(`image without text alternative: ${e.outerHTML.slice(0,60)}`);
  for (const e of document.querySelectorAll('[aria-controls],[aria-describedby]'))
    for (const id of (e.getAttribute('aria-controls')||e.getAttribute('aria-describedby')).split(' '))
      if (!document.getElementById(id)) out.push(`ARIA reference points nowhere: ${id}`);
  if (document.querySelectorAll('main').length !== 1) out.push('page needs exactly one <main>');
  if (!document.querySelector('header, [role=banner]') || !document.querySelector('footer, [role=contentinfo]') || !document.querySelector('nav')) out.push('missing banner/contentinfo/navigation landmark');
  const hs = [...document.querySelectorAll('main h1, main h2, main h3, main h4')].map(h => +h.tagName[1]);
  if (hs[0] !== 1) out.push('main content does not start with the H1');
  const vp = (document.querySelector('meta[name=viewport]') || {content: ''}).content;
  if (!vp) out.push('missing viewport meta');
  if (/user-scalable=no|maximum-scale=1(?!\d)/.test(vp)) out.push('zoom is disabled');
  if (!document.documentElement.lang) out.push('missing lang');
  const lum = c => { const [r,g,b] = c.map(v => { v /= 255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4); }); return .2126*r + .7152*g + .0722*b; };
  const rgba = s => { const srgb = s.startsWith('color(srgb'); const m = s.replace(/^color\(srgb/,'').match(/[\d.]+/g); if (!m) return [0,0,0,0]; const v = m.map(Number); if (srgb) { const o = v.slice(0,3).map(x => x*255); o.push(v.length > 3 ? v[3] : 1); return o; } return v; };
  const bgOf = e => { let layers = []; for (let n = e; n; n = n.parentElement) { const c = rgba(getComputedStyle(n).backgroundColor); if (c[3] === undefined) c[3] = 1; if (c[3] > 0) { layers.push(c); if (c[3] >= 1) break; } }
    let base = [255,255,255]; for (const l of layers.reverse()) { const a = l[3]; base = base.map((v,i) => l[i]*a + v*(1-a)); } return base; };
  const seen = new Set(), walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const tn = walker.currentNode, e = tn.parentElement;
    if (!tn.textContent.trim() || !e || seen.has(e) || e.closest('svg,.hp,script,style,:disabled,[aria-disabled="true"]')) continue; /* WCAG 1.4.3: inactive controls are exempt */
    seen.add(e); if (!vis(e)) continue;
    const s = getComputedStyle(e), fg = rgba(s.color), bg = bgOf(e);
    const a = fg[3] === undefined ? 1 : fg[3], f = fg.slice(0,3).map((v,i) => v*a + bg[i]*(1-a));
    let op = 1; for (let n = e; n; n = n.parentElement) op *= +getComputedStyle(n).opacity;
    const fe = f.map((v,i) => v*op + bg[i]*(1-op));
    const L1 = lum(fe), L2 = lum(bg), ratio = (Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);
    const px = parseFloat(s.fontSize), large = px >= 24 || (+s.fontWeight >= 700 && px >= 18.66);
    if (ratio < (large ? 3 : 4.5)) out.push(`contrast ${ratio.toFixed(2)}:1 on "${tn.textContent.trim().slice(0,40)}"`);
  }
  return [...new Set(out)];
}
