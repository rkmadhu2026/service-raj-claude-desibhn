// Flow Designer — workflow canvas

function FlowScreen() {
  return (
    <div className="page page-fade wide" style={{ height: "calc(100vh - 140px)" }}>
      <div className="page-head">
        <div className="page-title">
          <h1>Flow Designer · Sev-1 auto-response</h1>
          <div className="subtitle">Triggered when a Sev 1 is declared · last run 14 min ago · 127 runs this week</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-clock-rotate-left" /> History</button>
          <button className="btn"><i className="fa-solid fa-vial" /> Test run</button>
          <button className="btn primary"><i className="fa-solid fa-play" /> Activate</button>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "260px 1fr 300px", gap: 12, alignItems: "stretch" }}>
        {/* Palette */}
        <div className="card">
          <div className="card-head"><h3>Steps</h3></div>
          <div className="card-body stack stack-6" style={{ padding: 10 }}>
            {[
              { g: "Triggers", items: [["fa-bolt", "When event occurs"], ["fa-clock", "Scheduled"], ["fa-globe", "HTTP webhook"]] },
              { g: "Logic",    items: [["fa-code-branch", "If/else"], ["fa-repeat", "For each"], ["fa-arrows-split-up-and-left", "Parallel"]] },
              { g: "Actions",  items: [["fa-slack fa-brands", "Post to Slack"], ["fa-ticket", "Create ticket"], ["fa-bell", "Send page"], ["fa-user-plus", "Add responder"], ["fa-play", "Run runbook"]] },
              { g: "AI",       items: [["fa-robot", "Summarize"], ["fa-magnifying-glass-chart", "Correlate"], ["fa-sparkles", "Suggest fix"]] },
            ].map(s => (
              <React.Fragment key={s.g}>
                <div className="text-mute" style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", padding: "8px 6px 2px" }}>{s.g}</div>
                {s.items.map(([ic, l]) => (
                  <div key={l} className="row row-8" style={{ padding: "6px 8px", border: "1px solid var(--border)", borderRadius: 6, cursor: "grab", fontSize: 12 }}>
                    <i className={`fa-solid ${ic}`} style={{ width: 16, color: "var(--fg-muted)" }} /> {l}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="card-body" style={{ padding: 0, background: "repeating-linear-gradient(0deg, var(--bg-raised) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, var(--bg-raised) 0 1px, transparent 1px 24px), var(--bg)", minHeight: 600, position: "relative" }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--fg-subtle)" /></marker>
              </defs>
              {/* connections */}
              <path d="M160,72 L160,134" stroke="var(--fg-subtle)" strokeWidth="1.5" fill="none" markerEnd="url(#arr)" />
              <path d="M160,196 L160,258" stroke="var(--fg-subtle)" strokeWidth="1.5" fill="none" markerEnd="url(#arr)" />
              <path d="M160,320 L90,382 M160,320 L230,382 M160,320 L400,382" stroke="var(--fg-subtle)" strokeWidth="1.5" fill="none" markerEnd="url(#arr)" />
              <path d="M400,432 L400,498" stroke="var(--fg-subtle)" strokeWidth="1.5" fill="none" markerEnd="url(#arr)" />
            </svg>

            <FlowNode x={80} y={24} kind="trigger" icon="fa-bolt" title="Sev-1 declared" sub="Trigger · incident.severity = 1" />
            <FlowNode x={80} y={134} kind="ai" icon="fa-sparkles" title="AI correlate & RCA" sub="Find similar incidents in last 90d" />
            <FlowNode x={80} y={258} kind="logic" icon="fa-code-branch" title="Has known runbook?" sub="Decision · KB match ≥ 80%" />
            <FlowNode x={10} y={382} kind="action" icon="fa-play" title="Run runbook" sub="pool-expansion-v3" />
            <FlowNode x={150} y={382} kind="action" icon="fa-user-plus" title="Page on-call" sub="PagerDuty · Tier 1 rotation" />
            <FlowNode x={320} y={382} kind="action" icon="fa-slack fa-brands" title="Open war-room" sub="Slack + Zoom bridge" highlight />
            <FlowNode x={320} y={498} kind="action" icon="fa-bullhorn" title="Update status page" sub="Auto-draft from AI summary" />
          </div>
        </div>

        {/* Inspector */}
        <div className="card">
          <div className="card-head"><h3>Inspector · War-room</h3></div>
          <div className="card-body stack stack-12">
            <div className="field"><label>Channel name</label><input className="input" defaultValue="inc-{{ incident.id }}-war-room" /></div>
            <div className="field"><label>Invite</label>
              <div className="row row-6" style={{ flexWrap: "wrap" }}>
                <span className="chip active">@oncall-sre <i className="fa-solid fa-xmark" /></span>
                <span className="chip active">@IC-pool <i className="fa-solid fa-xmark" /></span>
                <span className="chip active">@{'{'}{'{'}incident.service.owner{'}'}{'}'} <i className="fa-solid fa-xmark" /></span>
                <span className="chip">+ add</span>
              </div>
            </div>
            <div className="field"><label>Topic template</label><textarea className="input" rows={3} defaultValue="🔴 {{ incident.title }} — IC: {{ incident.commander }} — Bridge: {{ zoom.url }}" /></div>
            <div className="field"><label>Also notify</label>
              <div className="stack stack-6">
                {[["Email to execs", true], ["SMS to CTO if Sev-1", false], ["Status page draft", true]].map(([l, on], i) => (
                  <label key={i} className="row row-8" style={{ fontSize: 12.5 }}><input type="checkbox" defaultChecked={on} className="checkbox" /> {l}</label>
                ))}
              </div>
            </div>
            <div className="ai-card" style={{ padding: 10 }}>
              <div style={{ fontSize: 11, color: "var(--fg-muted)" }}><span className="ai-glyph">✦</span> Suggestion</div>
              <p style={{ fontSize: 12, margin: "4px 0 0" }}>Add "Attach runbook link" after this step — runs of this flow without that attachment have 23% longer MTTR.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowNode({ x, y, kind, icon, title, sub, highlight }) {
  const colors = {
    trigger: { bg: "var(--blue-50)",   bd: "var(--accent)",     ic: "var(--accent)" },
    ai:      { bg: "var(--purple-50)", bd: "var(--purple-500)", ic: "var(--purple-500)" },
    logic:   { bg: "var(--amber-50)",  bd: "var(--warning)",    ic: "var(--warning)" },
    action:  { bg: "var(--bg-raised)", bd: "var(--border-strong)", ic: "var(--fg-muted)" },
  };
  const c = colors[kind];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 160, background: c.bg, border: `1.5px solid ${highlight ? "var(--accent)" : c.bd}`, borderRadius: 8, padding: 10, boxShadow: highlight ? "0 0 0 3px rgba(37,99,235,.15)" : "0 1px 2px rgba(0,0,0,.05)" }}>
      <div className="row row-8" style={{ marginBottom: 4 }}>
        <div style={{ width: 24, height: 24, borderRadius: 5, background: "#fff", display: "grid", placeItems: "center", color: c.ic, fontSize: 11 }}><i className={`fa-solid ${icon}`} /></div>
        <b style={{ fontSize: 11.5, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</b>
      </div>
      <div style={{ fontSize: 10.5, color: "var(--fg-muted)" }}>{sub}</div>
    </div>
  );
}

Object.assign(window, { FlowScreen });
