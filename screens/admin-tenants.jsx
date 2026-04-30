// Super-admin: tenant list & health

function AdminTenantsScreen({ setRoute, setTenant }) {
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Tenants</h1>
          <div className="subtitle">Manage all workspaces under {ORG.name}</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-file-export" /> Export CSV</button>
          <button className="btn primary" onClick={() => setRoute("onboarding")}><i className="fa-solid fa-plus" /> Provision tenant</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        <div className="card"><div className="kpi"><div className="kpi-label">Total tenants</div><div className="kpi-value">{TENANTS.length}</div><div className="kpi-delta up"><i className="fa-solid fa-arrow-trend-up" />+2 this quarter</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Total seats</div><div className="kpi-value">{ORG.seatsUsed.toLocaleString()}</div><div className="kpi-delta neutral">of {ORG.seatsTotal.toLocaleString()} · {Math.round(ORG.seatsUsed / ORG.seatsTotal * 100)}%</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Healthy</div><div className="kpi-value" style={{ color: "var(--success)" }}>{TENANTS.filter(t => t.health > 95).length}</div><div className="kpi-delta up"><i className="fa-solid fa-check" />above 95%</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">At risk</div><div className="kpi-value" style={{ color: "var(--warning)" }}>{TENANTS.filter(t => t.health <= 90).length}</div><div className="kpi-delta down"><i className="fa-solid fa-triangle-exclamation" />needs attention</div></div></div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "280px 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head"><h3>Organization tree</h3></div>
          <div className="card-body">
            <div className="tree">
              <div className="tree-node active">
                <i className="fa-solid fa-caret-down t-caret" />
                <span className="t-icon" style={{ background: "linear-gradient(135deg,#0f1c3f,#2563eb)" }}>M</span>
                <span style={{ flex: 1 }}>{ORG.name}</span>
                <span className="text-faint" style={{ fontSize: 11 }}>{TENANTS.length}</span>
              </div>
              <div className="tree-children">
                {TENANTS.map(t => (
                  <div key={t.id} className="tree-node" onClick={() => { setTenant(t); setRoute("dashboard"); }}>
                    <i className="fa-solid fa-caret-right t-caret" />
                    <span className="t-icon" style={{ background: colorFor(t.color) }}>{t.code}</span>
                    <span style={{ flex: 1, fontSize: 12.5 }}>{t.name}</span>
                    {t.sev1 > 0 && <span className="dot red" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="toolbar">
            <input className="filter-input" placeholder="Search tenants…" style={{ paddingLeft: 12 }} />
            <span className="chip">+ Plan</span>
            <span className="chip">+ Region</span>
            <span className="chip">+ Status</span>
            <div className="spacer" />
            <div className="seg"><button className="active">All {TENANTS.length}</button><button>Active</button><button>At risk 2</button><button>Suspended 0</button></div>
          </div>
          <div className="card-body flush">
            <table className="table">
              <thead>
                <tr>
                  <th>Tenant</th><th>Plan</th><th>Users</th><th>Health</th><th>Incidents</th><th>Region</th><th>Created</th><th></th>
                </tr>
              </thead>
              <tbody>
                {TENANTS.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div className="row row-12">
                        <div style={{ width: 30, height: 30, borderRadius: 7, background: colorFor(t.color), color: "#fff", fontWeight: 700, fontSize: 11, display: "grid", placeItems: "center" }}>{t.code}</div>
                        <div>
                          <b style={{ fontSize: 13 }}>{t.name}</b>
                          <div style={{ fontSize: 11, color: "var(--fg-subtle)" }}>{t.id}.linkedeye.io</div>
                        </div>
                      </div>
                    </td>
                    <td><Pill kind={t.plan === "Enterprise" ? "purple" : t.plan === "Business" ? "info" : "neutral"} noDot>{t.plan}</Pill></td>
                    <td className="mono text-mute">{t.users}</td>
                    <td><div className="row row-8"><Pill kind={t.health > 95 ? "success" : t.health > 85 ? "warning" : "critical"}>{t.health}%</Pill></div></td>
                    <td>
                      <span className="mono" style={{ fontSize: 12 }}>{t.incidents}</span>
                      {t.sev1 > 0 && <Pill kind="critical" style={{ marginLeft: 6 }}>{t.sev1} Sev 1</Pill>}
                    </td>
                    <td className="text-mute" style={{ fontSize: 12 }}>us-east-1</td>
                    <td className="text-mute" style={{ fontSize: 12 }}>Mar 12, 2024</td>
                    <td><button className="icon-btn"><i className="fa-solid fa-ellipsis" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminTenantsScreen });
