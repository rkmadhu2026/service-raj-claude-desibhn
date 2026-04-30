// Cross-tenant view — MSP-style rollup across all business units

function CrossTenantScreen({ setRoute, setTenant, openIncidentDetail }) {
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Cross-tenant operations</h1>
          <div className="subtitle"><span className="live">LIVE</span> {TENANTS.length} business units · {ORG.name}</div>
        </div>
        <div className="page-actions">
          <div className="seg"><button>1h</button><button className="active">24h</button><button>7d</button></div>
          <button className="btn"><i className="fa-solid fa-download" /> Executive report</button>
          <button className="btn primary"><i className="fa-solid fa-plus" /> New business unit</button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <KPI label="Org health" value="92" unit="%" delta="2 BUs degraded" deltaKind="down" sparkData={spark(21, -0.2)} sparkColor="var(--warning)" icon="fa-heartbeat" />
        <KPI label="Active Sev 1" value={TENANTS.reduce((s, t) => s + t.sev1, 0)} delta="across 3 BUs" deltaKind="down" sparkData={spark(22, 0.3)} sparkColor="var(--critical)" icon="fa-fire" />
        <KPI label="Open incidents" value={TENANTS.reduce((s, t) => s + t.incidents, 0)} delta="12 since yesterday" deltaKind="up" sparkData={spark(23, 0.1)} sparkColor="var(--accent)" icon="fa-triangle-exclamation" />
        <KPI label="Org MTTR (p50)" value="24" unit="min" delta="18% faster" deltaKind="up" sparkData={spark(24, -0.4)} sparkColor="var(--success)" icon="fa-stopwatch" />
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <h3><i className="fa-solid fa-building" /> Business units</h3>
          <div className="row row-8">
            <span className="meta">Sort by</span>
            <div className="seg"><button className="active">Priority</button><button>Name</button><button>Health</button><button>Incidents</button></div>
          </div>
        </div>
        <div className="card-body flush">
          <table className="table">
            <thead>
              <tr>
                <th>Business unit</th>
                <th>Health</th>
                <th>Active incidents</th>
                <th>Sev 1</th>
                <th>MTTR p50</th>
                <th>Users</th>
                <th>Plan</th>
                <th>Spend / mo</th>
                <th>Trend (7d)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {TENANTS.map(t => (
                <tr key={t.id} onClick={() => { setTenant(t); setRoute("dashboard"); }}>
                  <td>
                    <div className="row row-12">
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: colorFor(t.color), color: "#fff", fontWeight: 700, fontSize: 11, display: "grid", placeItems: "center" }}>{t.code}</div>
                      <div><b style={{ fontSize: 13 }}>{t.name}</b><div style={{ fontSize: 11, color: "var(--fg-subtle)" }}>{t.id}</div></div>
                    </div>
                  </td>
                  <td>
                    <div className="row row-8">
                      <div style={{ width: 48, height: 6, background: "var(--bg-muted)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${t.health}%`, height: "100%", background: t.health > 95 ? "var(--success)" : t.health > 85 ? "var(--warning)" : "var(--critical)" }} />
                      </div>
                      <b className="mono" style={{ fontSize: 12, color: t.health > 95 ? "var(--success)" : t.health > 85 ? "var(--warning)" : "var(--critical)" }}>{t.health}%</b>
                    </div>
                  </td>
                  <td><b className="mono" style={{ fontSize: 13 }}>{t.incidents}</b></td>
                  <td>{t.sev1 > 0 ? <Pill kind="critical">{t.sev1}</Pill> : <span className="text-faint">—</span>}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{t.mttr}m</td>
                  <td className="mono text-mute" style={{ fontSize: 12 }}>{t.users.toLocaleString()}</td>
                  <td><Pill kind="neutral" noDot>{t.plan}</Pill></td>
                  <td className="mono text-mute" style={{ fontSize: 12 }}>${(t.spend / 1000).toFixed(1)}k</td>
                  <td style={{ width: 80 }}><Sparkline data={spark(t.code.length, t.health > 90 ? -0.2 : 0.4)} color={t.health > 90 ? "var(--success)" : "var(--warning)"} w={70} h={22} /></td>
                  <td><button className="icon-btn"><i className="fa-solid fa-arrow-right" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3><i className="fa-solid fa-fire" /> Active Sev 1 & 2 across org</h3><span className="meta">realtime</span></div>
          <div className="card-body stack stack-12" style={{ padding: 12 }}>
            {INCIDENTS.filter(i => (i.sev === 1 || i.sev === 2) && i.status === "active").map(inc => {
              const t = TENANTS.find(x => x.id === inc.tenant);
              return (
                <div key={inc.id} className="row row-12" style={{ padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer" }} onClick={() => (openIncidentDetail ? openIncidentDetail(inc.id) : setRoute("incident-detail"))}>
                  <Sev n={inc.sev} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b style={{ fontSize: 12.5, display: "block" }}>{inc.title}</b>
                    <div style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 2 }}>
                      <span className="c-id">{inc.id}</span> · <span style={{ color: "var(--fg)", fontWeight: 550 }}>{t.name}</span> · {inc.client} · {inc.age}
                    </div>
                  </div>
                  <SLAIndicator pct={inc.sla} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3><i className="fa-solid fa-chart-column" /> Incident volume by tenant · 7d</h3></div>
          <div className="card-body stack stack-8">
            {TENANTS.map(t => (
              <div key={t.id} className="bar-row">
                <span className="bar-label" style={{ width: 160 }}>{t.name}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(t.incidents / 35) * 100}%`, background: colorFor(t.color) }} /></div>
                <span className="bar-val">{t.incidents}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, padding: 10, background: "var(--bg-muted)", borderRadius: 6, fontSize: 12, color: "var(--fg-muted)" }}>
              <b>Meridian Retail</b> has 31 open incidents — 2.3× its 4-week baseline. <span className="link">Investigate →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CrossTenantScreen });
