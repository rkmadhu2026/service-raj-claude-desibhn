// Problem management list + detail

function ProblemsScreen({ setRoute }) {
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Problem management</h1>
          <div className="subtitle">{PROBLEMS.length} problem records · 3 known errors published</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-file-export" /> Export</button>
          <button className="btn primary"><i className="fa-solid fa-plus" /> New problem</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        <div className="card"><div className="kpi"><div className="kpi-label">Open problems</div><div className="kpi-value">{PROBLEMS.filter(p => p.status !== "Resolved").length}</div><div className="kpi-delta neutral">3 high priority</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Avg RCA time</div><div className="kpi-value">6.2<span className="unit">d</span></div><div className="kpi-delta up">12% faster</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Known errors</div><div className="kpi-value">3</div><div className="kpi-delta neutral">Published to KB</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Linked incidents</div><div className="kpi-value">32</div><div className="kpi-delta down">Recurring patterns</div></div></div>
      </div>

      <div className="card">
        <div className="toolbar">
          <span className="chip active">Status: Open <i className="fa-solid fa-xmark" /></span>
          <span className="chip">+ Priority</span>
          <span className="chip">+ Assignee</span>
          <span className="chip">+ Service</span>
          <div className="spacer" />
          <div className="seg"><button className="active">All {PROBLEMS.length}</button><button>Active 4</button><button>Known errors 3</button></div>
        </div>
        <div className="card-body flush">
          <table className="table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Linked</th>
                <th>Age</th>
                <th>Impact</th>
                <th>KB</th>
              </tr>
            </thead>
            <tbody>
              {PROBLEMS.map(p => (
                <tr key={p.id} onClick={() => setRoute("problem-detail")} style={{ cursor: "pointer" }}>
                  <td>
                    <b style={{ fontSize: 13 }}>{p.title}</b>
                    <div style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 2 }}>
                      <span className="c-id">{p.id}</span> · {p.created}
                    </div>
                  </td>
                  <td><Pill kind={p.status === "Resolved" ? "success" : p.status === "Known error" ? "info" : p.status === "Root cause analysis" ? "warning" : "neutral"}>{p.status}</Pill></td>
                  <td><Sev n={p.priority} /></td>
                  <td><UserById id={p.assignee} /></td>
                  <td className="mono" style={{ fontSize: 12 }}><b>{p.linked}</b> <span className="text-mute">incidents</span></td>
                  <td className="mono text-mute" style={{ fontSize: 12 }}>{p.age}</td>
                  <td style={{ fontSize: 12 }}>{p.impact}</td>
                  <td>{p.kb ? <span className="link mono" style={{ fontSize: 11 }}>{p.kb}</span> : <span className="text-faint">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProblemDetailScreen({ setRoute }) {
  const p = PROBLEMS[0];
  return (
    <div className="page page-fade wide">
      <div className="inc-hero">
        <div style={{ width: 56, height: 56, borderRadius: 10, background: "var(--warning)", color: "#fff", display: "grid", placeItems: "center", fontSize: 26 }}><i className="fa-solid fa-magnifying-glass-chart" /></div>
        <div style={{ flex: 1 }}>
          <div className="row row-8" style={{ marginBottom: 4 }}>
            <span className="c-id" style={{ fontSize: 13 }}>{p.id}</span>
            <Pill kind="warning">{p.status}</Pill>
            <Sev n={p.priority} />
            <span className="text-mute" style={{ fontSize: 12 }}>Opened {p.created} · {p.linked} incidents linked</span>
          </div>
          <h1>{p.title}</h1>
          <div className="inc-crumbs">
            <span><i className="fa-solid fa-user" /> Owner: <b>Marcus Okafor</b></span>
            <span className="sep">·</span>
            <span><i className="fa-solid fa-diagram-project" /> Service: <b>payments-primary</b></span>
            <span className="sep">·</span>
            <span><i className="fa-solid fa-building" /> Impact: Meridian Financial</span>
          </div>
        </div>
        <div className="row row-8">
          <button className="btn"><i className="fa-solid fa-link" /> Link incident</button>
          <button className="btn primary"><i className="fa-solid fa-book" /> Publish known error</button>
        </div>
      </div>

      <div className="inc-grid">
        <div className="stack stack-16" style={{ minWidth: 0 }}>
          <div className="ai-card">
            <h4><span className="ai-glyph">✦</span> AI-synthesized RCA <Pill kind="purple" noDot>91% confidence</Pill></h4>
            <p>Across 4 linked incidents (INC-48291, INC-47120, INC-46088, INC-44012) the common trigger is a <b>reduction of the connection pool size</b> below capacity requirements during peak traffic. Each occurrence correlates with a Thursday-afternoon deploy window.</p>
            <ul className="ai-bullets">
              <li><b>Five whys:</b> The pool size is tunable via env var but not guarded by a load test.</li>
              <li><b>Contributing:</b> Autoscaler does not account for DB-side connection limits.</li>
              <li><b>Recommended fix:</b> Introduce a pool-sizing linter in CI and a canary replay against last-week's peak traffic.</li>
            </ul>
          </div>

          <div className="card">
            <div className="card-head"><h3><i className="fa-solid fa-link" /> Linked incidents · {p.linked}</h3></div>
            <div className="card-body flush">
              <table className="table">
                <tbody>
                  {INCIDENTS.slice(0, 4).map(inc => (
                    <tr key={inc.id}>
                      <td style={{ width: 56 }}><Sev n={inc.sev} /></td>
                      <td><b style={{ fontSize: 12.5 }}>{inc.title}</b><div style={{ fontSize: 11, color: "var(--fg-subtle)" }}><span className="c-id">{inc.id}</span> · {inc.application} · {inc.age}</div></td>
                      <td><Pill kind={inc.status === "active" ? "critical" : "neutral"}>{inc.status}</Pill></td>
                      <td><UserById id={inc.assignee} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3><i className="fa-solid fa-list-check" /> Corrective actions</h3><button className="btn sm"><i className="fa-solid fa-plus" /> Add</button></div>
            <div className="card-body stack stack-8" style={{ padding: 14 }}>
              {[
                { done: true,  t: "Rollback deploy 2f8a1c in payments-primary", who: "u3" },
                { done: true,  t: "Restore pool size to 200", who: "u3" },
                { done: false, t: "Add pool-sizing linter to CI (PR #8241)", who: "u2" },
                { done: false, t: "Schedule replay test against last week's peak", who: "u5" },
                { done: false, t: "Publish KB article and tag runbook", who: "u1" },
              ].map((a, i) => (
                <div key={i} className="row row-12" style={{ padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 6 }}>
                  <input type="checkbox" className="checkbox" defaultChecked={a.done} />
                  <div style={{ flex: 1, fontSize: 12.5, textDecoration: a.done ? "line-through" : "none", color: a.done ? "var(--fg-subtle)" : "var(--fg)" }}>{a.t}</div>
                  <UserById id={a.who} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stack stack-12">
          <div className="card">
            <div className="card-head"><h3>Properties</h3></div>
            <div className="card-body stack stack-12">
              <Prop label="State"><Pill kind="warning">Root cause analysis</Pill></Prop>
              <Prop label="Priority"><Sev n={1} /></Prop>
              <Prop label="Owner"><UserById id="u2" /></Prop>
              <Prop label="Service">payments-primary</Prop>
              <Prop label="Category">Database · capacity</Prop>
              <Prop label="Known error">Not yet published</Prop>
              <Prop label="Target RCA">Apr 28, 2026</Prop>
              <Prop label="Postmortem"><span className="link">pm-48291.md</span></Prop>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Watchers · 5</h3></div>
            <div className="card-body stack stack-8" style={{ padding: 10 }}>
              {USERS.slice(0, 4).map(u => <div key={u.id} className="row row-8" style={{ padding: "4px 6px" }}><Avatar name={u.name} color={u.color} /><div style={{ fontSize: 12.5, flex: 1 }}>{u.name}</div><span className="text-faint" style={{ fontSize: 10.5 }}>{u.team}</span></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Prop = ({ label, children }) => (
  <div style={{ fontSize: 12 }}>
    <div className="text-mute" style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
    <div>{children}</div>
  </div>
);

Object.assign(window, { ProblemsScreen, ProblemDetailScreen });
