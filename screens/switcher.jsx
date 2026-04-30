// Workspace / tenant switcher standalone route (shows as a dedicated page)

function SwitcherScreen({ setRoute, tenant, setTenant }) {
  const [q, setQ] = React.useState("");
  const filtered = TENANTS.filter(t => t.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="page page-fade narrow">
      <div className="page-head">
        <div className="page-title">
          <h1>Jump to a workspace</h1>
          <div className="subtitle">You have access to {TENANTS.length + 1} workspaces under {ORG.name}</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-plus" /> New workspace</button>
        </div>
      </div>
      <div className="card">
        <div className="toolbar">
          <input className="filter-input" placeholder="Filter workspaces…" value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 12 }} />
          <div className="spacer" />
          <div className="seg">
            <button className="active">Grid</button>
            <button>List</button>
          </div>
        </div>
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {filtered.map(t => {
            const active = tenant.id === t.id;
            return (
              <div key={t.id} className="card" style={{ padding: 16, cursor: "pointer", borderColor: active ? "var(--accent)" : undefined }} onClick={() => { setTenant(t); setRoute("dashboard"); }}>
                <div className="row row-12" style={{ marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: colorFor(t.color), color: "#fff", fontWeight: 700, fontSize: 13, display: "grid", placeItems: "center" }}>{t.code}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b style={{ fontSize: 13.5, display: "block" }}>{t.name}</b>
                    <span style={{ fontSize: 11.5, color: "var(--fg-subtle)" }}>{t.plan} · {t.users} users</span>
                  </div>
                  {active && <Pill kind="success">current</Pill>}
                </div>
                <div className="row row-8" style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 12 }}>
                  <span>Health <b style={{ color: t.health > 95 ? "var(--success)" : t.health > 85 ? "var(--warning)" : "var(--critical)" }}>{t.health}%</b></span>
                  <span>·</span>
                  <span>MTTR {t.mttr}m</span>
                  <span>·</span>
                  <span>{t.incidents} open</span>
                  {t.sev1 > 0 && <><span>·</span><Pill kind="critical">{t.sev1} Sev 1</Pill></>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SwitcherScreen });
