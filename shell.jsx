// shell.jsx — app chrome (sidebar, header, tenant switcher)

const NAV = [
  { section: "Operate", items: [
    { id: "dashboard",     label: "Dashboard",       icon: "fa-chart-pie",        kbd: "G D" },
    { id: "incidents",     label: "Incidents",       icon: "fa-triangle-exclamation", kbd: "G I", badge: { n: 4, kind: "critical" } },
    { id: "services",      label: "Services",        icon: "fa-diagram-project",    kbd: "G S" },
    { id: "incident-detail", label: "Sev-1 Active",  icon: "fa-fire",             hidden: true },
    { id: "problems",      label: "Problems",        icon: "fa-magnifying-glass-chart", badge: { n: 12, kind: "warning" } },
    { id: "changes",       label: "Changes",         icon: "fa-code-branch",      badge: { n: 7, kind: "info" } },
    { id: "cross-tenant",  label: "Cross-tenant",    icon: "fa-grip-vertical" },
  ]},
  { section: "Service", items: [
    { id: "catalog",       label: "Service catalog", icon: "fa-bag-shopping" },
    { id: "knowledge",     label: "Knowledge base",  icon: "fa-book-open" },
    { id: "cmdb",          label: "CMDB · CIs",      icon: "fa-sitemap" },
    { id: "slas",          label: "SLA definitions", icon: "fa-stopwatch" },
    { id: "runbooks",      label: "Runbooks",        icon: "fa-book",             badge: { n: 184, kind: "neutral" } },
  ]},
  { section: "Build", items: [
    { id: "flow",          label: "Flow Designer",   icon: "fa-diagram-project" },
    { id: "reports",       label: "Reports",         icon: "fa-chart-column" },
    { id: "integrations",  label: "Integrations",    icon: "fa-plug" },
  ]},
  { section: "Admin", items: [
    { id: "admin-tenants", label: "Tenants",         icon: "fa-building" },
    { id: "admin-billing", label: "Billing & plans", icon: "fa-credit-card" },
    { id: "admin-usage",   label: "Usage & quotas",  icon: "fa-gauge-high" },
    { id: "users",         label: "People & roles",  icon: "fa-user-gear" },
    { id: "settings",      label: "Settings",        icon: "fa-sliders" },
  ]},
];

