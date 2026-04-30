// Services — service registry & health (business-facing map)

function ServicesScreen({ tenant, setRoute, openIncidentDetail }) {
  const [scope, setScope] = React.useState("unit");
  const [q, setQ] = React.useState("");
  const [selected, setSelected] = React.useState(null);

  const rows = React.useMemo(() => {
    let list = SERVICES.map((s) => {
      const related = INCIDENTS.filter((i) => i.service === s.name && (scope === "all" || i.tenant === tenant.id));
      const openInc = related.filter((i) => i.status === "active" || i.status === "mitigating" || i.status === "investigating");
      return { svc: s, openCount: openInc.length, topInc: openInc[0] || related[0] };
    });
    if (scope === "unit") {
      list = list.filter((r) => r.svc.units.includes(tenant.id));
    }
    const ql = q.trim().toLowerCase();
    if (ql) {
      list = list.filter((r) => {
        const u = r.svc.units.map((id) => TENANTS.find((t) => t.id === id)?.name || id).join(" ");
        return (
          r.svc.name.toLowerCase().includes(ql) ||
          r.svc.squad.toLowerCase().includes(ql) ||
          (r.svc.summary || "").toLowerCase().includes(ql) ||
          u.toLowerCase().includes(ql)
        );
      });
    }
    const rank = (r) => (r.svc.status === "down" ? 0 : r.svc.status === "degraded" ? 1 : 2);
    return list.sort((a, b) => rank(a) - rank(b) || b.openCount - a.openCount || a.svc.name.localeCompare(b.svc.name));
  }, [tenant.id, scope, q]);

  const degraded = rows.filter((r) => r.svc.status === "degraded").length;
  const down = rows.filter((r) => r.svc.status === "down").length;
  const withInc = rows.filter((r) => r.openCount > 0).length;
  const healthyPct = rows.length ? Math.round((100 * rows.filter((r) => r.svc.status === "healthy").length) / rows.length) : 0;

  React.useEffect(() => {
    if (!rows.length) {
      setSelected(null);
      return;
    }
    if (!selected || !rows.some((r) => r.svc.name === selected.name)) {
      setSelected(rows[0].svc);
    }
  }, [rows, selected]);

  const detail = selected && rows.find((r) => r.svc.name === selected.name);

  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Service registry</h1>
          <div className="subtitle">
            Live health, ownership, and open incident links for runtime services · scoped to <b>{tenant.name}</b> when filtered
          </div>
        </div>
        <div className="page-actions">
          <div className="seg">
            <button type="button" className={scope === "unit" ? "active" : undefined} onClick={() => setScope("unit")}>
              This unit
            </button>
            <button type="button" className={scope === "all" ? "active" : undefined} onClick={() => setScope("all")}>
              All units
            </button>
          </div>
          <button type="button" className="btn" onClick={() => setRoute("catalog")}>
            <i className="fa-solid fa-bag-shopping" /> Service catalog
          </button>
          <button type="button" className="btn primary" onClick={() => setRoute("cmdb")}>
            <i className="fa-solid fa-sitemap" /> Map to CMDB
          </button>
        </div>
      </div>

      <div className="svc-dash-header">
        <div className="svc-dash-kpis">
          {[
            { k: "In scope", v: String(rows.length), sub: scope === "unit" ? "Services tied to this BU" : "Full platform registry", icon: "fa-diagram-project" },
            { k: "Healthy share", v: `${healthyPct}%`, sub: `${rows.length - degraded - down} green`, icon: "fa-heart-pulse" },
            { k: "Needs attention", v: String(degraded + down), sub: `${down} down · ${degraded} degraded`, icon: "fa-triangle-exclamation" },
            { k: "With open incidents", v: String(withInc), sub: "Active / mitigating", icon: "fa-fire-extinguisher" },
          ].map((tile) => (
            <div key={tile.k} className="svc-dash-kpi">
              <div className="svc-dash-kpi-icon">
                <i className={`fa-solid ${tile.icon}`} />
              </div>
              <div>
                <div className="svc-dash-kpi-label">{tile.k}</div>
                <div className="svc-dash-kpi-value">{tile.v}</div>
                <div className="svc-dash-kpi-sub">{tile.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="services-workspace">
        <div className="card">
          <div className="toolbar">
            <input
              className="filter-input"
              placeholder="Filter by service, squad, summary…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ paddingLeft: 12, flex: 1, maxWidth: 360 }}
            />
            <span className="text-mute" style={{ fontSize: 11 }}>
              {rows.length} shown
            </span>
          </div>
          <div className="card-body flush">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Tier</th>
                  <th>Health</th>
                  <th>Uptime</th>
                  <th>p95</th>
                  <th>Deps</th>
                  <th>Open inc.</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.svc.name}
                    className={selected && selected.name === r.svc.name ? "selected" : undefined}
                    onClick={() => setSelected(r.svc)}
                  >
                    <td>
                      <div className="row row-8">
                        <span className={`dot ${r.svc.status === "healthy" ? "green" : r.svc.status === "degraded" ? "amber" : "red"}`} />
                        <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>
                          {r.svc.name}
                        </span>
                      </div>
                      <div className="text-mute" style={{ fontSize: 11, marginTop: 2 }}>
                        {r.svc.squad}
                      </div>
                    </td>
                    <td>
                      <Pill kind={r.svc.tier === "Tier 0" ? "info" : r.svc.tier === "Tier 1" ? "warning" : "neutral"} noDot>
                        {r.svc.tier}
                      </Pill>
                    </td>
                    <td>
                      <Pill kind={r.svc.status === "healthy" ? "success" : r.svc.status === "degraded" ? "warning" : "critical"}>{r.svc.status}</Pill>
                    </td>
                    <td className="mono text-mute" style={{ fontSize: 12 }}>
                      {r.svc.uptime}%
                    </td>
                    <td className="mono text-mute" style={{ fontSize: 12 }}>
                      {r.svc.p95}
                    </td>
                    <td className="mono text-mute" style={{ fontSize: 12 }}>
                      {r.svc.deps}
                    </td>
                    <td>
                      {r.openCount > 0 ? (
                        <button
                          type="button"
                          className="btn sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (r.topInc && openIncidentDetail) openIncidentDetail(r.topInc.id);
                            else setRoute("incidents");
                          }}
                        >
                          {r.openCount} open
                        </button>
                      ) : (
                        <span className="text-faint">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ padding: 28, textAlign: "center", color: "var(--fg-subtle)", fontSize: 13 }}>
                      No services in this filter. Try <b>All units</b> or clear search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stack stack-12">
          {detail && (
            <div className="card">
              <div className="card-head">
                <h3>Overview</h3>
                <Pill kind={detail.svc.status === "healthy" ? "success" : detail.svc.status === "degraded" ? "warning" : "critical"}>{detail.svc.status}</Pill>
              </div>
              <div className="card-body stack stack-10" style={{ fontSize: 13 }}>
                <div>
                  <div className="text-mute" style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>
                    Summary
                  </div>
                  <p style={{ margin: "6px 0 0", lineHeight: 1.5 }}>{detail.svc.summary}</p>
                </div>
                <div>
                  <div className="text-mute" style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>
                    Owning squad
                  </div>
                  <div style={{ marginTop: 6 }}>{detail.svc.squad}</div>
                </div>
                <div>
                  <div className="text-mute" style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>
                    Business units
                  </div>
                  <div className="row row-8" style={{ marginTop: 8, flexWrap: "wrap" }}>
                    {detail.svc.units.map((id) => {
                      const tMeta = TENANTS.find((x) => x.id === id);
                      return (
                        <span key={id} className="pill neutral no-dot" style={{ fontSize: 11 }}>
                          {tMeta ? tMeta.code : id}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="row row-8" style={{ flexWrap: "wrap" }}>
                  <button type="button" className="btn sm primary" onClick={() => setRoute("cmdb")}>
                    Find in CMDB
                  </button>
                  {detail.topInc && openIncidentDetail && (
                    <button type="button" className="btn sm" onClick={() => openIncidentDetail(detail.topInc.id)}>
                      Open {detail.topInc.id}
                    </button>
                  )}
                  <button type="button" className="btn sm ghost" onClick={() => setRoute("incidents")}>
                    All incidents
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-head">
              <h3>SLI snapshot</h3>
            </div>
            <div className="card-body">
              {detail ? (
                <>
                  <div className="row row-12" style={{ marginBottom: 12 }}>
                    <Sparkline
                      data={spark(detail.svc.name.length, detail.svc.status === "healthy" ? 0.15 : -0.35)}
                      color={detail.svc.status === "healthy" ? "var(--success)" : detail.svc.status === "degraded" ? "var(--warning)" : "var(--critical)"}
                      w={320}
                      h={48}
                    />
                  </div>
                  <div className="grid-2" style={{ gap: 10 }}>
                    <div style={{ padding: 10, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-muted)" }}>
                      <div className="text-mute" style={{ fontSize: 11 }}>
                        Error budget burn (24h)
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{detail.svc.err}%</div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-muted)" }}>
                      <div className="text-mute" style={{ fontSize: 11 }}>
                        Upstream dependencies
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{detail.svc.deps}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-mute" style={{ fontSize: 12 }}>Select a service.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ServicesScreen });
