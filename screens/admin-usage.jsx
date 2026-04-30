// Super-admin: usage & quotas per tenant

function AdminUsageScreen() {
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Usage & quotas</h1>
          <div className="subtitle">Event ingest, storage, and API consumption by business unit</div>
        </div>
        <div className="page-actions">
          <div className="seg"><button>Today</button><button>Week</button><button className="active">Month</button><button>Quarter</button></div>
          <button className="btn"><i className="fa-solid fa-bell" /> Quota alerts</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        <div className="card"><div className="kpi"><div className="kpi-label">Events ingested</div><div className="kpi-value">87<span className="unit">M</span></div><div className="kpi-delta neutral">of 100M · 87%</div><div style={{ marginTop: 8 }}><Sparkline data={spark(40, 0.3)} w={200} h={30} /></div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Storage</div><div className="kpi-value">4.2<span className="unit">TB</span></div><div className="kpi-delta neutral">of 10TB · 42%</div><div style={{ marginTop: 8 }}><Sparkline data={spark(41, 0.1)} sparkColor="var(--success)" w={200} h={30} /></div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">API calls</div><div className="kpi-value">24<span className="unit">M</span></div><div className="kpi-delta up"><i className="fa-solid fa-arrow-trend-up" />+22% vs last month</div><div style={{ marginTop: 8 }}><Sparkline data={spark(42, 0.6)} color="var(--purple-500)" w={200} h={30} /></div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Pages sent</div><div className="kpi-value">1,204</div><div className="kpi-delta down"><i className="fa-solid fa-arrow-trend-down" />-12% (noise reduced)</div><div style={{ marginTop: 8 }}><Sparkline data={spark(43, -0.4)} color="var(--success)" w={200} h={30} /></div></div></div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><h3>Per-tenant quotas</h3><span className="meta">Soft caps · upgrade to Enterprise for no limits</span></div>
        <div className="card-body flush">
          <table className="table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Events / mo</th>
                <th>Storage</th>
                <th>API / day</th>
                <th>Pages / mo</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              {TENANTS.map((t, i) => {
                const ev = [72, 84, 112, 48, 22, 66][i] || 50;
                const st = [38, 52, 78, 30, 12, 44][i] || 30;
                return (
                  <tr key={t.id}>
                    <td>
                      <div className="row row-12">
                        <div style={{ width: 26, height: 26, borderRadius: 6, background: colorFor(t.color), color: "#fff", fontWeight: 700, fontSize: 10, display: "grid", placeItems: "center" }}>{t.code}</div>
                        <b style={{ fontSize: 12.5 }}>{t.name}</b>
                      </div>
                    </td>
                    <QuotaCell pct={ev} label={`${ev}M / ${ev < 80 ? 100 : 120}M`} />
                    <QuotaCell pct={st} label={`${(st / 10).toFixed(1)}TB / ${st > 60 ? 2 : 1}TB`} />
                    <QuotaCell pct={[45, 62, 81, 34, 20, 55][i]} label="OK" />
                    <QuotaCell pct={[40, 28, 72, 22, 10, 48][i]} label={`${[120, 84, 216, 66, 30, 144][i]} / ${t.plan === "Enterprise" ? 500 : 300}`} />
                    <td><Pill kind={t.health > 95 ? "success" : t.health > 85 ? "warning" : "critical"}>{t.health}%</Pill></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3><i className="fa-solid fa-fire" /> Top consumers · events</h3></div>
          <div className="card-body">
            <div className="heatmap-wrap">
              <div className="text-mute" style={{ fontSize: 11, marginBottom: 8 }}>Event ingestion over 7 days × 24 hours</div>
              <Heatmap rows={7} cols={24} seed={9} />
              <div className="row between" style={{ marginTop: 10, fontSize: 11, color: "var(--fg-subtle)" }}>
                <span>Low</span>
                <div className="row row-8">
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map(v => <div key={v} style={{ width: 14, height: 10, borderRadius: 2, background: `rgba(37, 99, 235, ${0.08 + v * 0.8})` }} />)}
                </div>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3><i className="fa-solid fa-triangle-exclamation" /> Quota alerts</h3><span className="meta">3 active</span></div>
          <div className="card-body stack stack-10">
            {[
              { t: "Meridian Retail", msg: "Events ingested at 93% of monthly cap", kind: "warning" },
              { t: "Meridian Retail", msg: "Storage at 78% — projected breach in 9 days", kind: "warning" },
              { t: "Acme Subsidiary", msg: "API rate limit hit 12× in last 24h", kind: "critical" },
            ].map((a, i) => (
              <div key={i} className="row row-12" style={{ padding: "10px 12px", border: "1px solid var(--border)", borderLeft: `3px solid var(--${a.kind === "critical" ? "critical" : "warning"})`, borderRadius: 6 }}>
                <i className={`fa-solid fa-triangle-exclamation`} style={{ color: a.kind === "critical" ? "var(--critical)" : "var(--warning)" }} />
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: 12.5 }}>{a.t}</b>
                  <div style={{ fontSize: 11.5, color: "var(--fg-subtle)" }}>{a.msg}</div>
                </div>
                <button className="btn sm">Review</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const QuotaCell = ({ pct, label }) => (
  <td>
    <div className="row row-8">
      <div style={{ width: 56, height: 5, background: "var(--bg-muted)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: pct > 85 ? "var(--critical)" : pct > 70 ? "var(--warning)" : "var(--accent)" }} />
      </div>
      <span className="mono text-mute" style={{ fontSize: 11 }}>{label}</span>
    </div>
  </td>
);

Object.assign(window, { AdminUsageScreen });
