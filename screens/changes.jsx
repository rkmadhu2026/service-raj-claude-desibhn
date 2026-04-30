// Change management + CAB

function ChangesScreen({ setRoute }) {
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Change management</h1>
          <div className="subtitle">{CHANGES.length} changes · 1 CAB review pending · 2 in progress</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-calendar" /> Change calendar</button>
          <button className="btn"><i className="fa-solid fa-gavel" /> CAB board</button>
          <button className="btn primary"><i className="fa-solid fa-plus" /> New change</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        <div className="card"><div className="kpi"><div className="kpi-label">Awaiting approval</div><div className="kpi-value" style={{ color: "var(--warning)" }}>2</div><div className="kpi-delta neutral">CAB meets Fri 14:00</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Change success rate</div><div className="kpi-value" style={{ color: "var(--success)" }}>96.4<span className="unit">%</span></div><div className="kpi-delta up">+2.1% MoM</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Emergency changes</div><div className="kpi-value">3</div><div className="kpi-delta neutral">this week</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Avg lead time</div><div className="kpi-value">1.8<span className="unit">d</span></div><div className="kpi-delta up">18% faster</div></div></div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><h3><i className="fa-solid fa-calendar-week" /> Change calendar · next 7 days</h3><div className="seg"><button className="active">Week</button><button>Month</button></div></div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
            {["Mon 22", "Tue 23", "Wed 24", "Thu 25", "Fri 26", "Sat 27", "Sun 28"].map((d, i) => (
              <div key={d} style={{ padding: 10, background: i === 2 ? "var(--blue-50)" : "var(--bg-muted)", borderRadius: 8, border: i === 2 ? "1px solid var(--accent)" : "1px solid var(--border-subtle)" }}>
                <div className="text-mute" style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>{d}</div>
                {i === 0 && <div className="row row-8" style={{ marginBottom: 4, fontSize: 10.5 }}><span className="dot green" /><b>CHG-2214</b></div>}
                {i === 1 && <div className="row row-8" style={{ marginBottom: 4, fontSize: 10.5 }}><span className="dot amber" /><b>CHG-2217</b></div>}
                {i === 2 && <>
                  <div className="row row-8" style={{ marginBottom: 4, fontSize: 10.5 }}><span className="dot red" /><b>CHG-2219</b></div>
                  <div className="row row-8" style={{ fontSize: 10.5 }}><span className="dot amber" /><b>CHG-2216</b></div>
                </>}
                {i === 5 && <div className="row row-8" style={{ fontSize: 10.5 }}><span className="dot red" /><b>CHG-2218</b></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <span className="chip">+ State</span>
          <span className="chip">+ Risk</span>
          <span className="chip">+ Type</span>
          <span className="chip">+ Tenant</span>
          <div className="spacer" />
          <div className="seg"><button className="active">All</button><button>Mine</button><button>Awaiting CAB</button></div>
        </div>
        <div className="card-body flush">
          <table className="table">
            <thead>
              <tr>
                <th>Change</th>
                <th>Type</th>
                <th>State</th>
                <th>Risk</th>
                <th>Window</th>
                <th>Owner</th>
                <th>Approvals</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {CHANGES.map(c => (
                <tr key={c.id} onClick={() => setRoute("change-detail")} style={{ cursor: "pointer" }}>
                  <td><b style={{ fontSize: 13 }}>{c.title}</b><div style={{ fontSize: 11, color: "var(--fg-subtle)" }}><span className="c-id">{c.id}</span> · {c.service}</div></td>
                  <td><Pill kind={c.type === "Emergency" ? "critical" : c.type === "Standard" ? "success" : "info"} noDot>{c.type}</Pill></td>
                  <td><Pill kind={c.state === "Completed" ? "success" : c.state === "CAB review" ? "warning" : c.state === "Implementing" ? "info" : c.state === "Draft" ? "neutral" : "info"}>{c.state}</Pill></td>
                  <td><Pill kind={c.risk === "High" ? "critical" : c.risk === "Moderate" ? "warning" : "success"} noDot>{c.risk}</Pill></td>
                  <td className="text-mute" style={{ fontSize: 12 }}>{c.window}</td>
                  <td><UserById id={c.assignee} /></td>
                  <td>
                    {c.approvers > 0 ? (
                      <div className="row row-8">
                        <div style={{ width: 56, height: 5, background: "var(--bg-muted)", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${(c.approved / c.approvers) * 100}%`, height: "100%", background: c.approved === c.approvers ? "var(--success)" : "var(--warning)" }} /></div>
                        <span className="mono" style={{ fontSize: 11 }}>{c.approved}/{c.approvers}</span>
                      </div>
                    ) : <span className="text-faint">—</span>}
                  </td>
                  <td><button className="icon-btn"><i className="fa-solid fa-arrow-right" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ChangeDetailScreen({ setRoute }) {
  const c = CHANGES[1]; // CAB review
  return (
    <div className="page page-fade wide">
      <div className="inc-hero">
        <div style={{ width: 56, height: 56, borderRadius: 10, background: "linear-gradient(135deg, var(--accent), var(--purple-500))", color: "#fff", display: "grid", placeItems: "center", fontSize: 24 }}><i className="fa-solid fa-code-branch" /></div>
        <div style={{ flex: 1 }}>
          <div className="row row-8" style={{ marginBottom: 4 }}>
            <span className="c-id" style={{ fontSize: 13 }}>{c.id}</span>
            <Pill kind="warning">{c.state}</Pill>
            <Pill kind="critical" noDot>{c.risk} risk</Pill>
            <Pill kind="info" noDot>{c.type}</Pill>
          </div>
          <h1>{c.title}</h1>
          <div className="inc-crumbs">
            <span><i className="fa-solid fa-calendar" /> Window: <b>{c.window}</b></span>
            <span className="sep">·</span>
            <span><i className="fa-solid fa-user" /> Owner: <b>Marcus Okafor</b></span>
            <span className="sep">·</span>
            <span><i className="fa-solid fa-diagram-project" /> CI: <b>{c.service}</b></span>
          </div>
        </div>
        <div className="row row-8">
          <button className="btn"><i className="fa-solid fa-xmark" /> Reject</button>
          <button className="btn"><i className="fa-solid fa-comment" /> Request info</button>
          <button className="btn primary"><i className="fa-solid fa-check" /> Approve change</button>
        </div>
      </div>

      <div className="inc-grid">
        <div className="stack stack-16" style={{ minWidth: 0 }}>
          {/* Risk assessment */}
          <div className="card">
            <div className="card-head"><h3><i className="fa-solid fa-shield-halved" /> Risk assessment</h3><Pill kind="warning">auto-computed</Pill></div>
            <div className="card-body">
              <div className="grid-4">
                {[
                  { l: "Blast radius",   v: "Cluster-wide", k: "warning" },
                  { l: "Rollback",       v: "≤ 5 min",      k: "success" },
                  { l: "Peer review",    v: "3 / 5",        k: "warning" },
                  { l: "Tests",          v: "Passing",      k: "success" },
                ].map((x, i) => (
                  <div key={i} style={{ padding: 14, borderRight: i < 3 ? "1px solid var(--border-subtle)" : "none" }}>
                    <div className="text-mute" style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{x.l}</div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{x.v}</div>
                    <Pill kind={x.k}>{x.k === "success" ? "OK" : "Review"}</Pill>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Impacted CIs */}
          <div className="card">
            <div className="card-head"><h3><i className="fa-solid fa-sitemap" /> Impacted configuration items</h3><span className="meta">computed from dependency graph</span></div>
            <div className="card-body flush">
              <table className="table">
                <tbody>
                  {CIS.slice(0, 5).map(ci => (
                    <tr key={ci.id}>
                      <td><span className={`dot ${ci.health === "healthy" ? "green" : ci.health === "degraded" ? "amber" : "red"}`} /> <span className="mono" style={{ fontSize: 12 }}>{ci.name}</span></td>
                      <td style={{ fontSize: 12 }}>{ci.cls}</td>
                      <td className="text-mute" style={{ fontSize: 11.5 }}>{ci.region}</td>
                      <td><Pill kind={ci.health === "healthy" ? "success" : ci.health === "degraded" ? "warning" : "critical"}>{ci.health}</Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Plan */}
          <div className="card">
            <div className="card-head"><h3><i className="fa-solid fa-list-ol" /> Implementation plan</h3></div>
            <div className="card-body stack stack-8" style={{ padding: 14 }}>
              {[
                "Drain traffic from us-east-1c control plane nodes",
                "Upgrade etcd cluster first (quorum preserved)",
                "Upgrade api-server in rolling fashion, 1 at a time",
                "Validate pod scheduling on canary namespace",
                "Flip traffic back; monitor for 15 minutes",
                "Proceed only if error rate < 0.1% — otherwise rollback",
              ].map((s, i) => (
                <div key={i} className="row row-12" style={{ padding: "8px 10px" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 11, background: "var(--bg-muted)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600 }}>{i + 1}</div>
                  <div style={{ flex: 1, fontSize: 12.5 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stack stack-12">
          <div className="card">
            <div className="card-head"><h3>CAB approvals</h3></div>
            <div className="card-body stack stack-8" style={{ padding: 10 }}>
              {[
                { who: "u2", role: "Platform Lead", state: "approved" },
                { who: "u5", role: "SRE Manager", state: "approved" },
                { who: "u8", role: "Security", state: "approved" },
                { who: "u1", role: "CAB Chair", state: "pending" },
                { who: "u7", role: "Ops Director", state: "pending" },
              ].map((a, i) => {
                const u = USERS.find(x => x.id === a.who);
                return (
                  <div key={i} className="row row-12" style={{ padding: "6px 8px" }}>
                    <Avatar name={u.name} color={u.color} />
                    <div style={{ flex: 1, minWidth: 0 }}><b style={{ fontSize: 12.5 }}>{u.name}</b><div style={{ fontSize: 11, color: "var(--fg-subtle)" }}>{a.role}</div></div>
                    {a.state === "approved" ? <Pill kind="success"><i className="fa-solid fa-check" style={{ marginRight: 3 }} />approved</Pill> : <Pill kind="warning">pending</Pill>}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Links</h3></div>
            <div className="card-body stack stack-6" style={{ fontSize: 12, padding: 12 }}>
              <div>🔗 <span className="link">PR #4172 · upgrade-k8s-1-29</span></div>
              <div>🔗 <span className="link">PRB-3890 · etcd elections</span></div>
              <div>📋 <span className="link">Runbook: k8s control plane rollout</span></div>
              <div>📊 <span className="link">Dashboard: k8s control plane</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ChangesScreen, ChangeDetailScreen });
