// How many lists: one square per top 10, shaded one by one. Nature in green, then the
// human-made ones in orange, with a label written beside each group.
Bezel.scene((root, kit) => {
  const { u, safe, colours, props } = kit;
  const s = kit.stage();
  const pencil = { "stroke-linecap": "round", "stroke-linejoin": "round", filter: "url(#pencil)" };
  const narrow = kit.shape !== "wide";
  const title = kit.text(root, props.title, { x: safe.x, y: safe.y, size: 6, font: "heading", maxWidth: safe.width, style: { textWrap: "balance" } });
  const base = root.getBoundingClientRect();
  const y0 = title.getBoundingClientRect().bottom - base.top + u * 6;
  const total = props.groups.reduce((n, g) => n + g.count, 0);
  const perRow = narrow ? 6 : 8;
  const size = Math.min((safe.width * (narrow ? 0.8 : 0.5)) / perRow, u * 11);
  const gap = size * 0.22;
  let k = 0;
  const squares = [];
  const labels = props.groups.map((g, gi) => {
    const c = [colours.palette[2], colours.palette[3]][gi];
    const startK = k;
    for (let j = 0; j < g.count; j++, k++) {
      const x = safe.x + (k % perRow) * (size + gap), y = y0 + Math.floor(k / perRow) * (size + gap);
      squares.push({ el: kit.svg("rect", { x, y, width: size, height: size, fill: kit.tone(s, { kind: "lines", colour: c, size: u * 0.7, weight: 0.5, angle: 45 }), opacity: 0, ...pencil }, s),
        edge: kit.svg("path", { d: kit.rough.rect(x, y, size, size, { seed: 60 + k, wobble: 0.2 }), fill: "none", stroke: c, "stroke-width": u * 0.25, opacity: 0.25, ...pencil }, s), group: gi, k });
    }
    const lastRow = Math.floor((k - 1) / perRow);
    const lx = safe.x + perRow * (size + gap) + u * 3;
    const ly = narrow ? y0 + Math.ceil(total / perRow) * (size + gap) + u * 2 + gi * u * 6 : y0 + (gi === 0 ? 0 : lastRow * (size + gap));
    return kit.text(root, g.label, { x: narrow ? safe.x : lx, y: ly, size: 4.2, colour: c, style: { fontStyle: "italic" }, maxWidth: narrow ? safe.width : safe.x + safe.width - lx });
  });
  const groupAt = props.groups.map((g, gi) => Math.max(0.9 + gi * 2.4, kit.at(gi) + 0.4));

  const plan = kit.drawing();
  plan.write(title, { at: 0.1, duration: 1 });
  labels.forEach((l, gi) => plan.write(l, { at: groupAt[gi] + 1, duration: 0.8 }));
  return (t) => {
    let seen = [0, 0];
    for (const q of squares) {
      const at = groupAt[q.group] + seen[q.group]++ * 0.08;
      q.el.setAttribute("opacity", String(kit.progress(t, at, 0.15)));
      q.edge.setAttribute("opacity", String(0.25 + 0.75 * kit.progress(t, at, 0.15)));
    }
    plan.draw(t);
  };
});
