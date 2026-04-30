// Studio / App Engine — low-code app builder

function StudioScreen({ setRoute }) {
  const [tab, setTab] = React.useState("apps");
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Studio · App Engine</h1>
          <div className="subtitle">12 published apps · 4 in development · Custom tables, forms, and workflows</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-code" /> Script editor</button>
          <button className="btn"><i className="fa-solid fa-database" /> Table builder</button>
          <button className="btn primary"><i className="fa-solid fa-plus" /> New app</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="toolbar">
          {["apps", "tables", "forms", "scripts", "ui-builder"].map(t => (
            <button key={t} className={`btn sm${tab === t ? " active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t.replace("-", " ")}</button>
          ))}
        </div>
      </div>

      {tab === "apps" && <StudioApps />}
      {tab === "tables" && <StudioTables />}
      {tab === "forms" && <StudioForms />}
      {tab === "scripts" && <StudioScripts />}
      {tab === "ui-builder" && <StudioUIBuilder />}
    </div>
  );
}

function StudioApps() {
  const apps = [
    { name: "Asset Tracker Pro", scope: "x_meri_asset", tables: 8, users: 142, status: "Published", icon: "fa-boxes-stacked", color: "#2563eb", ver: "2.4.1" },
    { name: "Vendor Risk Manager", scope: "x_meri_vrm", tables: 5, users: 38, status: "Published", icon: "fa-shield-halved", color: "#ef4444", ver: "1.8.0" },
    { name: "Capacity Planner", scope: "x_meri_cap", tables: 4, users: 24, status: "Published", icon: "fa-chart-line", color: "#10b981", ver: "3.1.0" },
    { name: "Compliance Tracker", scope: "x_meri_comp", tables: 12, users: 86, status: "Published", icon: "fa-scale-balanced", color: "#8b5cf6", ver: "2.0.3" },
    { name: "AI Ops Assistant", scope: "x_meri_aiops", tables: 3, users: 18, status: "In development", icon: "fa-robot", color: "#f59e0b", ver: "0.9.0" },
    { name: "Cost Allocator", scope: "x_meri_cost", tables: 6, users: 0, status: "In development", icon: "fa-coins", color: "#0891b2", ver: "0.2.0" },
  ];
  return (
    <div className="grid-3">
      {apps.map((a, i) => (
        <div key={i} className="card" style={{ padding: 20, cursor: "pointer" }}>
          <div className="row row-12" style={{ marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: a.color + "18", color: a.color, display: "grid", placeItems: "center", fontSize: 18 }}>
              <i className={`fa-solid ${a.icon}`} />
            </div>
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 14 }}>{a.name}</b>
              <div className="mono text-mute" style={{ fontSize: 11 }}>{a.scope} · v{a.ver}</div>
            </div>
            <Pill kind={a.status === "Published" ? "success" : "warning"}>{a.status}</Pill>
          </div>
          <div className="grid-3" style={{ fontSize: 12, textAlign: "center", padding: "10px 0", borderTop: "1px solid var(--border-subtle)" }}>
            <div><b>{a.tables}</b><div className="text-mute" style={{ fontSize: 10.5 }}>tables</div></div>
            <div><b>{a.users}</b><div className="text-mute" style={{ fontSize: 10.5 }}>users</div></div>
            <div><b>{Math.floor(Math.random() * 50) + 10}</b><div className="text-mute" style={{ fontSize: 10.5 }}>scripts</div></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StudioTables() {
  const tables = [
    { name: "x_meri_asset_item", label: "Asset Item", records: 4821, fields: 32, app: "Asset Tracker Pro", updated: "2h ago" },
    { name: "x_meri_asset_vendor", label: "Vendor", records: 186, fields: 18, app: "Asset Tracker Pro", updated: "1d ago" },
    { name: "x_meri_vrm_assessment", label: "Risk Assessment", records: 342, fields: 28, app: "Vendor Risk Manager", updated: "4h ago" },
    { name: "x_meri_comp_control", label: "Compliance Control", records: 1204, fields: 24, app: "Compliance Tracker", updated: "6h ago" },
    { name: "x_meri_comp_evidence", label: "Evidence", records: 8421, fields: 16, app: "Compliance Tracker", updated: "1h ago" },
    { name: "x_meri_cap_forecast", label: "Capacity Forecast", records: 96, fields: 22, app: "Capacity Planner", updated: "12h ago" },
    { name: "x_meri_aiops_pattern", label: "AI Pattern", records: 2841, fields: 14, app: "AI Ops Assistant", updated: "30m ago" },
  ];
  return (
    <div className="card">
      <div className="toolbar">
        <input className="filter-input" placeholder="Filter tables…" style={{ paddingLeft: 12 }} />
        <div className="spacer" />
        <button className="btn sm primary"><i className="fa-solid fa-plus" /> Create table</button>
      </div>
      <div className="card-body flush">
        <table className="table">
          <thead><tr><th>Table name</th><th>Label</th><th>Records</th><th>Fields</th><th>Application</th><th>Updated</th><th></th></tr></thead>
          <tbody>
            {tables.map(t => (
              <tr key={t.name}>
                <td><span className="mono" style={{ fontSize: 12 }}>{t.name}</span></td>
                <td><b style={{ fontSize: 13 }}>{t.label}</b></td>
                <td className="mono" style={{ fontSize: 12 }}>{t.records.toLocaleString()}</td>
                <td className="mono" style={{ fontSize: 12 }}>{t.fields}</td>
                <td style={{ fontSize: 12 }}>{t.app}</td>
                <td className="text-mute" style={{ fontSize: 12 }}>{t.updated}</td>
                <td><button className="icon-btn"><i className="fa-solid fa-ellipsis" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudioForms() {
  return (
    <div className="grid-2" style={{ gridTemplateColumns: "320px 1fr", gap: 16 }}>
      <div className="card">
        <div className="card-head"><h3>Form fields</h3></div>
        <div className="card-body stack stack-6" style={{ padding: 10 }}>
          {[
            { g: "Basic", items: ["String", "Integer", "Boolean", "Date/Time", "Choice"] },
            { g: "Reference", items: ["Reference", "Glide list", "Document ID"] },
            { g: "Special", items: ["Journal", "Attachment", "Conditions", "Script"] },
          ].map(s => (
            <React.Fragment key={s.g}>
              <div className="text-mute" style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", padding: "8px 6px 2px" }}>{s.g}</div>
              {s.items.map(item => (
                <div key={item} className="row row-8" style={{ padding: "6px 8px", border: "1px solid var(--border)", borderRadius: 6, cursor: "grab", fontSize: 12 }}>
                  <i className="fa-solid fa-grip-vertical" style={{ color: "var(--fg-subtle)", fontSize: 10 }} /> {item}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Form preview — Asset Item</h3><Pill kind="info">Editing</Pill></div>
        <div className="card-body stack stack-16" style={{ padding: 24 }}>
          {[
            { label: "Name", type: "text", val: "SRV-ESX-DC1-01", req: true },
            { label: "Class", type: "select", val: "Physical server", req: true },
            { label: "Serial number", type: "text", val: "DELL-R760-001" },
            { label: "IP address", type: "text", val: "10.1.10.1" },
            { label: "Location", type: "ref", val: "DC Mumbai — Rack A14" },
            { label: "Assigned to", type: "ref", val: "Marcus Okafor" },
            { label: "Status", type: "select", val: "In service", req: true },
            { label: "Description", type: "textarea", val: "Dell PowerEdge R760 — production ESXi host" },
          ].map((f, i) => (
            <div key={i} className="field">
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {f.label} {f.req && <span style={{ color: "var(--critical)", fontSize: 11 }}>*</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea className="input" rows={3} defaultValue={f.val} />
              ) : f.type === "select" ? (
                <select className="input" defaultValue={f.val}><option>{f.val}</option></select>
              ) : (
                <input className="input" defaultValue={f.val} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudioScripts() {
  const scripts = [
    { name: "onBeforeInsert_assetItem", type: "Business rule", table: "x_meri_asset_item", active: true, desc: "Auto-populate vendor fields on insert" },
    { name: "validateRiskScore", type: "Script include", table: "x_meri_vrm_assessment", active: true, desc: "Calculate composite risk score from sub-assessments" },
    { name: "complianceScheduledJob", type: "Scheduled job", table: "x_meri_comp_control", active: true, desc: "Nightly compliance scan across all controls" },
    { name: "capacityAlertRule", type: "Business rule", table: "x_meri_cap_forecast", active: false, desc: "Alert when forecast exceeds 85% threshold" },
    { name: "aiPatternMatcher", type: "Script include", table: "x_meri_aiops_pattern", active: true, desc: "ML-based incident pattern correlation" },
  ];
  return (
    <div className="card">
      <div className="card-body flush">
        <table className="table">
          <thead><tr><th>Script name</th><th>Type</th><th>Table</th><th>Active</th><th>Description</th></tr></thead>
          <tbody>
            {scripts.map((s, i) => (
              <tr key={i}>
                <td><span className="mono" style={{ fontSize: 12 }}>{s.name}</span></td>
                <td><Pill kind={s.type === "Business rule" ? "info" : s.type === "Script include" ? "purple" : "warning"} noDot>{s.type}</Pill></td>
                <td className="mono text-mute" style={{ fontSize: 11 }}>{s.table}</td>
                <td>{s.active ? <Pill kind="success">Active</Pill> : <Pill kind="neutral">Inactive</Pill>}</td>
                <td style={{ fontSize: 12 }}>{s.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudioUIBuilder() {
  return (
    <div className="grid-2" style={{ gridTemplateColumns: "240px 1fr", gap: 16 }}>
      <div className="card">
        <div className="card-head"><h3>Components</h3></div>
        <div className="card-body stack stack-6" style={{ padding: 10 }}>
          {[
            { g: "Layout", items: [["fa-columns", "2-column"], ["fa-table-cells", "Grid"], ["fa-bars", "Tabs"]] },
            { g: "Data", items: [["fa-table", "Data table"], ["fa-chart-bar", "Chart"], ["fa-gauge-high", "KPI card"], ["fa-list", "List"]] },
            { g: "Input", items: [["fa-font", "Text field"], ["fa-square-check", "Checkbox"], ["fa-calendar", "Date picker"], ["fa-upload", "File upload"]] },
            { g: "Action", items: [["fa-square", "Button"], ["fa-link", "Link"], ["fa-bell", "Notification"]] },
          ].map(s => (
            <React.Fragment key={s.g}>
              <div className="text-mute" style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", padding: "8px 6px 2px" }}>{s.g}</div>
              {s.items.map(([ic, l]) => (
                <div key={l} className="row row-8" style={{ padding: "6px 8px", border: "1px solid var(--border)", borderRadius: 6, cursor: "grab", fontSize: 12 }}>
                  <i className={`fa-solid ${ic}`} style={{ width: 16, color: "var(--fg-muted)" }} /> {l}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="toolbar">
          <span style={{ fontSize: 12, fontWeight: 600 }}>Asset Dashboard</span>
          <div className="spacer" />
          <div className="seg"><button className="active">Desktop</button><button>Tablet</button><button>Mobile</button></div>
          <button className="btn sm"><i className="fa-solid fa-eye" /> Preview</button>
        </div>
        <div className="card-body" style={{ padding: 20, background: "repeating-linear-gradient(0deg, var(--bg-raised) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, var(--bg-raised) 0 1px, transparent 1px 24px), var(--bg)", minHeight: 500 }}>
          <div style={{ border: "2px dashed var(--accent)", borderRadius: 8, padding: 16, marginBottom: 16, opacity: 0.9 }}>
            <div className="grid-4" style={{ gap: 12 }}>
              {["Total assets", "Critical", "Expiring", "Unmanaged"].map((l, i) => (
                <div key={i} style={{ background: "var(--bg-raised)", borderRadius: 8, padding: 14, border: "1px solid var(--border)" }}>
                  <div className="text-mute" style={{ fontSize: 10.5, marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{[4821, 12, 38, 94][i]}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ border: "2px dashed var(--border-strong)", borderRadius: 8, padding: 16, minHeight: 200 }}>
            <div className="text-mute" style={{ fontSize: 11, marginBottom: 8, fontWeight: 600 }}>DATA TABLE COMPONENT</div>
            <div style={{ background: "var(--bg-raised)", borderRadius: 6, padding: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12, color: "var(--fg-subtle)" }}>Drag columns, filters, and actions here to configure the data table.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StudioScreen });
