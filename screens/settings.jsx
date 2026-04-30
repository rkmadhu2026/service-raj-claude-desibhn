// Tenant settings (branding, SSO, domains)

function SettingsScreen({ tenant }) {
  const [section, setSection] = React.useState("general");
  return (
    <div className="page page-fade">
      <div className="page-head">
        <div className="page-title">
          <h1>Workspace settings</h1>
          <div className="subtitle">{tenant.name} · {tenant.id}.linkedeye.io</div>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "220px 1fr", gap: 16, alignItems: "start" }}>
        <div className="card">
          <div className="card-body" style={{ padding: 8 }}>
            {[
              { id: "general", label: "General", icon: "fa-gear" },
              { id: "branding", label: "Branding", icon: "fa-palette" },
              { id: "sso", label: "SSO & domains", icon: "fa-shield-halved" },
              { id: "security", label: "Security", icon: "fa-lock" },
              { id: "data", label: "Data residency", icon: "fa-database" },
              { id: "audit", label: "Audit log", icon: "fa-scroll" },
              { id: "api", label: "API tokens", icon: "fa-code" },
              { id: "danger", label: "Danger zone", icon: "fa-triangle-exclamation" },
            ].map(s => (
              <div key={s.id} className={`tree-node${section === s.id ? " active" : ""}`} onClick={() => setSection(s.id)}>
                <i className={`fa-solid ${s.icon} t-caret`} style={{ fontSize: 12, color: section === s.id ? "var(--accent)" : "var(--fg-subtle)" }} />
                <span style={{ flex: 1, fontSize: 12.5 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stack stack-16">
          {section === "general" && <>
            <div className="card">
              <div className="card-head"><h3>Identity</h3></div>
              <div className="card-body">
                <div className="field"><label>Workspace name</label><input className="input" defaultValue={tenant.name} /></div>
                <div className="field"><label>URL</label>
                  <div className="row row-8" style={{ border: "1px solid var(--border)", borderRadius: 6, padding: "0 10px", background: "var(--bg-raised)" }}>
                    <span className="text-mute">https://</span>
                    <input style={{ border: "none", outline: "none", padding: "8px 0", background: "transparent", flex: 1 }} defaultValue={tenant.id} />
                    <span className="text-mute">.linkedeye.io</span>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="field"><label>Time zone</label><select className="select"><option>UTC</option><option>America/New_York</option></select></div>
                  <div className="field"><label>Region</label><select className="select"><option>us-east-1</option><option>eu-west-1</option></select></div>
                </div>
              </div>
            </div>
          </>}
          {section === "branding" && <>
            <div className="card">
              <div className="card-head"><h3>Branding</h3><Pill kind="purple" noDot>Enterprise</Pill></div>
              <div className="card-body">
                <div className="grid-2">
                  <div>
                    <div className="field"><label>Logo</label>
                      <div className="row row-12" style={{ padding: 14, border: "1px dashed var(--border-strong)", borderRadius: 10 }}>
                        <div className="t-icon" style={{ width: 48, height: 48, borderRadius: 10, background: colorFor(tenant.color), color: "#fff", fontSize: 16, fontWeight: 700, display: "grid", placeItems: "center" }}>{tenant.code}</div>
                        <div style={{ flex: 1 }}><b>Upload SVG or PNG</b><div className="text-mute" style={{ fontSize: 11.5 }}>Shown in sidebar · favicon · email notifications</div></div>
                        <button className="btn sm">Upload</button>
                      </div>
                    </div>
                    <div className="field"><label>Primary color</label>
                      <div className="row row-8">
                        {["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#0a1433"].map(c => (
                          <div key={c} style={{ width: 28, height: 28, borderRadius: 6, background: c, cursor: "pointer", border: c === "#2563eb" ? "2px solid var(--fg)" : "1px solid var(--border)" }} />
                        ))}
                        <input className="input" style={{ width: 120 }} defaultValue="#2563eb" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-mute" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Preview</div>
                    <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ background: "var(--navy-800)", padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: colorFor(tenant.color), color: "#fff", fontWeight: 700, display: "grid", placeItems: "center", fontSize: 12 }}>{tenant.code}</div>
                        <div style={{ color: "#fff" }}><b style={{ fontSize: 13 }}>{tenant.name}</b><div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Incident Platform</div></div>
                      </div>
                      <div style={{ padding: 16, background: "var(--bg)" }}>
                        <button className="btn primary sm">Declare incident</button>
                        <span className="pill critical" style={{ marginLeft: 8 }}>1 active Sev 1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>}
          {section === "sso" && <>
            <div className="card">
              <div className="card-head"><h3>Single sign-on</h3><Pill kind="success">Enforced</Pill></div>
              <div className="card-body">
                <div className="row row-12" style={{ padding: 14, background: "var(--bg-muted)", borderRadius: 10, marginBottom: 16 }}>
                  <i className="fa-solid fa-key" style={{ fontSize: 24, color: "#007dc1" }} />
                  <div style={{ flex: 1 }}><b>Okta SAML 2.0</b><div className="text-mute" style={{ fontSize: 11.5 }}>meridian.okta.com · inherited from {ORG.name}</div></div>
                  <Pill kind="success">Active</Pill>
                  <button className="btn sm">Configure</button>
                </div>
                <div className="field"><label>SCIM provisioning</label><span className="hint">Auto-sync users from your IdP</span>
                  <div className="row row-12" style={{ padding: 10, border: "1px solid var(--border)", borderRadius: 8, marginTop: 6 }}>
                    <i className="fa-solid fa-arrows-rotate" style={{ color: "var(--success)" }} />
                    <span style={{ flex: 1, fontSize: 12.5 }}>Enabled · last sync 2 minutes ago · 412 users in scope</span>
                    <button className="btn sm">Endpoint</button>
                  </div>
                </div>
                <div className="field">
                  <label>Verified domains</label>
                  <div className="stack stack-8" style={{ marginTop: 6 }}>
                    {[{ d: "meridian.io", v: true }, { d: "meridian-ventures.com", v: true }, { d: "meridianlabs.dev", v: false }].map(x => (
                      <div key={x.d} className="row row-12" style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 6 }}>
                        <i className={`fa-solid ${x.v ? "fa-circle-check" : "fa-clock"}`} style={{ color: x.v ? "var(--success)" : "var(--warning)" }} />
                        <span style={{ flex: 1, fontSize: 12.5 }} className="mono">{x.d}</span>
                        {x.v ? <Pill kind="success">Verified</Pill> : <Pill kind="warning">Pending</Pill>}
                        <button className="icon-btn"><i className="fa-solid fa-ellipsis" /></button>
                      </div>
                    ))}
                    <button className="btn"><i className="fa-solid fa-plus" /> Add domain</button>
                  </div>
                </div>
              </div>
            </div>
          </>}
          {section !== "general" && section !== "branding" && section !== "sso" && (
            <div className="card">
              <div className="card-body">
                <div className="empty">
                  <i className="fa-solid fa-sliders" />
                  <h4>{section.toUpperCase()}</h4>
                  <p>This panel would expose {section}-specific controls. Prototype placeholder.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SettingsScreen });
