// CMDB / CI explorer

const CMDB_PLATFORM = {
  totalCis: 1056,
  lastSyncMinutes: 4,
  fleetHealthPct: 94.2,
  driftReviewQueue: 23,
  connectorsOk: 6,
};

function CMDBDashboardHeader({ classCount }) {
  const sync = CMDB_PLATFORM.lastSyncMinutes;
  const sampleHealthy = Math.round((100 * CIS.filter(c => c.health === "healthy").length) / CIS.length);
  return (
    <div className="cmdb-dash-header">
      <div className="cmdb-dash-header-top">
        <div>
          <h1 className="cmdb-dash-title">CMDB · Configuration items</h1>
          <p className="cmdb-dash-lead">
            <span className="cmdb-sync-pulse" aria-hidden />
            <span>Last full sync <b>{sync}m ago</b> · {CMDB_PLATFORM.connectorsOk} discovery connectors healthy · sample set {sampleHealthy}% healthy</span>
          </p>
        </div>
        <div className="page-actions cmdb-dash-actions">
          <button className="btn"><i className="fa-solid fa-arrows-rotate" /> Re-sync</button>
          <button className="btn"><i className="fa-solid fa-file-import" /> Import</button>
          <button className="btn primary"><i className="fa-solid fa-plus" /> New CI</button>
        </div>
      </div>
      <div className="cmdb-dash-kpis">
        {[
          { k: "Total CIs", v: CMDB_PLATFORM.totalCis.toLocaleString(), sub: "Across all tenants & regions", icon: "fa-sitemap" },
          { k: "CI classes", v: String(classCount), sub: "Discovery taxonomy · normalized", icon: "fa-layer-group" },
          { k: "Fleet health", v: `${CMDB_PLATFORM.fleetHealthPct}%`, sub: "Automated health signals", icon: "fa-heart-pulse" },
          { k: "Drift review", v: String(CMDB_PLATFORM.driftReviewQueue), sub: "Pending CMDB reconcile queue", icon: "fa-compass" },
        ].map(tile => (
          <div key={tile.k} className="cmdb-dash-kpi">
            <div className="cmdb-dash-kpi-icon"><i className={`fa-solid ${tile.icon}`} /></div>
            <div className="cmdb-dash-kpi-body">
              <div className="cmdb-dash-kpi-label">{tile.k}</div>
              <div className="cmdb-dash-kpi-value">{tile.v}</div>
              <div className="cmdb-dash-kpi-sub">{tile.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="cmdb-dash-sources">
        <span className="text-mute" style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>Ingest</span>
        {["Datadog", "AWS API", "SNMP / IPAM", "vCenter", "WMI / AD", "K8s API"].map(s => (
          <span key={s} className="cmdb-source-chip"><i className="fa-solid fa-link" style={{ fontSize: 9, opacity: 0.75 }} /> {s}</span>
        ))}
      </div>
    </div>
  );
}

function CMDBScreen() {
  const [selected, setSelected] = React.useState(CIS[0]);
  const [selectedClass, setSelectedClass] = React.useState("all");
  const classItems = [
    { id: "all", n: "All classes", c: CMDB_PLATFORM.totalCis, icon: "fa-layer-group" },
    { id: "Application", n: "Applications", c: 48, icon: "fa-window-restore" },
    { id: "Database", n: "Databases", c: 12, icon: "fa-database" },
    { id: "Data store", n: "Data stores", c: 7, icon: "fa-hard-drive" },
    { id: "Cache", n: "Caches", c: 9, icon: "fa-memory" },
    { id: "Load balancer", n: "Load balancers", c: 8, icon: "fa-scale-balanced" },
    { id: "Message queue", n: "Message queues", c: 8, icon: "fa-stream" },
    { id: "Platform", n: "Platforms", c: 4, icon: "fa-layer-group" },
    { id: "External SaaS", n: "External SaaS", c: 23, icon: "fa-cloud" },
    { id: "Firewall", n: "Firewalls", c: 14, icon: "fa-shield-halved" },
    { id: "Switch", n: "Switches", c: 32, icon: "fa-network-wired" },
    { id: "Router", n: "Routers", c: 8, icon: "fa-route" },
    { id: "Wireless AP", n: "Wireless APs", c: 24, icon: "fa-wifi" },
    { id: "Physical server", n: "Physical servers", c: 86, icon: "fa-server" },
    { id: "Windows server", n: "Windows servers", c: 42, icon: "fa-server" },
    { id: "Virtual machine", n: "Virtual machines", c: 318, icon: "fa-cubes" },
    { id: "Exporter", n: "Exporters", c: 16, icon: "fa-satellite-dish" },
    { id: "Storage array", n: "Storage arrays", c: 6, icon: "fa-box-archive" },
    { id: "Container", n: "Containers", c: 1847, icon: "fa-cube" },
  ];
  const filteredCis = selectedClass === "all" ? CIS : CIS.filter(ci => ci.cls === selectedClass);
  const activeClass = classItems.find(x => x.id === selectedClass);
  const classCount = classItems.filter(x => x.id !== "all").length;
  const selectClass = (x) => {
    setSelectedClass(x.id);
    const next = x.id === "all" ? CIS[0] : CIS.find(ci => ci.cls === x.id);
    if (next) setSelected(next);
  };
  return (
    <div className="page page-fade wide">
      <CMDBDashboardHeader classCount={classCount} />

      <CMDBHero selected={selected} setSelected={setSelected} />

      <div className="cmdb-workspace-grid">
        {/* Class tree */}
        <div className="card">
          <div className="card-head">
            <h3>Classes</h3>
            <button className="btn sm ghost" onClick={() => selectClass(classItems[0])}>Reset</button>
          </div>
          <div className="card-body" style={{ padding: 6 }}>
            <div className="tree">
              {classItems.map(x => (
                <div key={x.id} className={`tree-node${selectedClass === x.id ? " active" : ""}`} onClick={() => selectClass(x)} style={{ cursor: "pointer" }}>
                  <i className={`fa-solid ${x.icon} t-caret`} style={{ fontSize: 11 }} />
                  <span style={{ flex: 1, fontSize: 12.5 }}>{x.n}</span>
                  <span className="text-faint" style={{ fontSize: 10.5 }}>{x.c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle: list */}
        <div className="card">
          <div className="toolbar">
            <input className="filter-input" placeholder={`Filter ${activeClass?.n || "CIs"}...`} style={{ paddingLeft: 12 }} />
            <span className="chip active">{activeClass?.n || "All classes"} · {filteredCis.length} shown <i className="fa-solid fa-xmark" onClick={() => selectClass(classItems[0])} /></span>
            <div className="spacer" />
            <div className="seg"><button className="active">List</button><button>Graph</button></div>
          </div>
          <div className="card-body flush">
            <table className="table">
              <thead><tr><th>Name</th><th>Class</th><th>Env</th><th>Health</th><th>Owner</th></tr></thead>
              <tbody>
                {filteredCis.map(ci => (
                  <tr key={ci.id} className={selected.id === ci.id ? "selected" : undefined} onClick={() => setSelected(ci)}>
                    <td className="mono" style={{ fontSize: 12 }}><span className={`dot ${ci.health === "healthy" ? "green" : ci.health === "degraded" ? "amber" : "red"}`} style={{ marginRight: 6 }} />{ci.name}</td>
                    <td style={{ fontSize: 12 }}>{ci.cls}</td>
                    <td><Pill kind={ci.env === "prod" ? "warning" : "neutral"} noDot>{ci.env}</Pill></td>
                    <td><Pill kind={ci.health === "healthy" ? "success" : ci.health === "degraded" ? "warning" : "critical"}>{ci.health}</Pill></td>
                    <td>{ci.owner ? <UserById id={ci.owner} /> : <span className="text-faint">—</span>}</td>
                  </tr>
                ))}
                {filteredCis.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: 24, textAlign: "center", color: "var(--fg-subtle)", fontSize: 12 }}>No discovered records for this class in the current prototype dataset.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        <div className="stack stack-12">
          <CIDetailCard selected={selected} />
          <div className="card">
            <div className="card-head"><h3>Dependency graph</h3></div>
            <div className="card-body">
              <DepGraph center={selected.name} />
              <div className="text-mute" style={{ fontSize: 11, marginTop: 8, textAlign: "center" }}>upstream · {selected.name} · downstream</div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Recent changes</h3></div>
            <div className="card-body stack stack-6" style={{ fontSize: 12, padding: 12 }}>
              <div>🔧 <b>CHG-2219</b> · Rollback pool config · 2h ago</div>
              <div>🔧 <b>CHG-2216</b> · Feature flag v2.4 · 1d ago</div>
              <div>📋 <b>INC-48291</b> · Stripe timeouts · active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CIDetailCard({ selected }) {
  const healthKind = selected.health === "healthy" ? "success" : selected.health === "degraded" || selected.health === "warning" ? "warning" : "critical";
  const healthDot = selected.health === "healthy" ? "green" : selected.health === "degraded" || selected.health === "warning" ? "amber" : "red";
  const discovery = selected.type ? "Prometheus" : selected.vendor ? "SNMP / WMI" : "Datadog agent";
  const isHardware = !!selected.vendor || selected.cls.includes("server") || selected.cls === "Storage array" || selected.cls === "Firewall" || selected.cls === "Switch";

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{
        padding: 16,
        color: "#fff",
        backgroundImage: isHardware
          ? "linear-gradient(135deg, rgba(5,12,30,.96), rgba(15,28,63,.72)), url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80')"
          : "linear-gradient(135deg, var(--navy-800), var(--blue-600))",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="row row-8" style={{ marginBottom: 14 }}>
          <span className={`dot ${healthDot}`} />
          <Pill kind={healthKind}>{selected.health}</Pill>
          <span className="mono" style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,.68)" }}>{selected.id}</span>
        </div>
        <h3 style={{ margin: 0, fontSize: 22, lineHeight: 1.05, letterSpacing: "-.04em" }}>{selected.name}</h3>
        <div style={{ marginTop: 6, color: "rgba(255,255,255,.72)", fontSize: 12 }}>{selected.cls} · {selected.env} · {selected.region}</div>
        {selected.ip && (
          <div className="row row-8" style={{ marginTop: 14 }}>
            <span className="mono" style={{ padding: "6px 9px", borderRadius: 8, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.16)", fontSize: 11.5 }}>{selected.ip}</span>
            {selected.serial && <span className="mono" style={{ color: "rgba(255,255,255,.58)", fontSize: 11 }}>{selected.serial}</span>}
          </div>
        )}
      </div>

      <div className="card-body stack stack-12">
        <div className="grid-3" style={{ gap: 8 }}>
          {[
            ["Class", selected.cls, "fa-cube"],
            ["Environment", selected.env, "fa-leaf"],
            ["Region", selected.region, "fa-location-dot"],
          ].map(([label, value, icon]) => (
            <div key={label} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 10, background: "var(--bg-muted)" }}>
              <i className={`fa-solid ${icon}`} style={{ color: "var(--fg-subtle)", fontSize: 11 }} />
              <div className="text-mute" style={{ fontSize: 10.5, marginTop: 6 }}>{label}</div>
              <b style={{ fontSize: 12 }}>{value}</b>
            </div>
          ))}
        </div>

        {(selected.cpu || selected.ram || selected.storage || selected.capacity) && (
          <div>
            <div className="text-mute" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Capacity profile</div>
            <div className="stack stack-8">
              {selected.cpu && <HardwareMetric icon="fa-microchip" label="CPU" value={selected.cpu} pct={82} color="var(--blue-500)" />}
              {selected.ram && <HardwareMetric icon="fa-memory" label="RAM" value={selected.ram} pct={68} color="var(--purple-500)" />}
              {selected.storage && <HardwareMetric icon="fa-hard-drive" label="Storage" value={selected.storage} pct={54} color="var(--success)" />}
              {selected.capacity && <HardwareMetric icon="fa-database" label="Capacity" value={`${selected.used} / ${selected.capacity}`} pct={72} color="var(--warning)" />}
            </div>
          </div>
        )}

        <div>
          <div className="text-mute" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Identity & ownership</div>
          <div className="stack stack-8">
            {selected.vendor && <Prop label="Vendor / Model">{selected.vendor} · {selected.model}</Prop>}
            {selected.os && <Prop label="OS / Firmware">{selected.os}</Prop>}
            {selected.role && <Prop label="Role">{selected.role}</Prop>}
            {selected.host && <Prop label="Host"><span className="mono link" style={{ fontSize: 12 }}>{CIS.find(c => c.id === selected.host)?.name || selected.host}</span></Prop>}
            {selected.vcpu && <Prop label="vCPU / RAM">{selected.vcpu} vCPU · {selected.ram}</Prop>}
            {selected.type && <Prop label="Exporter type"><span className="mono" style={{ fontSize: 12 }}>{selected.type}</span> :{selected.port}</Prop>}
            {selected.targets && <Prop label="Targets">{selected.targets} endpoints</Prop>}
            <Prop label="Owner">{selected.owner ? <UserById id={selected.owner} /> : <span className="text-faint">none</span>}</Prop>
          </div>
        </div>

        <div style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 12, background: "linear-gradient(135deg, var(--bg-muted), var(--bg-raised))" }}>
          <div className="row row-8" style={{ marginBottom: 8 }}>
            <i className="fa-solid fa-shield-halved" style={{ color: "var(--accent)" }} />
            <b style={{ fontSize: 12.5 }}>Governance</b>
          </div>
          <div className="row row-6" style={{ flexWrap: "wrap", marginBottom: 10 }}>
            <span className="chip active">mission-critical</span>
            <span className="chip active">pci-scope</span>
            <span className="chip">prod-owned</span>
          </div>
          <div className="text-mute" style={{ fontSize: 11.5 }}>Last discovered 4 minutes ago via {discovery}. Drift policy is active for serial, firmware, ownership, and IP changes.</div>
        </div>
      </div>
    </div>
  );
}

function HardwareMetric({ icon, label, value, pct, color }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 10, background: "var(--bg-raised)" }}>
      <div className="row row-8" style={{ marginBottom: 8 }}>
        <i className={`fa-solid ${icon}`} style={{ color, width: 16 }} />
        <div style={{ flex: 1 }}>
          <div className="text-mute" style={{ fontSize: 10.5 }}>{label}</div>
          <b style={{ fontSize: 12 }}>{value}</b>
        </div>
        <span className="mono text-mute" style={{ fontSize: 10.5 }}>{pct}%</span>
      </div>
      <div className="bar-track"><div className="bar-fill" style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  );
}

function CMDBHero({ selected, setSelected }) {
  const degraded = CIS.filter(ci => ci.health === "degraded" || ci.health === "warning").length;
  const down = CIS.filter(ci => ci.health === "down").length;
  const onPrem = CIS.filter(ci => ci.region && (ci.region.startsWith("dc-") || ci.region.startsWith("branch-"))).length;
  const hotspots = ["CI-13", "CI-21", "CI-46"].map(id => CIS.find(ci => ci.id === id)).filter(Boolean);

  return (
    <div className="card" style={{ marginBottom: 16, overflow: "hidden", border: "1px solid rgba(36,235,175,.22)" }}>
      <div className="cmdb-hero-split" style={{
        minHeight: 250,
        background:
          "linear-gradient(90deg, rgba(5,12,30,.96), rgba(10,24,54,.84) 48%, rgba(10,24,54,.28)), url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
      }}>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20 }}>
          <div>
            <div className="row row-8" style={{ marginBottom: 12 }}>
              <span className="live">LIVE</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.68)" }}>Hybrid discovery fabric · SNMP, WMI, vCenter, Datadog, AWS</span>
            </div>
            <h2 style={{ margin: 0, maxWidth: 560, fontSize: 30, lineHeight: 1.04, letterSpacing: "-0.045em" }}>
              Production topology with real infrastructure context
            </h2>
            <p style={{ margin: "12px 0 0", maxWidth: 560, color: "rgba(255,255,255,.72)", fontSize: 13.5, lineHeight: 1.6 }}>
              Track physical racks, virtual machines, network gear, storage arrays, cloud services, and ownership from one operational model.
            </p>
          </div>

          <div className="grid-4 cmdb-hero-mini-kpis" style={{ gap: 8 }}>
            {[
              ["Platform CIs", CMDB_PLATFORM.totalCis.toLocaleString(), `${CIS.length} records in workspace sample`],
              ["On-prem assets", onPrem, "Mumbai, Chennai, BLR"],
              ["Needs attention", degraded + down, `${down} down · ${degraded} degraded`],
              ["Discovery lag", `${CMDB_PLATFORM.lastSyncMinutes}m`, `${CMDB_PLATFORM.fleetHealthPct}% fleet health`],
            ].map(([label, value, sub]) => (
              <div key={label} style={{ padding: 12, border: "1px solid rgba(255,255,255,.14)", borderRadius: 12, background: "rgba(255,255,255,.08)", backdropFilter: "blur(10px)" }}>
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.58)", textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.03em", marginTop: 3 }}>{value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.62)", marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", minHeight: 250, borderLeft: "1px solid rgba(255,255,255,.12)", background: "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.02))" }}>
          <div style={{ position: "absolute", inset: 18, border: "1px solid rgba(255,255,255,.18)", borderRadius: 16, background: "rgba(3,9,24,.35)", backdropFilter: "blur(7px)", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(36,235,175,.11) 1px, transparent 1px), linear-gradient(90deg, rgba(36,235,175,.11) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <svg viewBox="0 0 420 210" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <path d="M36 154 C94 82, 142 84, 194 132 S316 172, 382 58" fill="none" stroke="rgba(36,235,175,.72)" strokeWidth="2" strokeDasharray="6 7" />
              <path d="M62 66 C126 132, 164 52, 224 84 S324 118, 372 132" fill="none" stroke="rgba(96,165,250,.65)" strokeWidth="2" />
              {[[66,66],[196,132],[350,58],[352,132]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="5" fill={i === 1 ? "#ef4444" : "#24ebaf"} />
              ))}
            </svg>
            <div style={{ position: "absolute", left: 18, top: 16, fontSize: 11, color: "rgba(255,255,255,.62)", textTransform: "uppercase", letterSpacing: ".08em" }}>Topology overlay</div>
            <div style={{ position: "absolute", right: 18, top: 16 }}><Pill kind={selected.health === "healthy" ? "success" : selected.health === "degraded" ? "warning" : "critical"}>{selected.health}</Pill></div>
            <div style={{ position: "absolute", left: 18, bottom: 16, right: 18 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.56)" }}>Selected CI</div>
              <div className="mono" style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.04em" }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.66)", marginTop: 3 }}>{selected.cls} · {selected.region} · {selected.owner ? "owned" : "external"}</div>
            </div>
          </div>

          <div style={{ position: "absolute", right: 22, bottom: 22, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {hotspots.map(ci => (
              <button key={ci.id} className="btn sm" onClick={() => setSelected(ci)} style={{
                color: "#fff",
                background: selected.id === ci.id ? "rgba(36,235,175,.32)" : "rgba(5,12,30,.62)",
                borderColor: selected.id === ci.id ? "rgba(36,235,175,.7)" : "rgba(255,255,255,.18)",
              }}>
                <i className={`fa-solid ${ci.cls === "Firewall" ? "fa-shield-halved" : ci.cls === "Storage array" ? "fa-database" : "fa-server"}`} /> {ci.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DepGraph({ center }) {
  // Abstract radial graph
  const up = ["edge", "auth-svc"];
  const down = ["payments-primary", "stripe-api", "redis-cache"];
  return (
    <svg viewBox="0 0 300 180" style={{ width: "100%", height: 180 }}>
      {/* Center */}
      <rect x="110" y="78" width="80" height="24" rx="4" fill="var(--accent)" />
      <text x="150" y="94" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)">{center.length > 14 ? center.slice(0, 12) + "…" : center}</text>
      {/* Upstream (left) */}
      {up.map((n, i) => (
        <React.Fragment key={n}>
          <line x1="40" y1={30 + i * 50} x2="110" y2={84 + (i - 0.5) * 4} stroke="var(--border-strong)" strokeWidth="1" />
          <rect x="0" y={18 + i * 50} width="70" height="20" rx="3" fill="var(--bg-muted)" stroke="var(--border)" />
          <text x="35" y={32 + i * 50} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--fg)">{n}</text>
        </React.Fragment>
      ))}
      {/* Downstream (right) */}
      {down.map((n, i) => (
        <React.Fragment key={n}>
          <line x1="190" y1={84 + (i - 1) * 4} x2="240" y2={20 + i * 50} stroke={n === "stripe-api" || n === "payments-primary" ? "var(--critical)" : "var(--border-strong)"} strokeWidth={n === "stripe-api" || n === "payments-primary" ? 2 : 1} />
          <rect x="230" y={10 + i * 50} width="70" height="20" rx="3" fill={n === "stripe-api" || n === "payments-primary" ? "var(--critical-bg)" : "var(--bg-muted)"} stroke={n === "stripe-api" || n === "payments-primary" ? "var(--critical)" : "var(--border)"} />
          <text x="265" y={24 + i * 50} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--fg)">{n}</text>
        </React.Fragment>
      ))}
    </svg>
  );
}

Object.assign(window, { CMDBScreen });
