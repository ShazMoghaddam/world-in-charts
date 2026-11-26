// The question is written at the top, a pencil river winds across the page, and a note
// says what most lists claim.
Bezel.scene((root, kit) => {
  const { u, safe, colours, props } = kit;
  const s = kit.stage();
  const pencil = { fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", filter: "url(#pencil)" };
  const title = kit.text(root, props.title, { x: safe.x + safe.width / 2, y: safe.y + u, size: 6.6, font: "heading", align: "center", maxWidth: safe.width * 0.92, style: { textWrap: "balance" } });
  const tb = title.getBoundingClientRect(), base = root.getBoundingClientRect();
  const top = tb.bottom - base.top + u * 6;
  const h = Math.min(safe.y + safe.height - top - u * 14, safe.width * 0.5);
  // The river: a long meander from top left to bottom right, two banks a little apart.
  const x0 = safe.x + safe.width * 0.06, x1 = safe.x + safe.width * 0.94;
  const bank = (off) => {
    let d = "";
    for (let i = 0; i <= 40; i++) {
      const p = i / 40, x = x0 + (x1 - x0) * p;
      const y = top + h * (0.15 + 0.7 * p) + Math.sin(p * Math.PI * 3.2) * h * 0.16 + off;
      d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    return d;
  };
  const banks = [0, u * 2.6].map((off) => kit.svg("path", { d: bank(off), ...pencil, stroke: colours.palette[0], "stroke-width": u * 0.35 }, s));
  const water = kit.svg("path", { d: bank(u * 1.3), ...pencil, stroke: kit.tone(s, { kind: "lines", colour: colours.palette[0], size: u * 0.7, weight: 0.4, angle: 30 }), "stroke-width": u * 2.2, opacity: 0 }, s);
  const note = kit.text(root, props.note, { x: safe.x + safe.width / 2, y: top + h + u * 4, size: 3.8, align: "center", colour: colours.accent, style: { fontStyle: "italic" }, maxWidth: safe.width * 0.9 });

  const plan = kit.drawing();
  plan.write(title, { at: 0.2, duration: 1.4 });
  banks.forEach((b, i) => plan.line(b, { at: 1.4 + i * 0.25, duration: 1.4, how: "inOut" }));
  plan.write(note, { at: Math.max(3.2, kit.at(1) + 0.3), duration: 1 });
  return (t) => {
    water.style.opacity = String(0.6 * kit.progress(t, 2.6, 0.8));
    plan.draw(t);
  };
});
