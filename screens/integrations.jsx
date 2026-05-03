// Integrations — connected apps & webhook throughput (mock)

const INTEGRATION_META = {
  Slack:      { category: "Collaboration", scopes: ["Alerts", "Incident threads", "Change CAB"], lastSync: "2m ago", events24h: 1840 },
  PagerDuty:  { category: "On-call",       scopes: ["Pages", "Ack mirrors", "Schedule sync"], lastSync: "30s ago", events24h: 412 },
  Datadog:    { category: "Observability", scopes: ["Metrics", "Monitors", "RCA snippets"], lastSync: "1m ago", events24h: 9021 },
  GitHub:     { category: "DevOps",        scopes: ["Deploy hooks", "PR checks", "Secrets scan"], lastSync: "4m ago", events24h: 332 },
  Jira:       { category: "ITSM",          scopes: ["Issue sync", "Epics", "Comments"], lastSync: "6m ago", events24h: 1288 },
  AWS:        { category: "Cloud",         scopes: ["GuardDuty", "Cost", "Change audit"], lastSync: "12m ago", events24h: 441 },
  Azure:      { category: "Cloud",         scopes: ["AD sync", "Monitor alerts"], lastSync: "—", events24h: 0 },
  GCP:        { category: "Cloud",         scopes: ["Asset sync", "Logging"], lastSync: "—", events24h: 0 },
  Okta:       { category: "Identity",      scopes: ["SCIM", "SSO sessions", "Groups"], lastSync: "2m ago", events24h: 210 },
  Zoom:       { category: "Collaboration", scopes: ["War-room bridges", "Recordings"], lastSync: "1h ago", events24h: 88 },
  Terraform:  { category: "IaC",           scopes: ["Run tasks", "Drift signals"], lastSync: "18m ago", events24h: 64 },
  Salesforce: { category: "CRM",           scopes: ["Case bidirectional"], lastSync: "—", events24h: 0 },
};

const CLOUD_NAMES = new Set(["AWS", "Azure", "GCP"]);

