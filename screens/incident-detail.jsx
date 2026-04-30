// Incident detail — war room

/** KPI sparkline seed stable per incident id */
function _incSeed(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function _incidentKpis(inc) {
  const burn = Math.max(0.1, inc.sloBurn);
  const err = Math.min(42, burn * 2.8 + inc.sev * 1.8 + (_incSeed(inc.id) % 7) * 0.3).toFixed(1);
  const lat = Math.min(22, 0.8 + burn * 1.1 + inc.sev * 0.35).toFixed(1);
  const revK = Math.round(burn * 13 + inc.sev * 4 + (_incSeed(inc.id + "r") % 40));
  const perMin = (burn * 1.2 + inc.sev * 0.15).toFixed(1);
  const errN = parseFloat(err);
  return {
    err,
    lat,
    revK,
    perMin,
    errTone: errN > 18 ? "var(--critical)" : errN > 8 ? "var(--warning)" : "var(--fg-muted)",
    latTone: parseFloat(lat) > 6 ? "var(--warning)" : "var(--fg-muted)",
    sparkErr: spark(_incSeed(inc.id), burn > 4 ? 0.9 : 0.3),
    sparkLat: spark(_incSeed(inc.id + "l"), burn > 3 ? 0.65 : 0.2),
    sparkRev: spark(_incSeed(inc.id + "v"), burn > 4 ? 0.85 : 0.25),
  };
}

function _incidentAiConfidence(inc) {
  return Math.min(92, 58 + (5 - inc.sev) * 5 + (_incSeed(inc.id + "a") % 12));
}

function _stubTimeline(inc) {
  const asset = inc.asset?.name || inc.service;
  return [
    { t: "now", type: "critical", body: <><b>{inc.id}</b> opened · NexEarn correlated alerts for <code style={{ background: "var(--bg-raised)", padding: "1px 4px", borderRadius: 3 }}>{inc.service}</code> targeting <b>{asset}</b>.</>, meta: ["Alert correlation", inc.status] },
    { t: "+2m", type: "info", body: <>Command channel <b>#{inc.id.replace("INC-", "inc-")}-war-room</b> provisioned · responders paged per on-call roster.</>, meta: [tenantRowName(inc.tenant)] },
    { t: "+5m", type: "ai", body: <><b>NexEarn AI</b> suggests checking recent changes and dependency health for <b>{inc.application}</b> ({inc.client}).</>, meta: ["Runbooks", `${inc.sev <= 2 ? "high" : "normal"} priority`] },
  ];
}

function tenantRowName(tid) {
  const t = TENANTS.find(x => x.id === tid);
  return t ? t.name : tid;
}

function _stubChat(inc) {
  const ic = USERS.find(u => u.id === inc.assignee) || USERS[0];
  return [
    { u: ic.id, role: "IC", time: "now", text: `Ack ${inc.id}. Focusing on ${inc.application} — ${inc.asset?.name || inc.service}.` },
    { u: "u3", role: "Responder", time: "+1m", text: `Pulling metrics and last deploys for ${inc.service}.` },
    { ai: true, time: "+2m", text: `Scope: ${inc.client}. Primary asset ${inc.asset?.name || inc.service}. SLO burn ${inc.sloBurn}x — consider status comms if external impact grows.` },
  ];
}

function IncidentDetailScreen({ setRoute, layout = "triage", incidentId }) {
  const inc = INCIDENTS.find(i => i.id === incidentId) || INCIDENTS[0];
  const tenantRow = TENANTS.find(x => x.id === inc.tenant);
  const asset = inc.asset;
  const kpis = _incidentKpis(inc);
  const aiPct = _incidentAiConfidence(inc);
  const timeline = inc.id === "INC-48291" ? TIMELINE_EVENTS : _stubTimeline(inc);
  const chat = inc.id === "INC-48291" ? CHAT : _stubChat(inc);
  const commander = USERS.find(u => u.id === inc.assignee) || USERS[0];
  const relatedOthers = INCIDENTS.filter(i => i.id !== inc.id).slice(0, 2);
  const cmdBorder = inc.sev <= 2 ? "rgba(239,68,68,.28)" : inc.sev === 3 ? "rgba(245,158,11,.35)" : "var(--border)";
  const cmdShadow = inc.sev <= 2 ? "0 24px 70px rgba(239,68,68,.10)" : inc.sev === 3 ? "0 20px 50px rgba(245,158,11,.12)" : "var(--shadow-md)";
  const cmdBg = inc.sev <= 2
    ? "radial-gradient(circle at 12% 8%, rgba(255,255,255,.18), transparent 24%), linear-gradient(135deg, #2a0711, #991b1b 58%, #ef4444)"
    : inc.sev === 3
    ? "radial-gradient(circle at 12% 8%, rgba(255,255,255,.14), transparent 24%), linear-gradient(135deg, #422006, #b45309 55%, #d97706)"
    : "radial-gradient(circle at 12% 8%, rgba(255,255,255,.12), transparent 24%), linear-gradient(135deg, #1e293b, #475569 60%, #64748b)";
  return (
    <div className="page page-fade wide">
      <div className="inc-hero">
        <div className="sev-block"><div><b>{inc.sev}</b><div style={{ textAlign: "center" }}><span>SEV</span></div></div></div>
        <div className="inc-hero-main">
          <div className="row row-8" style={{ marginBottom: 4 }}>
            <span className="c-id" style={{ fontSize: 13 }}>{inc.id}</span>
            <Pill kind={inc.status === "active" ? "critical" : inc.status === "mitigating" ? "warning" : "neutral"}>{inc.status}</Pill>
            <span className="text-mute" style={{ fontSize: 12 }}>{inc.application} · {inc.client}</span>
          </div>
          <h1>{inc.title}</h1>
          <div className="inc-crumbs">
            <span><i className="fa-solid fa-user-shield" /> IC: <b>{commander.name}</b></span>
            <span className="sep">·</span>
            <span><i className="fa-solid fa-users" /> {Math.min(8, 3 + inc.sev)} responders</span>
            <span className="sep">·</span>
            <span><i className="fa-solid fa-fire" /> SLO burn <b style={{ color: inc.sloBurn > 5 ? "var(--critical)" : inc.sloBurn > 2 ? "var(--warning)" : "var(--fg-muted)" }}>{inc.sloBurn}x</b></span>
            <span className="sep">·</span>
            <span><i className="fa-solid fa-user-group" /> {inc.impacted} impacted</span>
          </div>
        </div>
        <div className="inc-hero-actions">
          <button className="btn"><i className="fa-solid fa-slack fa-brands" /> #{inc.id.replace("INC-", "inc-")}</button>
          <button className="btn"><i className="fa-solid fa-video" /> Join bridge</button>
          <button className="btn"><i className="fa-solid fa-user-plus" /> Add responder</button>
          <button className="btn danger"><i className="fa-solid fa-check" /> Mark resolved</button>
        </div>
      </div>

      <div className="inc-grid">
        <div className="stack stack-16" style={{ minWidth: 0 }}>
          {/* AI summary */}
          <div className="ai-card">
            <h4><span className="ai-glyph">✦</span> NexEarn AI — Root cause analysis <Pill kind="purple" noDot>{aiPct}% confidence</Pill></h4>
            {inc.id === "INC-48291" ? (
              <>
                <p><b>Likely cause:</b> Connection pool on <code style={{ background: "var(--bg-raised)", padding: "1px 4px", borderRadius: 3 }}>payments-primary</code> was reduced from 200 → 120 in deploy <code style={{ background: "var(--bg-raised)", padding: "1px 4px", borderRadius: 3 }}>2f8a1c</code> at 12:47 UTC. Peak traffic load at 14:30 exhausted the pool, causing cascading Stripe timeouts on <code style={{ background: "var(--bg-raised)", padding: "1px 4px", borderRadius: 3 }}>checkout-api</code>.</p>
                <ul className="ai-bullets">
                  <li><b>Blast radius:</b> 12,400 users · $8.2k / min revenue impact · Meridian Financial only</li>
                  <li><b>Correlation:</b> 3 signals · deploy event · memory pressure on DB · Stripe 429 rate</li>
                  <li><b>Remediation:</b> Rollback deploy 2f8a1c (safe · no schema change) — <span className="link">run playbook →</span></li>
                  <li><b>Similar past incident:</b> INC-47120 · resolved in 22 min via rollback</li>
                </ul>
              </>
            ) : (
              <>
                <p><b>Likely cause:</b> NexEarn is correlating signals for <b>{inc.application}</b> (<code style={{ background: "var(--bg-raised)", padding: "1px 4px", borderRadius: 3 }}>{inc.service}</code>) under <b>{inc.client}</b>. Initial focus: <b>{asset?.name || inc.service}</b>{asset?.type ? ` (${asset.type})` : ""} in <b>{asset?.env || "production"}</b> — pattern consistent with workload pressure or dependency degradation for this sev-{inc.sev} event.</p>
                <ul className="ai-bullets">
                  <li><b>Blast radius:</b> {inc.impacted} · {inc.client}</li>
                  <li><b>Topology:</b> Tenant <b>{tenantRow ? tenantRow.name : inc.tenant}</b> · SLO burn <b>{inc.sloBurn}x</b></li>
                  <li><b>Remediation:</b> Triage <span className="link">runbooks tagged {inc.service} →</span> · validate recent changes and capacity for {asset?.name || inc.service}</li>
                  <li><b>Similar:</b> Past {inc.service} incidents often resolved after rolling back or scaling the hottest tier — check CMDB dependency graph.</li>
                </ul>
              </>
            )}
            <div className="row row-8" style={{ marginTop: 14 }}>
              <button className="btn primary sm"><i className="fa-solid fa-play" /> Run suggested playbook</button>
              <button className="btn sm"><i className="fa-solid fa-thumbs-up" /> Helpful</button>
              <button className="btn sm ghost"><i className="fa-solid fa-thumbs-down" /> Off-base</button>
            </div>
          </div>

          {/* Signals grid */}
          <div className="grid-3">
            <div className="card"><div className="card-body"><div className="kpi-label"><i className="fa-solid fa-chart-line" /> Error rate</div><div className="kpi-value" style={{ color: kpis.errTone }}>{kpis.err}<span className="unit">%</span></div><div className="kpi-delta down"><i className="fa-solid fa-arrow-trend-up" />vs SLO window</div><div style={{ marginTop: 8 }}><Sparkline data={kpis.sparkErr} color={kpis.errTone} w={200} h={40} /></div></div></div>
            <div className="card"><div className="card-body"><div className="kpi-label"><i className="fa-solid fa-clock" /> p95 latency</div><div className="kpi-value" style={{ color: kpis.latTone }}>{kpis.lat}<span className="unit">s</span></div><div className="kpi-delta down"><i className="fa-solid fa-arrow-trend-up" />hot path</div><div style={{ marginTop: 8 }}><Sparkline data={kpis.sparkLat} color={kpis.latTone} w={200} h={40} /></div></div></div>
            <div className="card"><div className="card-body"><div className="kpi-label"><i className="fa-solid fa-coins" /> Revenue impact (est.)</div><div className="kpi-value" style={{ color: inc.sloBurn > 3 ? "var(--critical)" : "var(--fg)" }}>${kpis.revK}k</div><div className="kpi-delta down"><i className="fa-solid fa-arrow-trend-up" />${kpis.perMin}k/min</div><div style={{ marginTop: 8 }}><Sparkline data={kpis.sparkRev} color={inc.sloBurn > 3 ? "var(--critical)" : "var(--warning)"} w={200} h={40} /></div></div></div>
          </div>

          {/* Timeline + war-room */}
          <div className="card">
            <div className="card-head">
              <div className="row row-8">
                <h3><i className="fa-solid fa-list-timeline" /> Timeline & war-room</h3>
                <div className="seg"><button className="active">All</button><button>AI</button><button>Chat</button><button>System</button></div>
              </div>
              <span className="meta">Auto-scroll <input type="checkbox" defaultChecked className="checkbox" /></span>
            </div>
            <div className="card-body" style={{ padding: "16px 20px" }}>
              <div className="timeline">
                {timeline.map((ev, i) => (
                  <div key={i} className={`tl-item ${ev.type}`}>
                    <div className="tl-time">{ev.t}</div>
                    <div className="tl-body">{ev.body}</div>
                    {ev.meta && <div className="tl-meta">{ev.meta.map((m, j) => <span key={j}>{m}</span>)}</div>}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 18, padding: "14px 0", borderTop: "1px solid var(--border)" }}>
                <div className="text-mute" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>#{inc.id.replace("INC-", "inc-")}-war-room · {Math.min(8, 3 + inc.sev)} responders</div>
                <div className="stack stack-8">
                  {chat.map((c, i) =>
                    c.ai ? (
                      <div key={i} className="chat-item ai-suggestion">
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,var(--purple-500),var(--blue-500))", color: "#fff", display: "grid", placeItems: "center", fontSize: 12 }}>✦</div>
                        <div className="chat-body">
                          <div className="chat-head"><b>NexEarn AI</b><span className="chat-role">copilot</span><time>{c.time}</time></div>
                          <div className="chat-text">{c.text}</div>
                        </div>
                      </div>
                    ) : (
                      <div key={i} className="chat-item">
                        {(() => { const u = USERS.find(x => x.id === c.u); return <Avatar name={u.name} color={u.color} />; })()}
                        <div className="chat-body">
                          <div className="chat-head"><b>{USERS.find(x => x.id === c.u).name}</b><span className="chat-role">{c.role}</span><time>{c.time}</time></div>
                          <div className="chat-text">{c.text}</div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="row row-8" style={{ marginTop: 12, padding: "8px 10px", background: "var(--bg-muted)", borderRadius: 8 }}>
                  <Avatar name={commander.name} color={commander.color} />
                  <input className="input" style={{ border: "none", background: "transparent", padding: "4px 0" }} placeholder="Post an update — @mention, /runbook, /status…" />
                  <button className="btn sm"><i className="fa-solid fa-paperclip" /></button>
                  <button className="btn sm primary"><i className="fa-solid fa-paper-plane" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar panel */}
        <div className="stack stack-12">
          <div className="card" style={{ borderRadius: 18, overflow: "hidden", borderColor: cmdBorder, boxShadow: cmdShadow }}>
            <div style={{ padding: 16, color: "#fff", background: cmdBg }}>
              <div className="row row-8" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "rgba(255,255,255,.66)", fontWeight: 800 }}>Incident command</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
                    <span style={{ fontSize: 46, lineHeight: .9, fontWeight: 900, letterSpacing: "-.08em" }}>SEV {inc.sev}</span>
                    <span style={{ padding: "5px 9px", borderRadius: 999, background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.22)", fontSize: 11, fontWeight: 800 }}>{String(inc.status).toUpperCase()}</span>
                  </div>
                </div>
                <button className="btn sm" style={{ color: "#fff", background: "rgba(255,255,255,.12)", borderColor: "rgba(255,255,255,.24)" }}>Change</button>
              </div>
              <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <IncidentSignal label="Age" value={inc.age} tone={inc.sev <= 2 ? "critical" : undefined} />
                <IncidentSignal label="SLO burn" value={`${inc.sloBurn}x`} tone={inc.sloBurn > 5 ? "critical" : undefined} />
              </div>
            </div>

            <div className="card-body stack stack-12">
              <div style={{ padding: 12, borderRadius: 14, background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
                <div className="text-mute" style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Commander</div>
                <div className="row row-10">
                  <Avatar name={commander.name} color={commander.color} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b>{commander.name}</b>
                    <div className="text-mute" style={{ fontSize: 11.5 }}>{commander.role} · {commander.team}</div>
                  </div>
                  <span className="live">LIVE</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <IncidentInfoTile icon="fa-building" label="Client" value={inc.client} allowWrap />
                <IncidentInfoTile icon="fa-window-maximize" label="Application" value={inc.application} allowWrap />
                <IncidentInfoTile icon="fa-diagram-project" label="Service" value={inc.service} mono />
                <IncidentInfoTile icon="fa-server" label="Environment" value={asset?.env || "production"} tone="warning" />
                <IncidentInfoTile icon="fa-sitemap" label="Tenant" value={tenantRow ? tenantRow.name : inc.tenant} />
                <IncidentInfoTile icon="fa-clock" label="Detected" value={`14:${String(20 + (_incSeed(inc.id) % 35)).padStart(2, "0")}:${String(8 + (_incSeed(inc.id + "s") % 50)).padStart(2, "0")} UTC`} sub="auto-detected · prototype clock" mono />
              </div>

              {asset && (
                <div style={{ padding: 12, borderRadius: 14, background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
                  <div className="text-mute" style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Affected configuration item</div>
                  <div className="mono" style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 12 }}>{asset.name}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
                    {asset.type && <Prop label="Asset type">{asset.type}</Prop>}
                    {asset.role && <Prop label="Role">{asset.role}</Prop>}
                    {asset.host && <Prop label="Hostname / endpoint"><span className="mono" style={{ fontSize: 11.5 }}>{asset.host}</span></Prop>}
                    {asset.ip && <Prop label="IP / network"><span className="mono" style={{ fontSize: 11.5 }}>{asset.ip}</span></Prop>}
                    {asset.serial && <Prop label="Serial / resource ID"><span className="mono" style={{ fontSize: 11.5 }}>{asset.serial}</span></Prop>}
                    {asset.cluster && <Prop label="Cluster / AZ"><span className="mono" style={{ fontSize: 11.5 }}>{asset.cluster}</span></Prop>}
                  </div>
                </div>
              )}

              <div style={{ padding: 12, borderRadius: 14, border: "1px solid rgba(245,158,11,.30)", background: "var(--warning-bg)" }}>
                <div className="row row-8" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                  <b style={{ fontSize: 12.5 }}>External comms</b>
                  <Pill kind="info" noDot>investigating</Pill>
                </div>
                <div className="text-mute" style={{ fontSize: 12, lineHeight: 1.5 }}>{inc.id === "INC-48291" ? <>Status page is ready for first customer update. Linked PR <span className="link">#8241 · pool-size-tune</span>.</> : <>Draft customer-facing update references <b>{inc.application}</b> and estimated impact: <b>{inc.impacted}</b>. No publish yet — align with client stakeholders ({(inc.client.includes("—") ? inc.client.split("—")[0] : inc.client).trim()}).</>}</div>
              </div>

              <div className="row row-8">
                <button className="btn primary sm" style={{ flex: 1, justifyContent: "center" }}><i className="fa-solid fa-bullhorn" /> Update status</button>
                <button className="btn sm" style={{ flex: 1, justifyContent: "center" }}><i className="fa-solid fa-user-plus" /> Reassign IC</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Responders · {Math.min(8, 4 + inc.sev)}</h3><button className="btn sm ghost"><i className="fa-solid fa-plus" /></button></div>
            <div className="card-body stack stack-8" style={{ padding: 10 }}>
              {USERS.slice(0, 5).map(u => (
                <div key={u.id} className="row row-8" style={{ padding: "4px 6px" }}>
                  <Avatar name={u.name} color={u.color} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 550 }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: "var(--fg-subtle)" }}>{u.role === "Incident Commander" ? <b style={{ color: "var(--critical)" }}>IC</b> : u.role} · {u.team}</div>
                  </div>
                  <span className={`dot ${u.status === "online" ? "green" : u.status === "away" ? "amber" : "gray"}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Related</h3></div>
            <div className="card-body stack stack-8" style={{ fontSize: 12 }}>
              {relatedOthers.map(r => (
                <div key={r.id}>🔗 <span className="link">{r.id}</span> {r.title.slice(0, 48)}{r.title.length > 48 ? "…" : ""}</div>
              ))}
              <div>📋 Problem <span className="link">PRB-3912</span> {inc.sev <= 2 ? "(review)" : "(watch)"}</div>
              <div>📦 Change <span className="link">CHG-2219</span> · touches {inc.service}</div>
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

const IncidentSignal = ({ label, value, tone }) => (
  <div style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.16)" }}>
    <div style={{ fontSize: 10, color: "rgba(255,255,255,.58)", textTransform: "uppercase", letterSpacing: ".09em", fontWeight: 800 }}>{label}</div>
    <div className="mono" style={{ marginTop: 3, fontSize: 18, fontWeight: 900, color: tone === "critical" ? "#fecaca" : "#fff" }}>{value}</div>
  </div>
);

const IncidentInfoTile = ({ icon, label, value, sub, mono, tone, allowWrap }) => (
  <div style={{ padding: 12, borderRadius: 14, background: "var(--bg-muted)", border: "1px solid var(--border)", minWidth: 0 }}>
    <div className="row row-8" style={{ marginBottom: 8 }}>
      <i className={`fa-solid ${icon}`} style={{ color: tone === "warning" ? "var(--warning)" : "var(--accent)", width: 14 }} />
      <span className="text-mute" style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".07em" }}>{label}</span>
    </div>
    <div className={mono ? "mono" : ""} style={{ fontSize: 12.5, fontWeight: 750, overflow: allowWrap ? "visible" : "hidden", textOverflow: allowWrap ? undefined : "ellipsis", whiteSpace: allowWrap ? "normal" : "nowrap", lineHeight: allowWrap ? 1.4 : undefined }}>{value}</div>
    {sub && <div className="text-mute" style={{ marginTop: 3, fontSize: 11 }}>{sub}</div>}
  </div>
);

Object.assign(window, { IncidentDetailScreen });
