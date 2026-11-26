// The four labels, one per sentence: each word written with a small pencil mark beside it
// (a solid bar, a measured bar, a dashed bar, a dashed bar with a question mark) and what it means.
Bezel.scene((root, kit) => {
  const { u, safe, colours, props } = kit;
  const s = kit.stage();
  const pencil = { "stroke-linecap": "round", "stroke-linejoin": "round", filter: "url(#pencil)" };
  const title = kit.text(root, props.title, { x: safe.x, y: safe.y, size: 5.6, font: "heading", maxWidth: safe.width, style: { textWrap: "balance" } });
  const base = root.getBoundingClientRect();
  const y0 = title.getBoundingClientRect().bottom - base.top + u * 5;
  const rowH = Math.min((safe.y + safe.height - y0 - u * 14) / props.items.length, u * 22);
  const sw = u * 16, sh = u * 4.4;
  const rows = props.items.map((item, i) => {
    const y = y0 + i * rowH;
    const dashed = item.dashed;
    const c = [colours.palette[2], colours.palette[0], colours.palette[3], colours.accent][i];
    const fill = kit.svg("rect", { x: safe.x, y, width: 0, height: sh, fill: kit.tone(s, { kind: "lines", colour: c, size: u * 0.8, weight: 0.5, angle: 45 }), opacity: dashed ? 0.4 : 1, ...pencil }, s);
    const edge = kit.svg("path", { d: kit.rough.rect(safe.x, y, sw, sh, { seed: 40 + i, wobble: 0.25 }), fill: "none", stroke: c, "stroke-width": u * 0.3, "stroke-dasharray": dashed ? u + " " + u * 0.7 : "none", ...pencil }, s);
    const word = kit.text(root, item.word, { x: safe.x + sw + u * 4, y: y - u * 1.6, size: 6, font: "heading", colour: c });
    const means = kit.text(root, item.means, { x: safe.x + sw + u * 4, y: y + u * 5.4, size: 3.8, colour: colours.muted, style: { fontStyle: "italic" }, maxWidth: safe.width - sw - u * 4 });
    return { fill, edge, word, means, at: Math.max(0.8 + i * 0.8, kit.at(i + 1) + 0.1) };
  });

  const plan = kit.drawing();
  plan.write(title, { at: 0.1, duration: 1 });
  for (const r of rows) {
    plan.line(r.edge, { at: r.at, duration: 0.45 });
    plan.write(r.word, { at: r.at + 0.2, duration: 0.45 });
    plan.write(r.means, { at: r.at + 0.6, duration: 0.7 });
  }
  return (t) => {
    rows.forEach((r) => r.fill.setAttribute("width", String(sw * kit.progress(t, r.at + 0.4, 0.5, "out"))));
    plan.draw(t);
  };
});
