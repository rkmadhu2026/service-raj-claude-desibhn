// primitives.jsx — shared small components (avatars, sparklines, pills, gauges)

const Avatar = ({ name, color = "slate", size }) => {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("");
  return <div className={`avatar ${color}${size ? " " + size : ""}`}>{initials}</div>;
};

const UserById = ({ id, showName = true, size = "sm" }) => {
  const u = USERS.find(x => x.id === id);
  if (!u) return <span className="text-mute" style={{ fontStyle: "italic" }}>Unassigned</span>;
  return (
    <div className="row row-8">
      <Avatar name={u.name} color={u.color} size={size} />
      {showName && (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 550, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
          <div style={{ fontSize: 11, color: "var(--fg-subtle)" }}>{u.team}</div>
        </div>
      )}
    </div>
  );
};

const Sparkline = ({ data, color = "var(--accent)", w = 80, h = 30, area = true }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - 2 - ((v - min) / range) * (h - 4);
    return [x, y];
  });
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const areaD = `${d} L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} className="mini-chart" style={{ color, display: "block" }}>
      {area && <path className="spark-area" d={areaD} />}
      <path className="spark-line" d={d} />
    </svg>
  );
};

const Pill = ({ kind = "neutral", children, noDot }) => (
  <span className={`pill ${kind}${noDot ? " no-dot" : ""}`}>{children}</span>
);

const Sev = ({ n }) => (
  <span className={`sev sev-${n}`}>SEV {n}</span>
);

const SLAIndicator = ({ pct, label }) => {
  const kind = pct < 0.4 ? "bad" : pct < 0.7 ? "warn" : "good";
  return (
    <div className="sla">
      <div className="sla-bar"><div className={`sla-fill ${kind}`} style={{ width: `${pct * 100}%` }} /></div>
      <span className="sla-text">{label || `${Math.round(pct * 100)}%`}</span>
    </div>
  );
};

const Gauge = ({ value, size = 100, stroke = 10, color = "var(--accent)" }) => {
  const r = (size - stroke) / 2;
  const c = Math.PI * r; // half circle
  const offset = c * (1 - value / 100);
  const cx = size / 2;
  const cy = size / 2 + r / 2;
  return (
    <svg width={size} height={size / 2 + stroke} style={{ overflow: "visible" }}>
      <path className="arc-bg" d={`M ${stroke/2} ${cy} A ${r} ${r} 0 0 1 ${size - stroke/2} ${cy}`} strokeWidth={stroke} />
      <path className="arc-fg" d={`M ${stroke/2} ${cy} A ${r} ${r} 0 0 1 ${size - stroke/2} ${cy}`}
        strokeWidth={stroke} stroke={color}
        strokeDasharray={c} strokeDashoffset={offset} />
    </svg>
  );
};

const AreaChart = ({ data, color = "var(--accent)", w = 560, h = 140 }) => {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - 8 - (v / max) * (h - 16);
    return [x, y];
  });
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const areaD = `${d} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h, color, display: "block" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="ag" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#ag)" />
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

const BarChart = ({ data, color = "var(--accent)", h = 140 }) => {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: h, padding: "0 2px" }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, background: color, borderRadius: "3px 3px 0 0", opacity: 0.2 + (v / max) * 0.8, minHeight: 2 }} />
      ))}
    </div>
  );
};

const Heatmap = ({ rows = 7, cols = 24, seed = 1 }) => {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = (Math.sin(seed + r * 1.7 + c * 0.5) + 1) / 2;
      const intensity = v * v;
      cells.push(
        <div key={`${r}-${c}`} style={{
          aspectRatio: 1,
          borderRadius: 2,
          background: intensity > 0.1 ? `rgba(37, 99, 235, ${0.08 + intensity * 0.8})` : "var(--bg-muted)"
        }} />
      );
    }
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 2 }}>
      {cells}
    </div>
  );
};

const KPI = ({ label, value, unit, delta, deltaKind = "up", sparkData, sparkColor = "var(--accent)", icon, showSpark = true }) => (
  <div className="kpi">
    <div className="kpi-label">{icon && <i className={`fa-solid ${icon}`} style={{ fontSize: 11 }} />} {label}</div>
    <div className="kpi-value">{value}{unit && <span className="unit">{unit}</span>}</div>
    {delta != null && (
      <div className={`kpi-delta ${deltaKind}`}>
        <i className={`fa-solid ${deltaKind === "up" ? "fa-arrow-trend-up" : deltaKind === "down" ? "fa-arrow-trend-down" : "fa-minus"}`} />
        {delta}
      </div>
    )}
    {showSpark && sparkData && <div className="kpi-spark"><Sparkline data={sparkData} color={sparkColor} w={80} h={30} /></div>}
  </div>
);

Object.assign(window, { Avatar, UserById, Sparkline, Pill, Sev, SLAIndicator, Gauge, AreaChart, BarChart, Heatmap, KPI });
