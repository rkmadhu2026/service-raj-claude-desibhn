// Incidents list

function IncidentsScreen({ tenant, setRoute, openIncidentDetail }) {
  const [tab, setTab] = React.useState("active");
  const filtered = INCIDENTS.filter(i => {
    if (tab === "active") return i.status === "active" || i.status === "mitigating";
    if (tab === "mine") return i.assignee === "u1";
    return true;
  });
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Incidents</h1>
          <div className="subtitle"><span className="live">LIVE</span> {filtered.length} matching · auto-refresh 5s</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-download" /> Export</button>
          <button className="btn"><i className="fa-solid fa-filter" /> Saved views</button>
          <button className="btn primary"><i className="fa-solid fa-triangle-exclamation" /> Declare <kbd>D</kbd></button>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 12 }}>
        <div className={`tab${tab === "active" ? " active" : ""}`} onClick={() => setTab("active")}>Active <span className="count">{INCIDENTS.filter(i => i.status === "active" || i.status === "mitigating").length}</span></div>
        <div className={`tab${tab === "mine" ? " active" : ""}`} onClick={() => setTab("mine")}>Mine <span className="count">2</span></div>
        <div className={`tab${tab === "all" ? " active" : ""}`} onClick={() => setTab("all")}>All 30 days <span className="count">{INCIDENTS.length}</span></div>
        <div className="tab">Postmortem due <span className="count">3</span></div>
        <div className="spacer" />
      </div>

      <div className="card">
        <div className="toolbar">
          <span className="chip active">Severity: 1, 2, 3 <i className="fa-solid fa-xmark" /></span>
          <span className="chip active">Tenant: {tenant.name} <i className="fa-solid fa-xmark" /></span>
          <span className="chip">+ Service</span>
          <span className="chip">+ Assignee</span>
          <span className="chip">+ Status</span>
          <div className="spacer" />
          <div className="row row-8">
            <span style={{ fontSize: 11.5, color: "var(--fg-subtle)" }}>Group by</span>
            <div className="seg"><button className="active">None</button><button>Service</button><button>Tenant</button><button>Assignee</button></div>
          </div>
          <button className="btn sm ghost"><i className="fa-solid fa-columns" /> Columns</button>
        </div>
        <div className="card-body flush">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 36 }}><input type="checkbox" className="checkbox" /></th>
                <th style={{ width: 56 }}>Sev</th>
                <th>Incident</th>
                <th>Client</th>
                <th>Application</th>
                <th>Affected asset</th>
                <th>Tenant</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Age</th>
                <th>SLA</th>
                <th>SLO burn</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inc => {
                const t = TENANTS.find(x => x.id === inc.tenant);
                return (
                  <tr key={inc.id} className="inc-row" onClick={() => (openIncidentDetail ? openIncidentDetail(inc.id) : setRoute("incident-detail"))}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" className="checkbox" /></td>
                    <td><Sev n={inc.sev} /></td>
                    <td className="inc-title-cell">
                      <b>{inc.title}</b>
                      <div className="inc-meta">
                        <span className="c-id">{inc.id}</span>
                        <span className="ci-chip">{inc.service}</span>
                        <span><i className="fa-regular fa-user" /> {inc.impacted}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, maxWidth: 200 }}><span style={{ color: "var(--fg-muted)", lineHeight: 1.35, display: "block" }}>{inc.client}</span></td>
                    <td style={{ fontSize: 12.5, fontWeight: 550 }}>{inc.application}</td>
                    <td style={{ fontSize: 11.5, maxWidth: 180 }}>
                      {inc.asset ? (
                        <div>
                          <div className="mono" style={{ fontWeight: 600, color: "var(--fg)" }}>{inc.asset.name}</div>
                          <div className="text-mute" style={{ fontSize: 10.5, marginTop: 2 }}>{inc.asset.type}{inc.asset.role ? ` · ${inc.asset.role}` : ""}</div>
                        </div>
                      ) : (
                        <span className="text-mute">—</span>
                      )}
                    </td>
                    <td><div className="row row-8"><div style={{ width: 18, height: 18, borderRadius: 4, background: colorFor(t.color), color: "#fff", fontSize: 9, fontWeight: 700, display: "grid", placeItems: "center" }}>{t.code}</div><span style={{ fontSize: 12 }}>{t.name}</span></div></td>
                    <td><UserById id={inc.assignee} /></td>
                    <td>
                      <Pill kind={inc.status === "active" ? "critical" : inc.status === "mitigating" ? "warning" : inc.status === "investigating" ? "info" : "neutral"}>{inc.status}</Pill>
                    </td>
                    <td className="mono text-mute" style={{ fontSize: 12 }}>{inc.age}</td>
                    <td><SLAIndicator pct={inc.sla} /></td>
                    <td className="mono" style={{ fontSize: 12, color: inc.sloBurn > 5 ? "var(--critical)" : inc.sloBurn > 2 ? "var(--warning)" : "var(--fg-muted)" }}>{inc.sloBurn}x</td>
                    <td onClick={e => e.stopPropagation()}><button className="icon-btn"><i className="fa-solid fa-ellipsis" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { IncidentsScreen });
