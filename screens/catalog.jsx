// Service catalog

function CatalogScreen({ setRoute }) {
  const [cat, setCat] = React.useState(null);
  const items = cat ? CATALOG_ITEMS.filter(i => i.cat === cat) : CATALOG_ITEMS;
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Service catalog</h1>
          <div className="subtitle">Request anything across Meridian — access, hardware, software, infra</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-clipboard-list" /> My requests <span className="sb-badge neutral" style={{ marginLeft: 6 }}>3</span></button>
          <button className="btn primary"><i className="fa-solid fa-plus" /> Build a new service</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ padding: 20, background: "linear-gradient(135deg, var(--navy-800), var(--blue-500))", color: "#fff" }}>
          <div className="row row-16">
            <div style={{ flex: 1 }}>
              <h2 style={{ color: "#fff", fontSize: 22, marginBottom: 6 }}>What do you need today?</h2>
              <p style={{ color: "rgba(255,255,255,.8)", fontSize: 13 }}>Search {CATALOG_ITEMS.length * 18}+ items across {CATALOG_CATEGORIES.length} categories</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 10, padding: "10px 14px", width: 420 }}>
              <i className="fa-solid fa-magnifying-glass" style={{ color: "rgba(255,255,255,.7)", marginRight: 10 }} />
              <input placeholder="Search the catalog…" style={{ background: "transparent", border: "none", outline: "none", color: "#fff", flex: 1, fontSize: 13 }} />
              <kbd style={{ background: "rgba(255,255,255,.2)", color: "#fff", border: "none" }}>⌘K</kbd>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        {CATALOG_CATEGORIES.map(c => (
          <div key={c.id} className="card" style={{ padding: 16, cursor: "pointer", borderColor: cat === c.id ? "var(--accent)" : undefined }} onClick={() => setCat(cat === c.id ? null : c.id)}>
            <div className="row row-12">
              <div style={{ width: 40, height: 40, borderRadius: 8, background: c.color + "20", color: c.color, display: "grid", placeItems: "center", fontSize: 16 }}><i className={`fa-solid ${c.icon}`} /></div>
              <div style={{ flex: 1 }}><b style={{ fontSize: 13 }}>{c.label}</b><div style={{ fontSize: 11, color: "var(--fg-subtle)" }}>{c.count} items</div></div>
              <i className="fa-solid fa-chevron-right" style={{ color: "var(--fg-subtle)", fontSize: 11 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-head">
          <h3><i className="fa-solid fa-star" /> {cat ? CATALOG_CATEGORIES.find(c => c.id === cat).label : "Popular services"}</h3>
          {cat && <button className="btn sm ghost" onClick={() => setCat(null)}>Clear filter</button>}
        </div>
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {items.map(i => {
            const c = CATALOG_CATEGORIES.find(x => x.id === i.cat);
            return (
              <div key={i.id} className="card" style={{ padding: 14, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }} onClick={() => setRoute("catalog-request")}>
                <div className="row row-12">
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: c.color + "20", color: c.color, display: "grid", placeItems: "center", fontSize: 14 }}><i className={`fa-solid ${c.icon}`} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}><b style={{ fontSize: 13 }}>{i.title}</b><div style={{ fontSize: 11, color: "var(--fg-subtle)" }}>{c.label}</div></div>
                  {i.badge && <Pill kind={i.badge === "Urgent" ? "critical" : i.badge === "Auto" ? "success" : i.badge === "Bundle" ? "purple" : "info"} noDot>{i.badge}</Pill>}
                </div>
                <p style={{ fontSize: 12, color: "var(--fg-muted)", margin: "4px 0 0", lineHeight: 1.5 }}>{i.desc}</p>
                <div className="row row-8" style={{ marginTop: "auto", paddingTop: 8, borderTop: "1px solid var(--border-subtle)", fontSize: 11, color: "var(--fg-subtle)" }}>
                  <span><i className="fa-solid fa-clock" /> {i.eta}</span>
                  <span>·</span>
                  <span>SLA {i.sla}</span>
                  {i.popular && <><span>·</span><span style={{ color: "var(--accent)" }}><i className="fa-solid fa-fire" /> popular</span></>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CatalogRequestScreen({ setRoute }) {
  return (
    <div className="page page-fade narrow">
      <div className="page-head">
        <div className="page-title">
          <h1>New employee onboarding</h1>
          <div className="subtitle">Bundle · 6 items · Auto-provisioned on day 1</div>
        </div>
        <div className="page-actions"><button className="btn" onClick={() => setRoute("catalog")}>← Back to catalog</button></div>
      </div>
      <div className="grid-2" style={{ gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div className="card">
          <div className="card-head"><h3>Request details</h3></div>
          <div className="card-body">
            <div className="field"><label>Requested for</label>
              <div className="row row-12" style={{ padding: 10, background: "var(--bg-muted)", borderRadius: 8 }}>
                <Avatar name="Alex Chen" color="teal" />
                <div style={{ flex: 1 }}><b style={{ fontSize: 13 }}>Alex Chen</b><div style={{ fontSize: 11.5, color: "var(--fg-subtle)" }}>alex.chen@meridian.io · Starts May 1</div></div>
                <button className="btn sm ghost">Change</button>
              </div>
            </div>
            <div className="grid-2">
              <div className="field"><label>Department</label><select className="select"><option>Engineering</option></select></div>
              <div className="field"><label>Manager</label><select className="select"><option>Devon Hassan</option></select></div>
              <div className="field"><label>Role</label><select className="select"><option>Senior Software Engineer</option></select></div>
              <div className="field"><label>Office</label><select className="select"><option>San Francisco</option><option>Remote</option></select></div>
            </div>
            <div className="field"><label>Included in this bundle</label>
              <div className="stack stack-8" style={{ marginTop: 6 }}>
                {[
                  { n: "MacBook Pro 16\"", d: "M3 Max · 64GB · 1TB", c: "hardware" },
                  { n: "Okta account + SSO apps", d: "Email, Slack, Zoom, GitHub, Figma, Linear", c: "access" },
                  { n: "GitHub org access", d: "Standard engineer scope", c: "dev" },
                  { n: "AWS sandbox", d: "$300/mo budget, personal", c: "dev" },
                  { n: "Buddy assignment", d: "Auto-paired from engineering pool", c: "hr" },
                  { n: "Day-1 training", d: "Incident response · security · tooling", c: "hr" },
                ].map((x, i) => (
                  <div key={i} className="row row-12" style={{ padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 6 }}>
                    <input type="checkbox" defaultChecked className="checkbox" />
                    <div style={{ flex: 1 }}><b style={{ fontSize: 12.5 }}>{x.n}</b><div style={{ fontSize: 11, color: "var(--fg-subtle)" }}>{x.d}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="field"><label>Notes (optional)</label><textarea className="input" rows={3} placeholder="Any special requirements…" /></div>
          </div>
        </div>

        <div className="stack stack-12">
          <div className="card">
            <div className="card-head"><h3>Summary</h3></div>
            <div className="card-body stack stack-10">
              <div className="row between"><span className="text-mute" style={{ fontSize: 12 }}>Items</span><b>6</b></div>
              <div className="row between"><span className="text-mute" style={{ fontSize: 12 }}>Estimated cost</span><b className="mono">$4,280</b></div>
              <div className="row between"><span className="text-mute" style={{ fontSize: 12 }}>Approvals</span><b>2 required</b></div>
              <div className="row between"><span className="text-mute" style={{ fontSize: 12 }}>SLA</span><b>2 days</b></div>
              <div className="row between"><span className="text-mute" style={{ fontSize: 12 }}>Delivery</span><b>Apr 30 · by 5pm</b></div>
              <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)" }} />
              <button className="btn primary lg" style={{ width: "100%", justifyContent: "center" }}>Submit request <i className="fa-solid fa-arrow-right" style={{ marginLeft: 6 }} /></button>
              <button className="btn ghost sm">Save as draft</button>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Approval chain</h3></div>
            <div className="card-body stack stack-8" style={{ padding: 10 }}>
              {["Manager · Devon Hassan", "Finance · Sasha Volkov", "IT · auto"].map((x, i) => (
                <div key={i} className="row row-8" style={{ padding: 6, fontSize: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: i === 2 ? "var(--success)" : "var(--bg-muted)", color: i === 2 ? "#fff" : "var(--fg)", fontSize: 10, fontWeight: 600, display: "grid", placeItems: "center" }}>{i + 1}</div>
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CatalogScreen, CatalogRequestScreen });
