// Public landing page

function LandingScreen({ onSignIn, onStartTrial }) {
  const outcomes = [
    ["62%", "faster MTTR"],
    ["4.2m", "events correlated yearly"],
    ["96%", "guarded runbook success"],
  ];

  return (
    <div style={{ minHeight: "100vh", width: "100vw", overflow: "auto", background: "#07111f", color: "#f8fafc" }}>
      <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(120deg, rgba(7,17,31,.96) 0%, rgba(7,17,31,.88) 38%, rgba(7,17,31,.30) 100%), url('https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 16% 20%, rgba(36,235,175,.20), transparent 30%), radial-gradient(circle at 78% 16%, rgba(59,130,246,.18), transparent 34%)" }} />

        <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "24px 28px 64px" }}>
          <header className="row row-12" style={{ justifyContent: "space-between", marginBottom: 72 }}>
            <div className="row row-10">
              <div style={{ width: 36, height: 36, borderRadius: 12, display: "grid", placeItems: "center", background: "#24ebaf", color: "#06131f", fontWeight: 900 }}>N</div>
              <div>
                <b style={{ fontSize: 15 }}>NexEarn</b>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.55)", textTransform: "uppercase", letterSpacing: ".13em" }}>Enterprise ITSM</div>
              </div>
            </div>
            <nav className="row row-16" style={{ color: "rgba(255,255,255,.68)", fontSize: 12.5 }}>
              <span>Incidents</span>
              <span>CMDB</span>
              <span>Runbooks</span>
              <span>SLOs</span>
            </nav>
            <button className="btn" onClick={onSignIn} style={{ color: "#fff", background: "rgba(255,255,255,.10)", borderColor: "rgba(255,255,255,.18)" }}>Sign in</button>
          </header>

          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 390px), 1fr))", gap: 42, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "7px 10px", borderRadius: 999, background: "rgba(36,235,175,.12)", border: "1px solid rgba(36,235,175,.22)", color: "#9af7d9", fontSize: 12, fontWeight: 700, marginBottom: 18 }}>
                <span className="live">LIVE</span>
                AI-native ITSM for multi-tenant operations
              </div>
              <h1 style={{ margin: 0, maxWidth: 760, fontSize: "clamp(46px, 7vw, 78px)", lineHeight: .9, letterSpacing: "-.075em" }}>
                Resolve incidents before the war room gets crowded.
              </h1>
              <p style={{ margin: "24px 0 0", maxWidth: 640, color: "rgba(255,255,255,.72)", fontSize: 18, lineHeight: 1.65 }}>
                NexEarn brings incidents, CMDB, runbooks, changes, SLOs, and service catalog into one command system for enterprise teams replacing ServiceNow, Datadog, and PagerDuty sprawl.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
                <button className="btn primary lg" onClick={onStartTrial}>Create free workspace <i className="fa-solid fa-arrow-right" /></button>
                <button className="btn lg" onClick={onSignIn} style={{ color: "#fff", background: "rgba(255,255,255,.10)", borderColor: "rgba(255,255,255,.18)" }}>I already have SSO</button>
              </div>
              <div style={{ marginTop: 12, color: "rgba(255,255,255,.56)", fontSize: 12 }}>No credit card · Demo data included · SSO can be connected later</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(120px, 1fr))", gap: 10, maxWidth: 610, marginTop: 34 }}>
                {outcomes.map(([value, label]) => (
                  <div key={label} style={{ padding: 16, borderRadius: 18, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.14)", backdropFilter: "blur(12px)" }}>
                    <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.06em" }}>{value}</div>
                    <div style={{ color: "rgba(255,255,255,.60)", fontSize: 12 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderRadius: 24, padding: 18, background: "rgba(248,250,252,.96)", color: "#0a1433", boxShadow: "0 36px 110px rgba(0,0,0,.45)" }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".10em" }}>Start here</div>
                <h2 style={{ margin: "5px 0 0", fontSize: 25, letterSpacing: "-.04em" }}>Create your workspace</h2>
              </div>
              <div className="stack stack-10">
                <div className="field"><label>Work email</label><input className="input" defaultValue="ops@company.com" /></div>
                <div className="field"><label>Company</label><input className="input" defaultValue="Meridian Holdings" /></div>
                <div className="field"><label>Workspace URL</label><input className="input mono" defaultValue="meridian.nexearn.io" /></div>
                <button className="btn primary lg" onClick={onStartTrial} style={{ width: "100%", justifyContent: "center" }}>Continue setup</button>
              </div>
              <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: "#eefdf7", border: "1px solid #bbf7df", color: "#047857", fontSize: 12 }}>
                <b>Included:</b> incident demo tenant, CMDB sample data, 184 runbooks, and guided SSO setup.
              </div>
            </div>
          </section>

          <section style={{ marginTop: 58, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: 18, alignItems: "stretch" }}>
            <div style={{ borderRadius: 26, overflow: "hidden", background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.14)", backdropFilter: "blur(16px)" }}>
              <div style={{ padding: 14, borderBottom: "1px solid rgba(255,255,255,.12)", display: "flex", gap: 8 }}>
                <span className="dot red" /><span className="dot amber" /><span className="dot green" />
                <span style={{ marginLeft: "auto", color: "rgba(255,255,255,.52)", fontSize: 11 }}>NexEarn command center</span>
              </div>
              <div style={{ padding: 18, display: "grid", gap: 10 }}>
                {[
                  ["INC-48291", "Payment gateway timeouts", "AI matched root cause and rollback runbook", "critical"],
                  ["CI-21", "SRV-ESX-DC1-01", "Healthy physical host · 1024 GB RAM · PCI scoped", "success"],
                  ["RB-1048", "Stripe connection pool exhaustion", "Guarded auto-run · 96% success", "success"],
                ].map(([id, title, sub, kind]) => (
                  <div key={id} className="row row-12" style={{ padding: 14, borderRadius: 14, background: "rgba(0,0,0,.22)", border: "1px solid rgba(255,255,255,.10)" }}>
                    <span className={`dot ${kind === "success" ? "green" : "red"}`} />
                    <div style={{ flex: 1 }}>
                      <div className="mono" style={{ color: "rgba(255,255,255,.48)", fontSize: 11 }}>{id}</div>
                      <b>{title}</b>
                      <div style={{ color: "rgba(255,255,255,.58)", fontSize: 12 }}>{sub}</div>
                    </div>
                    <i className="fa-solid fa-arrow-right" style={{ color: "rgba(255,255,255,.35)" }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderRadius: 26, padding: 22, background: "#f8fafc", color: "#0a1433" }}>
              <div style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 18 }}>Proof</div>
              <p style={{ margin: 0, fontSize: 25, lineHeight: 1.18, fontWeight: 850, letterSpacing: "-.045em" }}>
                "We replaced four tools with one response workspace and cut escalation review from 45 minutes to under 10."
              </p>
              <div className="row row-10" style={{ marginTop: 20 }}>
                <Avatar name="Devon Hassan" color="green" />
                <div>
                  <b>Devon Hassan</b>
                  <div style={{ color: "#64748b", fontSize: 12 }}>SRE Platform · Meridian Holdings</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LandingScreen });
