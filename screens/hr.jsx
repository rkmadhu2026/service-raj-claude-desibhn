// HR Service Delivery module

function HRScreen({ setRoute }) {
  const [tab, setTab] = React.useState("cases");
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>HR Service Delivery</h1>
          <div className="subtitle">142 open cases · 18 onboarding in progress · 96.2% CSAT</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-file-export" /> Export</button>
          <button className="btn primary"><i className="fa-solid fa-plus" /> New case</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        {[
          { l: "Open cases", v: "142", d: "12 high priority", k: "neutral", i: "fa-folder-open" },
          { l: "Onboarding", v: "18", d: "3 starting Monday", k: "up", i: "fa-user-plus" },
          { l: "Offboarding", v: "4", d: "2 this week", k: "neutral", i: "fa-user-minus" },
          { l: "Avg resolution", v: "1.4", u: "d", d: "22% faster", k: "up", i: "fa-clock" },
        ].map((x, i) => (
          <div key={i} className="card">
            <div className="kpi">
              <div className="kpi-label"><i className={`fa-solid ${x.i}`} style={{ marginRight: 6 }} />{x.l}</div>
              <div className="kpi-value">{x.v}{x.u && <span className="unit">{x.u}</span>}</div>
              <div className={`kpi-delta ${x.k}`}>{x.d}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="toolbar">
          {["cases", "onboarding", "offboarding", "lifecycle"].map(t => (
            <button key={t} className={`btn sm${tab === t ? " active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>
          ))}
          <div className="spacer" />
          <input className="filter-input" placeholder="Search cases…" style={{ paddingLeft: 12, maxWidth: 240 }} />
        </div>
      </div>

      {tab === "cases" && <HRCases />}
      {tab === "onboarding" && <HROnboarding />}
      {tab === "offboarding" && <HROffboarding />}
      {tab === "lifecycle" && <HRLifecycle />}
    </div>
  );
}

function HRCases() {
  const cases = [
    { id: "HR-4821", title: "Request for parental leave — 12 weeks", cat: "Leave", pri: "Normal", assignee: "u5", status: "In progress", created: "2d ago", dept: "Engineering" },
    { id: "HR-4818", title: "Salary correction — payroll discrepancy March", cat: "Payroll", pri: "High", assignee: "u8", status: "Escalated", created: "3d ago", dept: "Sales" },
    { id: "HR-4815", title: "Request workplace accommodation — standing desk", cat: "Facilities", pri: "Normal", assignee: "u7", status: "Open", created: "4d ago", dept: "Design" },
    { id: "HR-4812", title: "Benefits enrollment question — dental plan", cat: "Benefits", pri: "Low", assignee: "u5", status: "Awaiting info", created: "5d ago", dept: "Marketing" },
    { id: "HR-4809", title: "Internal transfer request — SRE to Platform", cat: "Transfer", pri: "Normal", assignee: "u8", status: "Manager review", created: "1w ago", dept: "SRE" },
    { id: "HR-4806", title: "Report policy violation — expense irregularity", cat: "Compliance", pri: "High", assignee: "u8", status: "Under review", created: "1w ago", dept: "Finance" },
    { id: "HR-4803", title: "Visa sponsorship renewal — H-1B extension", cat: "Immigration", pri: "High", assignee: "u5", status: "In progress", created: "2w ago", dept: "Engineering" },
  ];
  return (
    <div className="card">
      <div className="card-body flush">
        <table className="table">
          <thead><tr><th>Case</th><th>Category</th><th>Priority</th><th>Department</th><th>Assignee</th><th>Status</th><th>Age</th></tr></thead>
          <tbody>
            {cases.map(c => (
              <tr key={c.id}>
                <td><b style={{ fontSize: 13 }}>{c.title}</b><div style={{ fontSize: 11, color: "var(--fg-subtle)" }}><span className="c-id">{c.id}</span></div></td>
                <td><Pill kind="neutral" noDot>{c.cat}</Pill></td>
                <td><Pill kind={c.pri === "High" ? "critical" : c.pri === "Normal" ? "info" : "neutral"} noDot>{c.pri}</Pill></td>
                <td style={{ fontSize: 12 }}>{c.dept}</td>
                <td><UserById id={c.assignee} /></td>
                <td><Pill kind={c.status === "Escalated" ? "critical" : c.status === "In progress" ? "info" : c.status === "Manager review" ? "warning" : "neutral"}>{c.status}</Pill></td>
                <td className="mono text-mute" style={{ fontSize: 12 }}>{c.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HROnboarding() {
  const hires = [
    { name: "Ananya Sharma", role: "SRE II", start: "Apr 28", manager: "u2", progress: 65, tasks: "8/12", dept: "Platform" },
    { name: "James Chen", role: "Frontend Engineer", start: "Apr 28", manager: "u1", progress: 45, tasks: "5/11", dept: "Product" },
    { name: "Maria Rodriguez", role: "Data Analyst", start: "May 1", manager: "u5", progress: 20, tasks: "2/10", dept: "Analytics" },
    { name: "Raj Patel", role: "DevOps Engineer", start: "May 5", manager: "u3", progress: 10, tasks: "1/14", dept: "Infrastructure" },
  ];
  return (
    <div className="grid-2">
      {hires.map((h, i) => (
        <div key={i} className="card" style={{ padding: 20 }}>
          <div className="row row-12" style={{ marginBottom: 16 }}>
            <Avatar name={h.name} color={["amber", "teal", "pink", "purple"][i]} />
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 14 }}>{h.name}</b>
              <div style={{ fontSize: 12, color: "var(--fg-subtle)" }}>{h.role} · {h.dept}</div>
            </div>
            <Pill kind="info">Starts {h.start}</Pill>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div className="row row-8" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Onboarding progress</span>
              <span className="mono text-mute" style={{ fontSize: 11 }}>{h.tasks} tasks</span>
            </div>
            <div style={{ width: "100%", height: 6, background: "var(--bg-muted)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${h.progress}%`, height: "100%", background: h.progress > 60 ? "var(--success)" : "var(--accent)", transition: "width 0.3s" }} />
            </div>
          </div>
          <div className="stack stack-6">
            {[
              { t: "IT equipment provisioned", done: h.progress > 20 },
              { t: "Accounts & access created", done: h.progress > 30 },
              { t: "Security training assigned", done: h.progress > 50 },
              { t: "Buddy assigned", done: h.progress > 60 },
            ].map((task, j) => (
              <div key={j} className="row row-8" style={{ fontSize: 12 }}>
                <i className={`fa-solid ${task.done ? "fa-check-circle" : "fa-circle"}`} style={{ color: task.done ? "var(--success)" : "var(--fg-subtle)", fontSize: 13 }} />
                <span style={{ color: task.done ? "var(--fg-subtle)" : "var(--fg)", textDecoration: task.done ? "line-through" : "none" }}>{task.t}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 11.5, color: "var(--fg-subtle)" }}>
            Manager: <UserById id={h.manager} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HROffboarding() {
  const exits = [
    { name: "Tom Williams", role: "Senior Engineer", last: "Apr 30", reason: "Resignation", progress: 40, manager: "u1" },
    { name: "Lisa Park", role: "Product Manager", last: "May 2", reason: "End of contract", progress: 25, manager: "u5" },
  ];
  return (
    <div className="card">
      <div className="card-body stack stack-12" style={{ padding: 16 }}>
        {exits.map((e, i) => (
          <div key={i} style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 8 }}>
            <div className="row row-12" style={{ marginBottom: 12 }}>
              <Avatar name={e.name} color={["slate", "pink"][i]} />
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: 14 }}>{e.name}</b>
                <div style={{ fontSize: 12, color: "var(--fg-subtle)" }}>{e.role} · Last day: {e.last}</div>
              </div>
              <Pill kind={e.reason === "Resignation" ? "warning" : "neutral"}>{e.reason}</Pill>
            </div>
            <div className="grid-4" style={{ fontSize: 12 }}>
              {[
                { t: "Exit interview", done: true },
                { t: "Access revocation", done: false },
                { t: "Equipment return", done: false },
                { t: "Knowledge transfer", done: e.progress > 30 },
              ].map((task, j) => (
                <div key={j} className="row row-8">
                  <i className={`fa-solid ${task.done ? "fa-check-circle" : "fa-circle"}`} style={{ color: task.done ? "var(--success)" : "var(--fg-subtle)", fontSize: 13 }} />
                  <span>{task.t}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HRLifecycle() {
  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-head"><h3><i className="fa-solid fa-chart-bar" /> Headcount by department</h3></div>
        <div className="card-body stack stack-8">
          {[
            { dept: "Engineering", count: 142, pct: 82 },
            { dept: "Product", count: 38, pct: 58 },
            { dept: "SRE / Infra", count: 24, pct: 48 },
            { dept: "Design", count: 18, pct: 36 },
            { dept: "Sales", count: 32, pct: 52 },
            { dept: "HR / Admin", count: 12, pct: 24 },
          ].map((d, i) => (
            <div key={i} className="bar-row">
              <span className="bar-label" style={{ width: 110 }}>{d.dept}</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${d.pct}%`, background: "var(--accent)" }} /></div>
              <span className="bar-val mono">{d.count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3><i className="fa-solid fa-arrow-trend-up" /> Attrition trend · 12mo</h3></div>
        <div className="card-body">
          <AreaChart data={[3,2,4,3,2,5,4,3,2,3,4,2]} h={200} />
          <div className="row row-12" style={{ marginTop: 12, justifyContent: "center" }}>
            <div style={{ fontSize: 12 }}><b style={{ fontSize: 20 }}>3.2%</b> <span className="text-mute">annual attrition</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HRScreen });
