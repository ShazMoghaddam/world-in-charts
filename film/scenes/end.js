// The last page: the name, how the charts are drawn, the link, and the signature at the foot.
Bezel.scene((root, kit) => {
  const { u, safe, colours, props } = kit;
  const s = kit.stage();
  const pencil = { fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", filter: "url(#pencil)" };
  const base = root.getBoundingClientRect();
  const below = (el, gap) => el.getBoundingClientRect().bottom - base.top + gap;
  const name = kit.text(root, props.name, { x: safe.x, y: safe.y + u * 2, size: 9, font: "heading", maxWidth: safe.width });
  const under = kit.svg("path", { d: kit.rough.line(safe.x, below(name, u * 1.2), safe.x + Math.min(safe.width * 0.6, name.getBoundingClientRect().width), below(name, u * 1.2), { seed: 7, wobble: 0.5 }),
    ...pencil, stroke: colours.accent, "stroke-width": u * 0.45 }, s);
  const line = kit.text(root, props.line, { x: safe.x, y: below(name, u * 4.5), size: 3.4, colour: colours.muted, maxWidth: safe.width, style: { fontStyle: "italic" } });
  // The words' own box (not the element's), so a highlight hugs the text.
  const words = (el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect(); };
  // A broad highlighter stroke behind some words, swiped on left to right.
  const highlight = (el, colour) => {
    const r = words(el), y = r.top - base.top + r.height * 0.55;
    const m = kit.svg("path", { d: "M" + (r.left - base.left - u * 0.8) + " " + y + " L" + (r.right - base.left + u * 0.8) + " " + (y - u * 0.2), fill: "none", stroke: colour,
      "stroke-width": r.height * 0.9, "stroke-linecap": "round", opacity: 0.7 }, s);
    s.prepend(m);
    return m;
  };
  const url = kit.text(root, props.url, { x: safe.x + u, y: below(line, u * 5), size: 3.2, font: "mono", weight: 600, colour: colours.text, maxWidth: safe.width - u * 2 });
  const marker = highlight(url, "#FFD84D");
  const by = kit.text(root, props.by, { x: safe.x, y: below(url, u * 7), size: 3.6, weight: 600, colour: colours.text, maxWidth: safe.width });
  let ly = below(by, u * 2);
  const links = props.links.map((text, i) => {
    const el = kit.text(root, text, { x: safe.x + u, y: ly, size: 3, font: "mono", colour: colours.text, maxWidth: safe.width - u * 2 });
    const m = highlight(el, ["#9FD8F0", "#F7B6C8"][i % 2]);
    ly = el.getBoundingClientRect().bottom - base.top + u * 1.8;
    return { el, m };
  });
  const sources = kit.text(root, props.sources, { x: safe.x, y: ly + u * 4, size: 2.6, font: "mono", colour: colours.muted, maxWidth: safe.width });

  const plan = kit.drawing();
  plan.write(name, { at: 0.2, duration: 0.9 });
  plan.line(under, { at: 1.0, duration: 0.5 });
  plan.write(line, { at: 0.9, duration: 0.7 });
  const urlAt = Math.max(1.2, kit.at(0) + 0.6);
  plan.line(marker, { at: urlAt, duration: 0.45 });
  plan.write(url, { at: urlAt + 0.1, duration: 0.6 });
  const byAt = Math.max(2.2, kit.at(1));
  plan.write(by, { at: byAt, duration: 0.7 });
  links.forEach((l, i) => {
    plan.line(l.m, { at: byAt + 0.6 + i * 0.35, duration: 0.35 });
    plan.write(l.el, { at: byAt + 0.65 + i * 0.35, duration: 0.4 });
  });
  plan.write(sources, { at: byAt + 1.6, duration: 0.5 });
  return (t) => plan.draw(t);
});
