// Runbooks command center

const RUNBOOKS = [
  {
    id: "RB-1048",
    title: "Stripe connection pool exhaustion",
    service: "checkout-api",
    risk: "Sev-1",
    owner: "u1",
    success: 96,
    lastRun: "14 min ago",
    duration: "8m 12s",
    automation: 7,
    status: "Ready",
    signal: "5xx > 8%, DB pool > 90%",
    steps: ["Freeze deploys", "Expand pool", "Scale checkout pods", "Verify Stripe latency"],
    tag: "payments",
  },
  {
    id: "RB-1032",
    title: "Kubernetes node pressure remediation",
    service: "payments-cluster",
    risk: "Sev-2",
    owner: "u2",
    success: 91,
    lastRun: "2h ago",
    duration: "12m 45s",
    automation: 5,
    status: "Guarded",
    signal: "Node memory > 88%, evictions rising",
    steps: ["Cordon hot node", "Drain safe workloads", "Scale node pool", "Uncordon after health check"],
    tag: "k8s",
  },
  {
    id: "RB-0987",
    title: "Zero-downtime database migration",
    service: "payments-primary",
    risk: "Change",
    owner: "u4",
    success: 98,
    lastRun: "1 day ago",
    duration: "42m",
    automation: 4,
    status: "Ready",
    signal: "CAB approved, shadow writes green",
    steps: ["Enable dual writes", "Backfill delta", "Switch read path", "Retire legacy index"],
    tag: "database",
  },
  {
    id: "RB-0921",
    title: "Elasticsearch shard rebalance tuning",
    service: "search-edge",
    risk: "Sev-3",
    owner: "u3",
    success: 87,
    lastRun: "3 days ago",
    duration: "18m 04s",
    automation: 3,
    status: "Needs review",
    signal: "Hot shard skew > 35%",
    steps: ["Pause bulk ingest", "Move hot shards", "Adjust allocation", "Resume ingest gradually"],
    tag: "search",
  },
];

