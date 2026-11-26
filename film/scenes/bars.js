// A few pencil bars, each with its figure written at its end. Solid outlines and full
// hatching for figures that are verified or measured; dashed outlines and faint hatching
// for disputed or estimated ones. Where only part has been counted (counted < value),
// that part is hatched solid. Each bar arrives on its own sentence; the note comes last.
Bezel.scene((root, kit) => {
  const { u, safe, colours, props } = kit;
  const s = kit.stage();
  const pencil = { "stroke-linecap": "round", "stroke-linejoin": "round", filter: "url(#pencil)" };
  const narrow = kit.shape !== "wide";
  const title = kit.text(root, props.title, { x: safe.x, y: safe.y, size: 5.6, font: "heading", maxWidth: safe.width, style: { textWrap: "balance" } });
  const base = root.getBoundingClientRect();
  const y0 = title.getBoundingClientRect().bottom - base.top + u * 5;
  // In narrow frames each name sits above its bar; in wide frames, to its left.
  const labelW = narrow ? 0 : Math.min(safe.width * 0.26, u * 40);
  const x0 = safe.x + labelW, x1 = safe.x + safe.width - u * 27;
  // Leave room under the bars for the note and the source.
  const room = safe.y + safe.height - y0 - u * 26;
  const rowH = Math.min(room / props.bars.length, u * (narrow ? 22 : 14));
  const max = Math.max(...props.bars.map((b) => b.value));
  const sure = (b) => b.confidence === "verified" || b.confidence === "measured";
  const colourOf = (i) => [colours.palette[0], colours.palette[5], colours.palette[2], colours.palette[3]][i % 4];
  const axis = kit.svg("path", { d: kit.rough.line(x0, y0 - u, x0, y0 + rowH * props.bars.length, { seed: 1, wobble: 0.3 }), fill: "none", stroke: colours.text, "stroke-width": u * 0.3, ...pencil }, s);

  const bars = props.bars.map((b, i) => {
    const c = colourOf(i);
    const y = y0 + i * rowH + (narrow ? rowH * 0.38 : rowH * 0.2), h = rowH * (narrow ? 0.44 : 0.6);
    const w = ((x1 - x0) * b.value) / max;
    const solidW = ((x1 - x0) * (b.counted ?? (sure(b) ? b.value : 0))) / max;
    const faint = kit.svg("rect", { x: x0, y, width: 0, height: h, fill: kit.tone(s, { kind: "lines", colour: c, size: u * 1, weight: 0.4, angle: 45 }), opacity: 0.35, ...pencil }, s);
    const solid = kit.svg("rect", { x: x0, y, width: 0, height: h, fill: kit.tone(s, { kind: "lines", colour: c, size: u * 0.8, weight: 0.55, angle: 45 }), ...pencil }, s);
    const edge = kit.svg("path", { d: kit.rough.rect(x0, y, w, h, { seed: 20 + i, wobble: 0.25 }), fill: "none", stroke: c, "stroke-width": u * 0.32,
      "stroke-dasharray": sure(b) ? "none" : u * 1.1 + " " + u * 0.8, ...pencil }, s);
    // The name, and where it is, set together so they arrive as one.
    const label = narrow
      ? kit.text(root, "", { x: x0 + u * 1.5, y: y - u * 5.2, size: 3.8, weight: 600, maxWidth: safe.width - u * 2 })
      : kit.text(root, "", { x: x0 - u * 2.5, y: y + h / 2 - u * 3, size: 3.8, align: "right", maxWidth: labelW - u * 3 });
    label.innerHTML = "";
    label.append(b.name);
    if (b.where) {
      const where = document.createElement("span");
      where.textContent = (narrow ? "  ·  " : "\n") + b.where;
      Object.assign(where.style, { fontWeight: "400", fontStyle: "italic", color: colours.muted, fontSize: "0.82em", whiteSpace: narrow ? "normal" : "pre-line" });
      label.append(where);
    }
    const num = kit.text(root, b.shown, { x: x0 + w + u * 2, y: y + h / 2 - u * 3.2, size: 4.6, font: "heading", colour: c, fit: false });
    const tag = kit.text(root, b.confidence, { x: x0 + w + u * 2, y: y + h / 2 + u * 1.6, size: 2.8, font: "mono", colour: sure(b) ? colours.muted : colours.accent, fit: false });
    // A bar can name its own sentence (line) and a delay after it (after), to share a sentence.
    return { b, faint, solid, edge, label, num, tag, w, solidW, at: Math.max(0.9 + i * 0.7, kit.at(b.line ?? props.from + i) + (b.after ?? 0) + 0.2) };
  });
  const last = bars[props.noteOn ?? 0];
  const note = kit.text(root, props.note, { x: safe.x, y: y0 + rowH * props.bars.length + u * 3, size: 3.6, colour: colours.accent, style: { fontStyle: "italic" }, maxWidth: safe.width });
  // The source sits under the note, clear of the captions at the foot of the frame.
  const source = kit.text(root, props.source, { x: safe.x, y: note.getBoundingClientRect().bottom - base.top + u * 3, size: 2.6, font: "mono", colour: colours.muted, maxWidth: safe.width });

  const plan = kit.drawing();
  plan.write(title, { at: 0.1, duration: 0.9 });
  plan.line(axis, { at: 0.5, duration: 0.4 });
  for (const it of bars) {
    plan.write(it.label, { at: it.at, duration: 0.4 });
    plan.line(it.edge, { at: it.at + 0.2, duration: 0.6 });
    plan.write(it.num, { at: it.at + 0.7, duration: 0.35 });
    plan.write(it.tag, { at: it.at + 1.0, duration: 0.3 });
  }
  plan.write(note, { at: Math.max(bars[bars.length - 1].at + 1.4, kit.at(props.noteAt ?? 0)), duration: 1 });
  plan.write(source, { at: Math.max(bars[bars.length - 1].at + 2.4, kit.at(props.noteAt ?? 0) + 1), duration: 0.5 });
  void last;

  return (t) => {
    for (const it of bars) {
      const k = kit.progress(t, it.at + 0.45, 0.6, "out");
      it.faint.setAttribute("width", String(it.w * k));
      it.solid.setAttribute("width", String(it.solidW * k));
    }
    plan.draw(t);
  };
});