// Public landing page

function LandingScreenDuplicateUnused({ onSignIn, onStartTrial }) {
  const outcomes = [
    ["62%", "faster MTTR"],
    ["4.2m", "events correlated yearly"],
    ["96%", "guarded runbook success"],
  ];

  return (
    <div style={{ minHeight: "100vh", width: "100vw", overflow: "auto", background: "#07111f", color: "#f8fafc" }}>
      <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(120deg, rgba(7,17,31,.96) 0%, rgba(7,17,31,.88) 38%, rgba(7,17,31,.30) 100%), url('https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 16% 20%, rgba(36,235,175,.20), transparent 30%), radial-gradient(circle at 78% 16%, rgba(59,130,246,.18), transparent 34%)" }} />

        <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "24px 28px 64px" }}>
          <header className="row row-12" style={{ justifyContent: "space-between", marginBottom: 72 }}>
            <div className="row row-10">
              <div style={{ width: 36, height: 36, borderRadius: 12, display: "grid", placeItems: "center", background: "#24ebaf", color: "#06131f", fontWeight: 900 }}>N</div>
              <div>
                <b style={{ fontSize: 15 }}>NexEarn</b>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.55)", textTransform: "uppercase", letterSpacing: ".13em" }}>Enterprise ITSM</div>
              </div>
            </div>
            <nav className="row row-16" style={{ color: "rgba(255,255,255,.68)", fontSize: 12.5 }}>
              <span>Incidents</span>
              <span>CMDB</span>
              <span>Runbooks</span>
              <span>SLOs</span>
            </nav>
            <button className="btn" onClick={onSignIn} style={{ color: "#fff", background: "rgba(255,255,255,.10)", borderColor: "rgba(255,255,255,.18)" }}>Sign in</button>
          </header>

          <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 390px", gap: 42, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "7px 10px", borderRadius: 999, background: "rgba(36,235,175,.12)", border: "1px solid rgba(36,235,175,.22)", color: "#9af7d9", fontSize: 12, fontWeight: 700, marginBottom: 18 }}>
                <span className="live">LIVE</span>
                AI-native ITSM for multi-tenant operations
              </div>
              <h1 style={{ margin: 0, maxWidth: 760, fontSize: "clamp(46px, 7vw, 78px)", lineHeight: .9, letterSpacing: "-.075em" }}>
                Resolve incidents before the war room gets crowded.
              </h1>
              <p style={{ margin: "24px 0 0", maxWidth: 640, color: "rgba(255,255,255,.72)", fontSize: 18, lineHeight: 1.65 }}>
                NexEarn brings incidents, CMDB, runbooks, changes, SLOs, and service catalog into one command system for enterprise teams replacing ServiceNow, Datadog, and PagerDuty sprawl.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
                <button className="btn primary lg" onClick={onStartTrial}>Create free workspace <i className="fa-solid fa-arrow-right" /></button>
                <button className="btn lg" onClick={onSignIn} style={{ color: "#fff", background: "rgba(255,255,255,.10)", borderColor: "rgba(255,255,255,.18)" }}>I already have SSO</button>
              </div>
              <div style={{ marginTop: 12, color: "rgba(255,255,255,.56)", fontSize: 12 }}>No credit card · Demo data included · SSO can be connected later</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(120px, 1fr))", gap: 10, maxWidth: 610, marginTop: 34 }}>
                {outcomes.map(([value, label]) => (
                  <div key={label} style={{ padding: 16, borderRadius: 18, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.14)", backdropFilter: "blur(12px)" }}>
                    <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.06em" }}>{value}</div>
                    <div style={{ color: "rgba(255,255,255,.60)", fontSize: 12 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderRadius: 24, padding: 18, background: "rgba(248,250,252,.96)", color: "#0a1433", boxShadow: "0 36px 110px rgba(0,0,0,.45)" }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".10em" }}>Start here</div>
                <h2 style={{ margin: "5px 0 0", fontSize: 25, letterSpacing: "-.04em" }}>Create your workspace</h2>
              </div>
              <div className="stack stack-10">
                <div className="field"><label>Work email</label><input className="input" defaultValue="ops@company.com" /></div>
                <div className="field"><label>Company</label><input className="input" defaultValue="Meridian Holdings" /></div>
                <div className="field"><label>Workspace URL</label><input className="input mono" defaultValue="meridian.nexearn.io" /></div>
                <button className="btn primary lg" onClick={onStartTrial} style={{ width: "100%", justifyContent: "center" }}>Continue setup</button>
              </div>
              <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: "#eefdf7", border: "1px solid #bbf7df", color: "#047857", fontSize: 12 }}>
                <b>Included:</b> incident demo tenant, CMDB sample data, 184 runbooks, and guided SSO setup.
              </div>
            </div>
          </section>

          <section style={{ marginTop: 58, display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 18, alignItems: "stretch" }}>
            <div style={{ borderRadius: 26, overflow: "hidden", background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.14)", backdropFilter: "blur(16px)" }}>
              <div style={{ padding: 14, borderBottom: "1px solid rgba(255,255,255,.12)", display: "flex", gap: 8 }}>
                <span className="dot red" /><span className="dot amber" /><span className="dot green" />
                <span style={{ marginLeft: "auto", color: "rgba(255,255,255,.52)", fontSize: 11 }}>NexEarn command center</span>
              </div>
              <div style={{ padding: 18, display: "grid", gap: 10 }}>
                {[
                  ["INC-48291", "Payment gateway timeouts", "AI matched root cause and rollback runbook", "critical"],
                  ["CI-21", "SRV-ESX-DC1-01", "Healthy physical host · 1024 GB RAM · PCI scoped", "success"],
                  ["RB-1048", "Stripe connection pool exhaustion", "Guarded auto-run · 96% success", "success"],
                ].map(([id, title, sub, kind]) => (
                  <div key={id} className="row row-12" style={{ padding: 14, borderRadius: 14, background: "rgba(0,0,0,.22)", border: "1px solid rgba(255,255,255,.10)" }}>
                    <span className={`dot ${kind === "success" ? "green" : "red"}`} />
                    <div style={{ flex: 1 }}>
                      <div className="mono" style={{ color: "rgba(255,255,255,.48)", fontSize: 11 }}>{id}</div>
                      <b>{title}</b>
                      <div style={{ color: "rgba(255,255,255,.58)", fontSize: 12 }}>{sub}</div>
                    </div>
                    <i className="fa-solid fa-arrow-right" style={{ color: "rgba(255,255,255,.35)" }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderRadius: 26, padding: 22, background: "#f8fafc", color: "#0a1433" }}>
              <div style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 18 }}>Proof</div>
              <p style={{ margin: 0, fontSize: 25, lineHeight: 1.18, fontWeight: 850, letterSpacing: "-.045em" }}>
                "We replaced four tools with one response workspace and cut escalation review from 45 minutes to under 10."
              </p>
              <div className="row row-10" style={{ marginTop: 20 }}>
                <Avatar name="Devon Hassan" color="green" />
                <div>
                  <b>Devon Hassan</b>
                  <div style={{ color: "#64748b", fontSize: 12 }}>SRE Platform · Meridian Holdings</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LandingScreen });