function RunbooksScreen({ setRoute }) {
  const [active, setActive] = React.useState(RUNBOOKS[0]);
  const linkedArticles = ARTICLES.filter(a => a.cat === "Runbooks");
  const readyCount = RUNBOOKS.filter(r => r.status === "Ready").length;
  const avgSuccess = Math.round(RUNBOOKS.reduce((sum, r) => sum + r.success, 0) / RUNBOOKS.length);

  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Runbooks</h1>
          <div className="subtitle"><span className="live">LIVE</span> {readyCount} ready for auto-execution · {avgSuccess}% average success · StackStorm connected</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-vial" /> Dry run</button>
          <button className="btn"><i className="fa-solid fa-shield-halved" /> Approval policy</button>
          <button className="btn primary"><i className="fa-solid fa-plus" /> New runbook</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        {[
          { label: "Auto-runs today", value: "31", sub: "3 prevented escalations", icon: "fa-bolt", color: "var(--accent)" },
          { label: "Human approvals", value: "8", sub: "CAB + service owners", icon: "fa-user-check", color: "var(--warning)" },
          { label: "Mean recovery", value: "9m", sub: "down 24% this week", icon: "fa-stopwatch", color: "var(--success)" },
          { label: "Drift detected", value: "2", sub: "review required", icon: "fa-code-compare", color: "var(--critical)" },
        ].map(k => (
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

      <div className="grid-2" style={{ gridTemplateColumns: "1.15fr .85fr", gap: 16, alignItems: "start" }}>
        <div className="card">
          <div className="toolbar">
            <input className="filter-input" placeholder="Search runbooks, services, tags..." style={{ paddingLeft: 12 }} />
            <span className="chip active">Production ready <i className="fa-solid fa-xmark" /></span>
            <span className="chip">+ Owner</span>
            <span className="chip">+ Trigger</span>
            <div className="spacer" />
            <div className="seg"><button className="active">Active</button><button>Drafts</button><button>Archived</button></div>
          </div>
          <div className="card-body flush">
            <table className="table">
              <thead>
                <tr>
                  <th>Runbook</th>
                  <th>Service</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Success</th>
                  <th>Last run</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {RUNBOOKS.map(r => (
                  <tr key={r.id} className="inc-row" onClick={() => setActive(r)} style={{ background: active.id === r.id ? "var(--bg-muted)" : undefined }}>
                    <td className="inc-title-cell">
                      <b>{r.title}</b>
                      <div className="inc-meta">
                        <span className="c-id">{r.id}</span>
                        <span className="ci-chip">#{r.tag}</span>
                        <span>{r.risk}</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 12 }}>{r.service}</span></td>
                    <td><UserById id={r.owner} /></td>
                    <td><Pill kind={r.status === "Ready" ? "success" : r.status === "Guarded" ? "warning" : "critical"}>{r.status}</Pill></td>
                    <td>
                      <div className="row row-8">
                        <div style={{ width: 70 }}><SLAIndicator pct={r.success} /></div>
                        <span className="mono" style={{ fontSize: 11.5 }}>{r.success}%</span>
                      </div>
                    </td>
                    <td className="mono text-mute" style={{ fontSize: 12 }}>{r.lastRun}</td>
                    <td onClick={e => e.stopPropagation()}><button className="icon-btn"><i className="fa-solid fa-ellipsis" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stack stack-12">
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: 16, background: "linear-gradient(135deg, rgba(36,235,175,.16), rgba(37,99,235,.10))", borderBottom: "1px solid var(--border)" }}>
              <div className="row row-8" style={{ marginBottom: 8 }}>
                <span className="c-id">{active.id}</span>
                <Pill kind={active.status === "Ready" ? "success" : active.status === "Guarded" ? "warning" : "critical"}>{active.status}</Pill>
                <Pill kind="info" noDot>{active.risk}</Pill>
              </div>
              <h2 style={{ margin: 0, fontSize: 22, letterSpacing: "-0.03em" }}>{active.title}</h2>
              <div className="text-mute" style={{ marginTop: 6, fontSize: 12 }}>Trigger: {active.signal}</div>
            </div>
            <div className="card-body stack stack-14">
              <div className="grid-3" style={{ gap: 8 }}>
                {[
                  ["Duration", active.duration],
                  ["Automated steps", `${active.automation}/${active.steps.length + 4}`],
                  ["Success rate", `${active.success}%`],
                ].map(([l, v]) => (
                  <div key={l} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 10 }}>
                    <div className="text-mute" style={{ fontSize: 10.5 }}>{l}</div>
                    <b style={{ fontSize: 14 }}>{v}</b>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-mute" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Execution path</div>
                <div className="stack stack-8">
                  {active.steps.map((step, i) => (
                    <div key={step} className="row row-10" style={{ padding: 10, border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg-raised)" }}>
                      <div style={{ width: 24, height: 24, borderRadius: 999, display: "grid", placeItems: "center", background: i < active.automation ? "var(--accent)" : "var(--bg-muted)", color: i < active.automation ? "#06251b" : "var(--fg-muted)", fontSize: 11, fontWeight: 800 }}>{i + 1}</div>
                      <div style={{ flex: 1, fontSize: 12.5 }}>{step}</div>
                      <Pill kind={i < active.automation ? "success" : "neutral"} noDot>{i < active.automation ? "Auto" : "Manual"}</Pill>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ai-card" style={{ padding: 12 }}>
                <h4><span className="ai-glyph">✦</span> NexEarn AI guardrail</h4>
                <p>This runbook can auto-execute only when telemetry confidence is above 85% and no change freeze is active. Otherwise it opens an approval task for the service owner.</p>
              </div>

              <div className="row row-8">
                <button className="btn primary"><i className="fa-solid fa-play" /> Execute guarded run</button>
                <button className="btn"><i className="fa-solid fa-clock-rotate-left" /> View history</button>
                <button className="btn" onClick={() => setRoute("flow")}><i className="fa-solid fa-diagram-project" /> Open flow</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Linked knowledge</h3></div>
            <div className="card-body stack stack-8" style={{ padding: 12 }}>
              {linkedArticles.map(a => (
                <div key={a.id} className="row row-10" style={{ padding: 10, border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer" }} onClick={() => setRoute("knowledge-article")}>
                  <i className="fa-solid fa-book" style={{ color: "var(--fg-muted)" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b style={{ fontSize: 12.5 }}>{a.title.replace("Runbook: ", "")}</b>
                    <div className="text-mute" style={{ fontSize: 11 }}>{a.id} · {a.views.toLocaleString()} views · {a.rating} rating</div>
                  </div>
                  <i className="fa-solid fa-chevron-right" style={{ color: "var(--fg-subtle)", fontSize: 10 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RunbooksScreen });