function Sidebar({ route, setRoute, setSwitcher, tenant }) {
  return (
    <aside className="sidebar">
      <div className="sb-head">
        <div className="sb-logo">N</div>
        <div className="sb-brand">
          <b>NexEarn</b>
          <span>Full Stack ITSM</span>
        </div>
      </div>

      <div className="tenant-switch" onClick={() => setSwitcher(true)}>
        <div className="t-icon" style={{ background: colorFor(tenant.color) }}>{tenant.code}</div>
        <div className="t-body">
          <div className="t-org">{ORG.name}</div>
          <div className="t-unit"><span className="t-unit-label">Unit:</span> {tenant.name}</div>
        </div>
        <i className="fa-solid fa-chevron-down" />
      </div>

      <nav className="sb-nav">
        {NAV.map(sec => (
          <div key={sec.section} className="sb-section">
            <div className="sb-section-title">{sec.section}</div>
            {sec.items.filter(i => !i.hidden).map(i => (
              <div key={i.id} className={`sb-item${route === i.id ? " active" : ""}`} onClick={() => setRoute(i.id)}>
                <span className="sb-icon"><i className={`fa-solid ${i.icon}`} /></span>
                <span className="sb-label">{i.label}</span>
                {i.badge && <span className={`sb-badge ${i.badge.kind}`}>{i.badge.n}</span>}
                {!i.badge && i.kbd && <kbd>{i.kbd}</kbd>}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="sb-foot">
        <div className="sb-env">
          <span className="env-dot" />
          <span>Production · us-east-1</span>
          <i className="fa-solid fa-bolt" />
        </div>
        <div className="sb-user">
          <Avatar name="Priya Raghunathan" color="amber" />
          <div className="sb-user-info">
            <b>Priya Raghunathan</b>
            <span>priya.r@meridian.io</span>
          </div>
          <i className="fa-solid fa-chevron-up" style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }} />
        </div>
      </div>
    </aside>
  );
}

function colorFor(name) {
  return {
    amber:  "linear-gradient(135deg,#f59e0b,#ef4444)",
    teal:   "linear-gradient(135deg,#14b8a6,#0891b2)",
    pink:   "linear-gradient(135deg,#ec4899,#8b5cf6)",
    purple: "linear-gradient(135deg,#8b5cf6,#6366f1)",
    slate:  "linear-gradient(135deg,#64748b,#475569)",
    green:  "linear-gradient(135deg,#10b981,#059669)",
  }[name] || "linear-gradient(135deg,#2563eb,#8b5cf6)";
}

function Header({ route, setRoute, setSwitcher, tenant, onCmd, incidentDetailId, onOpenActiveSev1 }) {
  const crumbs = crumbsFor(route, tenant, incidentDetailId);
  const activeSev1 = INCIDENTS.filter(i => i.sev === 1 && i.status === "active").length;
  return (
    <header className="header">
      <div className="hdr-crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <i className="fa-solid fa-chevron-right" />}
            <span className={`crumb${i === crumbs.length - 1 ? " current" : ""}`} onClick={c.to ? () => setRoute(c.to) : undefined}>{c.label}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="hdr-command">
        <i className="fa-solid fa-magnifying-glass" />
        <input className="hdr-command-input" placeholder="Search incidents, services, runbooks, people…" onFocus={onCmd} readOnly />
        <kbd>⌘K</kbd>
      </div>

      <div className="hdr-right">
        {activeSev1 > 0 && (
          <div className="hdr-incident-pill" onClick={() => (onOpenActiveSev1 ? onOpenActiveSev1() : setRoute("incident-detail"))}>
            <span className="pulse-dot" />
            <span>{activeSev1} active Sev 1</span>
          </div>
        )}
        <div className="hdr-divider" />
        <button className="icon-btn" title="Create"><i className="fa-solid fa-plus" /></button>
        <button className="icon-btn" title="Automation"><i className="fa-solid fa-robot" /></button>
        <button className="icon-btn" title="Notifications"><i className="fa-solid fa-bell" /><span className="dot" /></button>
        <button className="icon-btn" title="Help"><i className="fa-solid fa-circle-question" /></button>
        <div className="hdr-divider" />
        <div className="hdr-user">
          <Avatar name="Priya Raghunathan" color="amber" />
          <div>
            <b>Priya</b>
            <span>IC · on-call</span>
          </div>
          <i className="fa-solid fa-chevron-down" />
        </div>
      </div>
    </header>
  );
}

function crumbsFor(route, tenant, incidentDetailId) {
  const incLabel = incidentDetailId || "Incident";
  const base = [{ label: ORG.name }, { label: tenant.name }];
  const map = {
    "dashboard":        [...base, { label: "Operations Dashboard" }],
    "incidents":        [...base, { label: "Incidents" }],
    "incident-detail":  [...base, { label: "Incidents", to: "incidents" }, { label: incLabel }],
    "cross-tenant":     [{ label: ORG.name }, { label: "Cross-tenant view" }],
    "services":         [...base, { label: "Services" }],
    "runbooks":         [...base, { label: "Runbooks" }],
    "problems":         [...base, { label: "Problem management" }],
    "problem-detail":   [...base, { label: "Problems", to: "problems" }, { label: "PRB-3912" }],
    "changes":          [...base, { label: "Change management" }],
    "change-detail":    [...base, { label: "Changes", to: "changes" }, { label: "CHG-2219" }],
    "catalog":          [...base, { label: "Service catalog" }],
    "catalog-request":  [...base, { label: "Service catalog", to: "catalog" }, { label: "New request" }],
    "knowledge":        [...base, { label: "Knowledge base" }],
    "knowledge-article":[...base, { label: "Knowledge base", to: "knowledge" }, { label: "Article" }],
    "cmdb":             [...base, { label: "CMDB" }],
    "slas":             [...base, { label: "SLA definitions" }],
    "flow":             [...base, { label: "Flow Designer" }],
    "reports":          [...base, { label: "Reports & analytics" }],
    "admin-tenants":    [{ label: ORG.name }, { label: "Super-admin" }, { label: "Tenants" }],
    "admin-billing":    [{ label: ORG.name }, { label: "Super-admin" }, { label: "Billing & plans" }],
    "admin-usage":      [{ label: ORG.name }, { label: "Super-admin" }, { label: "Usage & quotas" }],
    "users":            [...base, { label: "People & roles" }],
    "settings":         [...base, { label: "Settings" }],
    "integrations":     [...base, { label: "Integrations" }],
    "onboarding":       [{ label: ORG.name }, { label: "Onboarding" }],
  };
  return map[route] || base;
}

function TenantSwitcher({ open, onClose, tenant, setTenant, setRoute }) {
  const [q, setQ] = React.useState("");
  const [focus, setFocus] = React.useState(0);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setFocus(f => Math.min(f + 1, TENANTS.length));
      if (e.key === "ArrowUp")   setFocus(f => Math.max(f - 1, 0));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  if (!open) return null;
  const filtered = TENANTS.filter(t => t.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="tsw-backdrop" onClick={onClose}>
      <div className="tsw" onClick={e => e.stopPropagation()}>
        <div className="tsw-head">
          <i className="fa-solid fa-magnifying-glass" />
          <input autoFocus placeholder="Jump to tenant, workspace, or view…" value={q} onChange={e => setQ(e.target.value)} />
          <kbd>esc</kbd>
        </div>
        <div className="tsw-body">
          <div className="tsw-section-title">Parent organization</div>
          <div className="tsw-row" onClick={() => { onClose(); setRoute("cross-tenant"); }}>
            <div className="tsw-icon" style={{ background: "linear-gradient(135deg,#0f1c3f,#2563eb)" }}>MH</div>
            <div className="tsw-info">
              <b>{ORG.name}</b>
              <span>All business units · cross-tenant view</span>
            </div>
            <div className="tsw-meta"><Pill kind="purple" noDot>Super-admin</Pill></div>
          </div>

          <div className="tsw-section-title">Business units ({filtered.length})</div>
          {filtered.map((t, i) => (
            <div key={t.id} className={`tsw-row${i + 1 === focus ? " focus" : ""}`} onClick={() => { setTenant(t); onClose(); }}>
              <div className="tsw-icon" style={{ background: colorFor(t.color) }}>{t.code}</div>
              <div className="tsw-info">
                <b>{t.name} {tenant.id === t.id && <span style={{ color: "var(--fg-subtle)", fontWeight: 400, fontSize: 11 }}>· current</span>}</b>
                <span>{t.users} users · {t.incidents} open incidents · {t.plan}</span>
              </div>
              <div className="tsw-meta">
                {t.sev1 > 0 && <Pill kind="critical">{t.sev1} Sev 1</Pill>}
                <span className="mono" style={{ fontSize: 11 }}>{t.health}%</span>
              </div>
            </div>
          ))}

          <div className="tsw-section-title">Quick actions</div>
          <div className="tsw-row" onClick={() => { onClose(); setRoute("onboarding"); }}>
            <div className="tsw-icon" style={{ background: "var(--bg-muted)", color: "var(--fg)" }}><i className="fa-solid fa-plus" /></div>
            <div className="tsw-info"><b>Create a new business unit</b><span>Provision a new sub-tenant under {ORG.name}</span></div>
            <kbd style={{ fontSize: 10, color: "var(--fg-subtle)" }}>⌘ N</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, Header, TenantSwitcher, colorFor });