function IntegrationsScreen() {
  const [q, setQ] = React.useState("");
  const [chip, setChip] = React.useState("all");
  const [selectedName, setSelectedName] = React.useState(INTEGRATIONS[0].name);

  const filtered = React.useMemo(() => {
    const ql = q.trim().toLowerCase();
    return INTEGRATIONS.filter((i) => {
      if (chip === "connected" && !i.connected) return false;
      if (chip === "cloud" && !CLOUD_NAMES.has(i.name)) return false;
      return !ql || i.name.toLowerCase().includes(ql);
    });
  }, [q, chip]);

  React.useEffect(() => {
    if (!filtered.some((i) => i.name === selectedName) && filtered.length) {
      setSelectedName(filtered[0].name);
    }
  }, [filtered, selectedName]);

  const connected = INTEGRATIONS.filter((i) => i.connected).length;
  const disconnected = INTEGRATIONS.length - connected;
  const eventsToday = INTEGRATIONS.reduce((sum, i) => sum + (INTEGRATION_META[i.name]?.events24h || 0), 0);

  const selected = INTEGRATIONS.find((i) => i.name === selectedName) || INTEGRATIONS[0];
  const meta = INTEGRATION_META[selected.name] || { category: "—", scopes: [], lastSync: "—", events24h: 0 };

  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Integrations</h1>
          <div className="subtitle">
            <span className="live">LIVE</span> {connected} connected · secure webhooks · scoped per business unit
          </div>
        </div>
        <div className="page-actions">
          <button type="button" className="btn"><i className="fa-solid fa-book" /> Docs</button>
          <button type="button" className="btn"><i className="fa-solid fa-key" /> API keys</button>
          <button type="button" className="btn primary"><i className="fa-solid fa-plus" /> Add integration</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        {[
          { label: "Connected", value: String(connected), sub: `${disconnected} available to connect`, icon: "fa-plug-circle-check", color: "var(--success)" },
          { label: "Events (24h)", value: eventsToday.toLocaleString(), sub: "Inbound webhooks + API pulls", icon: "fa-arrow-trend-up", color: "var(--accent)" },
          { label: "Failed deliveries", value: "3", sub: "retrying · last hour", icon: "fa-triangle-exclamation", color: "var(--warning)" },
          { label: "Secrets rotation", value: "OK", sub: "Next OAuth refresh in 41m", icon: "fa-shield-halved", color: "var(--fg-subtle)" },
        ].map((k) => (
          <div key={k.label} className="card" style={{ padding: 16 }}>
            <div className="row row-12">
              <div style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: `${k.color}18`, color: k.color }}>
                <i className={`fa-solid ${k.icon}`} />
              </div>
              <div>
                <div className="text-mute" style={{ fontSize: 11.5 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 750, letterSpacing: "-0.03em" }}>{k.value}</div>
                <div className="text-mute" style={{ fontSize: 11 }}>{k.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "1fr 380px", gap: 16, alignItems: "start" }}>
        <div className="card">
          <div className="toolbar">
            <input
              className="filter-input"
              placeholder="Search integrations…"
              style={{ paddingLeft: 12, flex: 1, minWidth: 180 }}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <span className={`chip${chip === "all" ? " active" : ""}`} onClick={() => setChip("all")} role="button">All</span>
            <span className={`chip${chip === "connected" ? " active" : ""}`} onClick={() => setChip("connected")} role="button">Connected</span>
            <span className={`chip${chip === "cloud" ? " active" : ""}`} onClick={() => setChip("cloud")} role="button">Cloud</span>
            <div className="spacer" />
          </div>
          <div className="card-body flush">
            <table className="table">
              <thead>
                <tr>
                  <th>Integration</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>24h volume</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty" style={{ padding: 28 }}>
                        <i className="fa-solid fa-plug" />
                        <h4>No integrations match</h4>
                        <p>Adjust search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((row) => {
                  const m = INTEGRATION_META[row.name] || {};
                  const active = row.name === selectedName;
                  return (
                    <tr
                      key={row.name}
                      className={active ? "selected" : undefined}
                      onClick={() => setSelectedName(row.name)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <div className="row row-10">
                          <span style={{ width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center", background: "var(--bg-muted)", color: "var(--fg)" }}>
                            <i className={row.icon} />
                          </span>
                          <b>{row.name}</b>
                        </div>
                      </td>
                      <td><span className="text-mute">{m.category || "—"}</span></td>
                      <td>
                        {row.connected ? <Pill kind="success">Connected</Pill> : <Pill kind="neutral">Not connected</Pill>}
                      </td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{(m.events24h ?? 0).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stack stack-12">
          <div className="card">
            <div className="card-head">
              <h3>{selected.name}</h3>
              {selected.connected ? <Pill kind="success">Active</Pill> : <Pill kind="neutral">Setup required</Pill>}
            </div>
            <div className="card-body">
              <div className="text-mute" style={{ fontSize: 11.5, marginBottom: 12 }}>{meta.category}</div>
              <div className="field">
                <label>Capabilities in NexEarn</label>
                <div className="stack stack-6" style={{ marginTop: 6 }}>
                  {(meta.scopes || []).map((s) => (
                    <div key={s} className="row row-8" style={{ fontSize: 12.5 }}>
                      <i className="fa-solid fa-check" style={{ color: "var(--success)", fontSize: 11 }} />
                      {s}
                    </div>
                  ))}
                  {!selected.connected && <div className="text-mute" style={{ fontSize: 12 }}>Connect to enable scopes and webhook signing.</div>}
                </div>
              </div>
              <div className="grid-2" style={{ marginTop: 12 }}>
                <div className="field"><label>Last sync</label><div style={{ fontSize: 13 }}>{meta.lastSync}</div></div>
                <div className="field"><label>Events (24h)</label><div style={{ fontSize: 13 }}>{meta.events24h?.toLocaleString() ?? "—"}</div></div>
              </div>
              <div className="row row-8" style={{ marginTop: 16 }}>
                {selected.connected ? (
                  <>
                    <button type="button" className="btn sm"><i className="fa-solid fa-rotate" /> Sync now</button>
                    <button type="button" className="btn sm"><i className="fa-solid fa-gear" /> Configure</button>
                    <button type="button" className="btn sm danger"><i className="fa-solid fa-unlink" /> Disconnect</button>
                  </>
                ) : (
                  <button type="button" className="btn primary sm"><i className="fa-solid fa-link" /> Connect {selected.name}</button>
                )}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Delivery log</h3><Pill kind="info">Sample</Pill></div>
            <div className="card-body" style={{ paddingTop: 0 }}>
              {[
                { t: "14:42", ok: true, msg: "Webhook accepted · incident.created" },
                { t: "14:38", ok: true, msg: "OAuth token refreshed" },
                { t: "14:31", ok: false, msg: "Retry 2/5 · upstream 503" },
              ].map((line, i) => (
                <div key={i} className="row row-8" style={{ padding: "8px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none", fontSize: 12 }}>
                  <span className="mono text-mute">{line.t}</span>
                  <i className={`fa-solid ${line.ok ? "fa-circle-check" : "fa-circle-xmark"}`} style={{ color: line.ok ? "var(--success)" : "var(--critical)", fontSize: 11 }} />
                  <span style={{ flex: 1 }}>{line.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { IntegrationsScreen });
