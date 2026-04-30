// Reports & analytics + SLA definitions

function ReportsScreen() {
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Reports & analytics</h1>
          <div className="subtitle">18 saved reports · 4 scheduled · last refresh 2m ago</div>
        </div>
        <div className="page-actions">
          <div className="seg"><button>Week</button><button className="active">Month</button><button>Quarter</button><button>YTD</button></div>
          <button className="btn"><i className="fa-solid fa-download" /> Export</button>
          <button className="btn primary"><i className="fa-solid fa-plus" /> New report</button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <KPI label="MTTR (p50)" value="24" unit="min" delta="18% faster MoM" deltaKind="up" sparkData={spark(60, -0.4)} sparkColor="var(--success)" showSpark={true} icon="fa-clock" />
        <KPI label="MTTD (p50)" value="2.4" unit="min" delta="AI correlation" deltaKind="up" sparkData={spark(61, -0.3)} sparkColor="var(--accent)" showSpark={true} icon="fa-bullseye" />
        <KPI label="Change success" value="96.4" unit="%" delta="+2.1% MoM" deltaKind="up" sparkData={spark(62, 0.1)} sparkColor="var(--success)" showSpark={true} icon="fa-check-double" />
        <KPI label="Alert fatigue" value="12" unit="/responder" delta="38% reduction" deltaKind="up" sparkData={spark(63, -0.6)} sparkColor="var(--success)" showSpark={true} icon="fa-bell-slash" />
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-head"><h3><i className="fa-solid fa-chart-area" /> Incidents by severity · 30d</h3></div>
          <div className="card-body"><AreaChart data={spark(70, 0.3).concat(spark(71, -0.2))} h={180} /></div>
        </div>
        <div className="card">
          <div className="card-head"><h3><i className="fa-solid fa-clock" /> MTTR by service</h3></div>
          <div className="card-body stack stack-8">
            {SERVICES.slice(0, 6).map((s, i) => (
              <div key={s.name} className="bar-row">
                <span className="bar-label" style={{ width: 140 }}>{s.name}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${20 + i * 12}%`, background: i < 2 ? "var(--critical)" : i < 4 ? "var(--warning)" : "var(--success)" }} /></div>
                <span className="bar-val mono">{[42, 38, 28, 22, 18, 12][i]}m</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><h3><i className="fa-solid fa-table" /> Top problems by linked incidents</h3></div>
        <div className="card-body flush">
          <table className="table">
            <thead><tr><th>Problem</th><th>Linked incidents</th><th>Total time lost</th><th>Revenue impact</th><th>Status</th></tr></thead>
            <tbody>
              {PROBLEMS.slice(0, 5).map(p => (
                <tr key={p.id}>
                  <td><b style={{ fontSize: 12.5 }}>{p.title}</b><div style={{ fontSize: 11, color: "var(--fg-subtle)" }}><span className="c-id">{p.id}</span></div></td>
                  <td className="mono"><b>{p.linked}</b></td>
                  <td className="mono">{[18.2, 24.6, 8.1, 12.4, 6.8][PROBLEMS.indexOf(p)]}h</td>
                  <td className="mono">${[112, 82, 18, 34, 9][PROBLEMS.indexOf(p)]}k</td>
                  <td><Pill kind={p.status === "Resolved" ? "success" : p.status === "Known error" ? "info" : "warning"}>{p.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="card-head"><h3><i className="fa-solid fa-chart-pie" /> Incident causes</h3></div>
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <DonutChart slices={[{ pct: 34, color: "var(--critical)" }, { pct: 28, color: "var(--warning)" }, { pct: 18, color: "var(--accent)" }, { pct: 12, color: "var(--purple-500)" }, { pct: 8, color: "var(--success)" }]} />
              <div className="stack stack-6" style={{ fontSize: 11.5, flex: 1 }}>
                {[["Config error", 34, "var(--critical)"], ["Deploy", 28, "var(--warning)"], ["Capacity", 18, "var(--accent)"], ["External", 12, "var(--purple-500)"], ["Other", 8, "var(--success)"]].map(([l, p, c]) => (
                  <div key={l} className="row row-8"><span className="dot" style={{ background: c }} /><span style={{ flex: 1 }}>{l}</span><b>{p}%</b></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3><i className="fa-solid fa-user-group" /> Responder load</h3></div>
          <div className="card-body stack stack-8">
            {USERS.slice(0, 5).map((u, i) => (
              <div key={u.id} className="row row-8" style={{ fontSize: 12 }}>
                <Avatar name={u.name} color={u.color} />
                <span style={{ flex: 1 }}>{u.name.split(" ")[0]}</span>
                <div style={{ width: 80, height: 5, background: "var(--bg-muted)", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${[72, 48, 62, 34, 22][i]}%`, height: "100%", background: i === 0 ? "var(--warning)" : "var(--accent)" }} /></div>
                <span className="mono text-mute" style={{ fontSize: 11, width: 40, textAlign: "right" }}>{[18, 12, 15, 8, 5][i]} pages</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3><i className="fa-solid fa-calendar" /> Scheduled reports</h3></div>
          <div className="card-body stack stack-8">
            {[
              { n: "Weekly ops digest", when: "Mon 09:00", who: "exec@" },
              { n: "Monthly SLO review", when: "1st of mo", who: "sre-leads@" },
              { n: "CAB pre-read", when: "Thu 16:00", who: "cab@" },
              { n: "Quarterly business review", when: "Quarterly", who: "leadership@" },
            ].map((r, i) => (
              <div key={i} className="row row-8" style={{ padding: "6px 8px", border: "1px solid var(--border)", borderRadius: 6 }}>
                <i className="fa-solid fa-envelope" style={{ color: "var(--fg-muted)" }} />
                <div style={{ flex: 1 }}><b style={{ fontSize: 12 }}>{r.n}</b><div style={{ fontSize: 10.5, color: "var(--fg-subtle)" }}>{r.when} · {r.who}</div></div>
                <i className="fa-solid fa-chevron-right" style={{ color: "var(--fg-subtle)", fontSize: 10 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DonutChart({ slices }) {
  let acc = 0; const r = 40, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" style={{ width: 110, height: 110 }}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bg-muted)" strokeWidth="14" />
      {slices.map((s, i) => {
        const len = (s.pct / 100) * c;
        const off = -acc;
        acc += len;
        return <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={s.color} strokeWidth="14" strokeDasharray={`${len} ${c}`} strokeDashoffset={off} transform="rotate(-90 50 50)" />;
      })}
      <text x="50" y="52" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--fg)">178</text>
      <text x="50" y="64" textAnchor="middle" fontSize="7" fill="var(--fg-subtle)">incidents</text>
    </svg>
  );
}

function SLAScreen() {
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>SLA definitions</h1>
          <div className="subtitle">{SLAS.length} SLAs · 3 breaches this month · compliance 94.6%</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-file-export" /> Export</button>
          <button className="btn primary"><i className="fa-solid fa-plus" /> New SLA</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body flush">
          <table className="table">
            <thead>
              <tr><th>SLA</th><th>Target</th><th>Window</th><th>Compliance · 30d</th><th>Breaches</th><th>State</th><th></th></tr>
            </thead>
            <tbody>
              {SLAS.map(s => (
                <tr key={s.id}>
                  <td><b style={{ fontSize: 13 }}>{s.name}</b><div style={{ fontSize: 11, color: "var(--fg-subtle)" }}><span className="c-id">{s.id}</span></div></td>
                  <td className="mono" style={{ fontSize: 12 }}>{s.target}</td>
                  <td className="text-mute" style={{ fontSize: 12 }}>{s.window}</td>
                  <td>
                    <div className="row row-8">
                      <div style={{ width: 120, height: 6, background: "var(--bg-muted)", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${s.compliance}%`, height: "100%", background: s.compliance > 95 ? "var(--success)" : s.compliance > 90 ? "var(--warning)" : "var(--critical)" }} /></div>
                      <span className="mono" style={{ fontSize: 12, color: s.compliance > 95 ? "var(--success)" : s.compliance > 90 ? "var(--warning)" : "var(--critical)" }}>{s.compliance}%</span>
                    </div>
                  </td>
                  <td>{s.breach > 0 ? <Pill kind="critical">{s.breach}</Pill> : <span className="text-faint">0</span>}</td>
                  <td><Pill kind="success">Enforced</Pill></td>
                  <td><button className="icon-btn"><i className="fa-solid fa-ellipsis" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ReportsScreen, SLAScreen });