// Public landing page

function LandingScreenDuplicateUnused2({ onSignIn, onStartTrial }) {
  const ctaPrimary = "Start free workspace";
  const logos = ["Meridian", "Northstar Bank", "Acme Health", "BluePeak Retail", "Atlas Cloud"];
  const benefits = [
    ["Correlate every alert", "Incidents, deploys, CMDB dependencies, and SLO burn are joined into one responder timeline.", "fa-diagram-project"],
    ["Automate guarded response", "Runbooks execute with policy checks, approvals, and drift detection built into the workflow.", "fa-shield-halved"],
    ["Keep CMDB trustworthy", "Discover physical servers, VMs, storage, network gear, cloud services, and ownership continuously.", "fa-sitemap"],
  ];
  const proof = [
    ["62%", "faster MTTR"],
    ["12", "pages suppressed per week"],
    ["96%", "runbook success rate"],
    ["4m", "average discovery lag"],
  ];
  return (
    <div style={{ minHeight: "100vh", width: "100vw", background: "#050b1e", color: "#fff", overflow: "auto" }}>
      <div style={{ minHeight: "100vh", width: "100%", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 12%, rgba(36,235,175,.22), transparent 28%), radial-gradient(circle at 82% 20%, rgba(59,130,246,.26), transparent 30%), linear-gradient(180deg, #071129, #050b1e 58%, #08101f)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)", backgroundSize: "42px 42px", maskImage: "linear-gradient(to bottom, black, transparent 78%)" }} />

        <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "22px 28px 56px" }}>
          <header className="row row-12" style={{ justifyContent: "space-between", marginBottom: 62 }}>
            <div className="row row-10">
              <div style={{ width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", background: "linear-gradient(135deg, var(--blue-500), var(--purple-500))", boxShadow: "0 12px 30px rgba(59,130,246,.35)", fontWeight: 800 }}>N</div>
              <div>
                <b style={{ fontSize: 15 }}>NexEarn</b>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.52)", textTransform: "uppercase", letterSpacing: ".12em" }}>Full Stack ITSM</div>
              </div>
            </div>
            <nav className="row row-16" style={{ color: "rgba(255,255,255,.68)", fontSize: 12.5 }}>
              <span>Platform</span>
              <span>CMDB</span>
              <span>Runbooks</span>
              <span>Pricing</span>
            </nav>
            <div className="row row-8">
              <button className="btn" onClick={onSignIn} style={{ color: "#fff", background: "rgba(255,255,255,.08)", borderColor: "rgba(255,255,255,.18)" }}>Sign in</button>
              <button className="btn primary" onClick={onStartTrial}>{ctaPrimary}</button>
            </div>
          </header>

          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 46, alignItems: "center" }}>
            <div>
              <div className="row row-8" style={{ marginBottom: 16 }}>
                <span className="live">LIVE</span>
                <span style={{ color: "rgba(255,255,255,.64)", fontSize: 12 }}>ServiceNow, Datadog, PagerDuty, CMDB, and runbooks in one workspace</span>
              </div>
              <h1 style={{ fontSize: "clamp(40px, 7vw, 64px)", lineHeight: .92, letterSpacing: "-.07em", margin: 0, maxWidth: 680 }}>
                Enterprise IT operations that move at incident speed.
              </h1>
              <p style={{ fontSize: 17, lineHeight: 1.65, color: "rgba(255,255,255,.68)", maxWidth: 620, margin: "24px 0" }}>
                NexEarn unifies incidents, CMDB, service catalog, knowledge, automation, and SLO governance for multi-tenant organizations.
              </p>
              <div className="row row-10">
                <button className="btn primary lg" onClick={onStartTrial}>{ctaPrimary} <i className="fa-solid fa-arrow-right" /></button>
                <button className="btn lg" onClick={onSignIn} style={{ color: "#fff", background: "rgba(255,255,255,.08)", borderColor: "rgba(255,255,255,.18)" }}>Sign in with SSO</button>
              </div>
              <div style={{ marginTop: 14, color: "rgba(255,255,255,.54)", fontSize: 12 }}>No credit card · SSO-ready · sample tenant included</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, maxWidth: 610, marginTop: 32 }}>
                {[
                  ["62%", "faster MTTR"],
                  ["1,056", "configuration items"],
                  ["184", "guarded runbooks"],
                ].map(([v, l]) => (
                  <div key={l} style={{ padding: 16, border: "1px solid rgba(255,255,255,.13)", borderRadius: 14, background: "rgba(255,255,255,.06)" }}>
                    <div style={{ fontSize: 28, fontWeight: 850, letterSpacing: "-.05em" }}>{v}</div>
                    <div style={{ color: "rgba(255,255,255,.58)", fontSize: 12 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: "1px solid rgba(255,255,255,.14)", borderRadius: 24, background: "rgba(255,255,255,.08)", boxShadow: "0 40px 100px rgba(0,0,0,.42)", overflow: "hidden", backdropFilter: "blur(18px)" }}>
              <div style={{ height: 260, background: "linear-gradient(90deg, rgba(5,12,30,.88), rgba(5,12,30,.22)), url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80')", backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                <div style={{ position: "absolute", left: 18, top: 18 }}><Pill kind="success">Discovery live</Pill></div>
                <div style={{ position: "absolute", left: 22, bottom: 22 }}>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.58)" }}>Hybrid CMDB</div>
                  <div style={{ fontSize: 24, fontWeight: 850, letterSpacing: "-.05em" }}>Mumbai DC topology</div>
                </div>
              </div>
              <div style={{ padding: 18, display: "grid", gap: 10 }}>
                {[
                  ["Payment gateway timeouts", "Sev-1 active · 12,400 users impacted", "critical"],
                  ["Runbook matched", "Stripe connection pool exhaustion · 96% success", "success"],
                  ["Change linked", "Rollback pool config · approved by CAB", "warning"],
                ].map(([title, sub, kind]) => (
                  <div key={title} className="row row-12" style={{ padding: 12, border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, background: "rgba(0,0,0,.18)" }}>
                    <span className={`dot ${kind === "success" ? "green" : kind === "warning" ? "amber" : "red"}`} />
                    <div style={{ flex: 1 }}>
                      <b style={{ fontSize: 13 }}>{title}</b>
                      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.58)" }}>{sub}</div>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ color: "rgba(255,255,255,.34)", fontSize: 10 }} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ marginTop: 46, padding: "18px 0", borderTop: "1px solid rgba(255,255,255,.10)", borderBottom: "1px solid rgba(255,255,255,.10)" }}>
            <div style={{ color: "rgba(255,255,255,.48)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Trusted by teams replacing ticket sprawl</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {logos.map(logo => (
                <div key={logo} style={{ padding: "9px 13px", borderRadius: 999, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.10)", color: "rgba(255,255,255,.72)", fontWeight: 700, fontSize: 12 }}>{logo}</div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: 56 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, .7fr) 1fr", gap: 28, alignItems: "start" }}>
              <div>
                <div style={{ color: "var(--accent)", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em" }}>Why teams switch</div>
                <h2 style={{ margin: "10px 0 0", fontSize: 38, lineHeight: 1, letterSpacing: "-.055em" }}>Less tab switching. More actual recovery.</h2>
                <p style={{ marginTop: 14, color: "rgba(255,255,255,.62)", lineHeight: 1.65 }}>Built like a clean landing page should be: one promise, proof above the fold, concrete benefits, and repeated action points.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {benefits.map(([title, body, icon]) => (
                  <div key={title} style={{ padding: 18, borderRadius: 18, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.11)" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(36,235,175,.13)", color: "var(--accent)", marginBottom: 14 }}><i className={`fa-solid ${icon}`} /></div>
                    <h3 style={{ margin: 0, fontSize: 17 }}>{title}</h3>
                    <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.62)", fontSize: 13, lineHeight: 1.55 }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ marginTop: 56, display: "grid", gridTemplateColumns: "1fr minmax(280px, 430px)", gap: 18, alignItems: "stretch" }}>
            <div style={{ borderRadius: 22, padding: 22, background: "#f8fafc", color: "#0a1433" }}>
              <div style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 16 }}>Customer proof</div>
              <p style={{ fontSize: 25, lineHeight: 1.2, letterSpacing: "-.04em", margin: 0, fontWeight: 800 }}>"We replaced four tools with one incident workspace and cut our escalation review from 45 minutes to under 10."</p>
              <div className="row row-10" style={{ marginTop: 20 }}>
                <Avatar name="Devon Hassan" color="green" />
                <div>
                  <b>Devon Hassan</b>
                  <div style={{ color: "#64748b", fontSize: 12 }}>SRE Platform · Meridian Holdings</div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {proof.map(([v, l]) => (
                <div key={l} style={{ padding: 16, borderRadius: 18, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)" }}>
                  <div style={{ fontSize: 30, fontWeight: 850, letterSpacing: "-.05em" }}>{v}</div>
                  <div style={{ color: "rgba(255,255,255,.58)", fontSize: 12 }}>{l}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: 56, padding: 26, borderRadius: 24, background: "linear-gradient(135deg, rgba(36,235,175,.18), rgba(59,130,246,.16))", border: "1px solid rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 30, letterSpacing: "-.05em" }}>See your first incident workspace in two minutes.</h2>
              <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.64)" }}>Start with a demo tenant, then connect SSO, CMDB discovery, and runbook automation.</p>
            </div>
            <button className="btn primary lg" onClick={onStartTrial}>{ctaPrimary} <i className="fa-solid fa-arrow-right" /></button>
          </section>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LandingScreen });
