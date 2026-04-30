// Dashboard — scoped to the active tenant

function DashboardScreen({ tenant, setRoute, showSparklines, openIncidentDetail }) {
  return (
    <div className="page page-fade">
      <div className="page-head">
        <div className="page-title">
          <h1>{tenant.name} · Operations</h1>
          <div className="subtitle">
            <span className="live">LIVE</span>
            <span>Last sync 2s ago</span>
            <span>·</span>
            <span>Viewing {tenant.name} scope</span>
          </div>
        </div>
        <div className="page-actions">
          <div className="seg">
            <button>1h</button>
            <button>4h</button>
            <button className="active">24h</button>
            <button>7d</button>
            <button>30d</button>
          </div>
          <button className="btn"><i className="fa-solid fa-arrow-up-right-from-square" /> Public status</button>
          <button className="btn primary"><i className="fa-solid fa-triangle-exclamation" /> Declare incident <kbd>D</kbd></button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18, overflow: "hidden", borderRadius: 22, borderColor: "rgba(36,235,175,.18)", boxShadow: "0 28px 90px rgba(0,0,0,.22)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", minHeight: 178 }}>
          <div style={{ padding: 22, background: "radial-gradient(circle at 15% 8%, rgba(36,235,175,.20), transparent 30%), linear-gradient(135deg, #07111f, #102238 58%, #14322c)", color: "#fff" }}>
            <div className="row row-8" style={{ marginBottom: 12 }}>
              <span className="live">LIVE</span>
              <span style={{ color: "rgba(255,255,255,.68)", fontSize: 12 }}>Operations command structure</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 31, lineHeight: 1.02, letterSpacing: "-0.06em" }}>Stabilize checkout first, then clear dependency risk</h2>
            <p style={{ margin: "10px 0 0", maxWidth: 560, color: "rgba(255,255,255,.72)", fontSize: 13, lineHeight: 1.55 }}>
              Dashboard is organized by response priority: active incidents, service health, open risk, and responder capacity for {tenant.name}.
            </p>
            <div className="row row-8" style={{ marginTop: 16 }}>
              <button className="btn primary sm" onClick={() => (openIncidentDetail ? openIncidentDetail(INCIDENTS.find(i => i.sev === 1 && i.status === "active")?.id || INCIDENTS[0].id) : setRoute("incident-detail"))}><i className="fa-solid fa-fire" /> Open Sev-1</button>
              <button className="btn sm" onClick={() => setRoute("runbooks")} style={{ color: "#fff", background: "rgba(255,255,255,.12)", borderColor: "rgba(255,255,255,.22)" }}><i className="fa-solid fa-book" /> Matched runbook</button>
            </div>
          </div>

          <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, background: "linear-gradient(135deg, rgba(255,255,255,.06), rgba(36,235,175,.05))" }}>
            {[
              { label: "Incident focus", value: `${tenant.incidents} open`, sub: "2 need commander review", icon: "fa-triangle-exclamation", kind: "critical" },
              { label: "SLO risk", value: "12.4%", sub: "under 28d burn budget", icon: "fa-gauge-high", kind: "success" },
              { label: "Deploy safety", value: "Guarded", sub: "freeze active on checkout", icon: "fa-shield-halved", kind: "warning" },
              { label: "Responder load", value: "6 online", sub: "Tier-1 rotation healthy", icon: "fa-users", kind: "info" },
            ].map(x => (
              <div key={x.label} style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 13, background: "var(--bg-muted)" }}>
                <div className="row row-8" style={{ marginBottom: 8 }}>
                  <i className={`fa-solid ${x.icon}`} style={{ color: `var(--${x.kind === "info" ? "accent" : x.kind})`, width: 16 }} />
                  <span className="text-mute" style={{ fontSize: 11.5 }}>{x.label}</span>
                </div>
                <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em" }}>{x.value}</div>
                <div className="text-mute" style={{ fontSize: 11, marginTop: 2 }}>{x.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <KPI label="Active incidents" value={tenant.incidents} delta="2 since 1h ago" deltaKind="down" sparkData={spark(tenant.users, 0.2)} sparkColor="var(--critical)" showSpark={showSparklines} icon="fa-triangle-exclamation" />
        <KPI label="MTTR (p50)" value={tenant.mttr} unit="min" delta={`${Math.floor(tenant.mttr * 0.3)}m faster`} deltaKind="up" sparkData={spark(tenant.users + 1, -0.5)} sparkColor="var(--success)" showSpark={showSparklines} icon="fa-clock" />
        <KPI label="SLO burn (28d)" value="12.4" unit="%" delta="under budget" deltaKind="up" sparkData={spark(tenant.users + 2, -0.3)} sparkColor="var(--accent)" showSpark={showSparklines} icon="fa-gauge" />
        <KPI label="Deploy freq." value="47" unit="/day" delta="14% up" deltaKind="up" sparkData={spark(tenant.users + 3, 0.5)} sparkColor="var(--purple-500)" showSpark={showSparklines} icon="fa-rocket" />
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-head">
            <h3><i className="fa-solid fa-wave-square" /> Incident volume · 24h</h3>
            <div className="row row-8">
              <span className="meta">by severity</span>
              <div className="seg"><button className="active">Stacked</button><button>Line</button></div>
            </div>
          </div>
          <div className="card-body">
            <AreaChart data={spark(tenant.users, 0.6).concat(spark(tenant.users + 4, -0.4))} h={160} />
            <div className="row row-16" style={{ marginTop: 12, fontSize: 11.5 }}>
              <span><span className="dot red" /> Sev 1 · 2</span>
              <span><span className="dot amber" /> Sev 2 · 4</span>
              <span><span className="dot" style={{ background: "var(--info)" }} /> Sev 3 · 11</span>
              <span><span className="dot gray" /> Sev 4 · 6</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3><i className="fa-solid fa-diagram-project" /> Service health</h3>
            <span className="meta">{SERVICES.length} services</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="table">
              <tbody>
                {SERVICES.slice(0, 6).map(s => (
                  <tr key={s.name}>
                    <td>
                      <div className="row row-8">
                        <span className={`dot ${s.status === "healthy" ? "green" : s.status === "degraded" ? "amber" : "red"}`} />
                        <span className="mono" style={{ fontSize: 12 }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ width: 80 }}><Sparkline data={spark(s.name.length, s.status === "healthy" ? 0 : -0.3)} color={s.status === "healthy" ? "var(--success)" : s.status === "degraded" ? "var(--warning)" : "var(--critical)"} w={70} h={22} /></td>
                    <td className="mono text-mute" style={{ fontSize: 11.5 }}>{s.uptime}%</td>
                    <td className="mono text-mute" style={{ fontSize: 11.5 }}>{s.p95}</td>
                    <td><Pill kind={s.status === "healthy" ? "success" : s.status === "degraded" ? "warning" : "critical"}>{s.status}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <h3><i className="fa-solid fa-fire" /> Open incidents in {tenant.name}</h3>
          <button className="btn sm" onClick={() => setRoute("incidents")}>View all <i className="fa-solid fa-arrow-right" /></button>
        </div>
        <div className="card-body flush">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 56 }}>Sev</th>
                <th>Incident</th>
                <th>Client</th>
                <th>Application</th>
                <th>Service</th>
                <th>Assignee</th>
                <th>Age</th>
                <th>SLA</th>
                <th>Impact</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {INCIDENTS.filter(i => i.tenant === tenant.id || i.status === "active").slice(0, 4).map(inc => (
                <tr key={inc.id} className="inc-row" onClick={() => (openIncidentDetail ? openIncidentDetail(inc.id) : setRoute("incident-detail"))}>
                  <td><Sev n={inc.sev} /></td>
                  <td className="inc-title-cell">
                    <b>{inc.title}</b>
                    <div className="inc-meta">
                      <span className="c-id">{inc.id}</span>
                      <span>·</span>
                      <span className="ci-chip mono">{inc.asset?.name || inc.service}</span>
                      <span><i className="fa-solid fa-fire" style={{ color: "var(--critical)" }} /> Burn {inc.sloBurn}x</span>
                    </div>
                  </td>
                  <td className="text-mute" style={{ fontSize: 11, maxWidth: 140 }}>{inc.client}</td>
                  <td style={{ fontSize: 12 }}>{inc.application}</td>
                  <td className="mono text-mute" style={{ fontSize: 11.5 }}>{inc.service}</td>
                  <td><UserById id={inc.assignee} /></td>
                  <td className="mono text-mute" style={{ fontSize: 12 }}>{inc.age}</td>
                  <td><SLAIndicator pct={inc.sla} label={inc.sla < 0.4 ? "breaching" : `${Math.round(inc.sla * 100)}%`} /></td>
                  <td className="text-mute" style={{ fontSize: 11.5 }}>{inc.impacted}</td>
                  <td><button className="icon-btn"><i className="fa-solid fa-ellipsis" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="card-head"><h3><i className="fa-solid fa-heartbeat" /> SLO health</h3><span className="meta">28d window</span></div>
          <div className="card-body">
            {[
              { n: "checkout / availability", pct: 88, target: 99.9 },
              { n: "checkout / p95 latency",  pct: 72, target: 500 },
              { n: "auth / login success",    pct: 96, target: 99.99 },
              { n: "inventory / freshness",   pct: 83, target: 60 },
            ].map((s, i) => (
              <div key={i} className="bar-row">
                <span className="bar-label" style={{ width: 160, fontSize: 12 }}>{s.n}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${s.pct}%`, background: s.pct > 90 ? "var(--success)" : s.pct > 75 ? "var(--warning)" : "var(--critical)" }} /></div>
                <span className="bar-val">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3><i className="fa-solid fa-users" /> On-call right now</h3><button className="btn sm ghost"><i className="fa-solid fa-arrow-up-right-from-square" /></button></div>
          <div className="card-body stack stack-8" style={{ padding: 12 }}>
            {USERS.slice(0, 4).map(u => (
              <div key={u.id} className="row row-12" style={{ padding: "6px 4px" }}>
                <Avatar name={u.name} color={u.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 550 }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-subtle)" }}>{u.role} · {u.team}</div>
                </div>
                <Pill kind={u.status === "online" ? "success" : u.status === "away" ? "warning" : "neutral"}>{u.status}</Pill>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3><span style={{ background: "linear-gradient(135deg, var(--purple-500), var(--blue-500))", color: "#fff", width: 20, height: 20, borderRadius: 5, display: "inline-grid", placeItems: "center", fontSize: 11 }}>✦</span> AI copilot</h3></div>
          <div className="card-body stack stack-12">
            <div className="ai-card" style={{ padding: 12 }}>
              <h4 style={{ fontSize: 12.5 }}>Pattern detected</h4>
              <p style={{ fontSize: 12 }}>Your last 4 Sev-2's in <b>checkout-api</b> correlate with deploys on Thursdays after 3pm. Recommend tightening deploy windows.</p>
            </div>
            <div style={{ padding: "4px 8px", fontSize: 12.5 }}>
              <b>This week, NexEarn saved:</b>
              <ul style={{ marginTop: 6, paddingLeft: 18, lineHeight: 1.8, color: "var(--fg-muted)" }}>
                <li>~47 hours of responder time (auto-triage)</li>
                <li>12 pages suppressed (duplicate correlation)</li>
                <li>3 incidents auto-resolved (runbook match)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardScreen });
