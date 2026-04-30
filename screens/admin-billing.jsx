// Super-admin: billing & plans

function AdminBillingScreen() {
  const totalSpend = TENANTS.reduce((s, t) => s + t.spend, 0);
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Billing & plans</h1>
          <div className="subtitle">Enterprise agreement · Annual · Renews Mar 12, 2026</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-file-invoice" /> Invoices</button>
          <button className="btn"><i className="fa-solid fa-download" /> Export</button>
          <button className="btn primary"><i className="fa-solid fa-arrow-up-right-from-square" /> Contract</button>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 16 }}>
        <div className="card"><div className="kpi"><div className="kpi-label">MRR</div><div className="kpi-value">${(totalSpend / 1000).toFixed(0)}<span className="unit">k</span></div><div className="kpi-delta up"><i className="fa-solid fa-arrow-trend-up" />+14% QoQ</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Seats used</div><div className="kpi-value">{ORG.seatsUsed.toLocaleString()}</div><div className="kpi-delta neutral">{ORG.seatsTotal - ORG.seatsUsed} remaining</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Next invoice</div><div className="kpi-value">May 1</div><div className="kpi-delta neutral">${(totalSpend).toLocaleString()} estimated</div></div></div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><h3>Current plan · Enterprise Plus</h3><button className="btn sm">Change plan</button></div>
        <div className="card-body">
          <div className="grid-4">
            {[
              { label: "Base", value: "$18,000", note: "/mo committed" },
              { label: "Seats", value: "$12 × 1,247", note: "= $14,964" },
              { label: "Events ingested", value: "87M / 100M", note: "within commit" },
              { label: "Overage", value: "$0", note: "this period" },
            ].map((m, i) => (
              <div key={i} style={{ padding: 16, borderRight: i < 3 ? "1px solid var(--border-subtle)" : "none" }}>
                <div className="text-mute" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>{m.value}</div>
                <div className="text-mute" style={{ fontSize: 11.5, marginTop: 2 }}>{m.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3><i className="fa-solid fa-chart-column" /> Spend by business unit</h3><span className="meta">this month</span></div>
          <div className="card-body stack stack-8">
            {TENANTS.map(t => (
              <div key={t.id} className="bar-row">
                <span className="bar-label" style={{ width: 170 }}>
                  <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 3, background: colorFor(t.color), marginRight: 8, verticalAlign: "middle" }} />
                  {t.name}
                </span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(t.spend / 50000) * 100}%`, background: colorFor(t.color) }} /></div>
                <span className="bar-val">${(t.spend / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3><i className="fa-solid fa-box" /> Add-ons</h3></div>
          <div className="card-body stack stack-12">
            {[
              { n: "AI Copilot Pro", d: "Auto-RCA, playbook generation, chatops", price: "$2,500/mo", on: true },
              { n: "Status Page", d: "Public and private status pages", price: "$400/mo", on: true },
              { n: "Long-term storage", d: "3-year retention for events & logs", price: "$1,200/mo", on: false },
              { n: "On-prem collector", d: "Self-hosted data plane", price: "Included", on: true },
              { n: "FedRAMP Moderate", d: "Government-compliant region", price: "Contact sales", on: false },
            ].map((a, i) => (
              <div key={i} className="row row-12" style={{ padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8 }}>
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: 13 }}>{a.n}</b>
                  <div style={{ fontSize: 11.5, color: "var(--fg-subtle)" }}>{a.d}</div>
                </div>
                <span className="mono text-mute" style={{ fontSize: 12 }}>{a.price}</span>
                {a.on ? <Pill kind="success">Active</Pill> : <button className="btn sm">Enable</button>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminBillingScreen });
