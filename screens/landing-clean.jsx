// Figma Community file–style: centered title + full-width preview (carousel thumbnail), then “duplicate” signup
function LandingScreen({ onSignIn, onStartTrial }) {
  const proof = [
    ["62%", "Faster MTTR", "After consolidation"],
    ["4.2M", "Events correlated", "Per year, isolated"],
    ["96%", "Runbook success", "Guarded automation"],
  ];
  const steps = [
    { icon: "fa-satellite-dish", title: "Ingest & correlate", text: "Alerts, logs, and CMDB in one stream so noise collapses into signal." },
    { icon: "fa-brain", title: "Triage with context", text: "AI-suggested root cause and owners without leaving the timeline." },
    { icon: "fa-shield-halved", title: "Execute safely", text: "Changes, runbooks, and comms in one audit-ready system of record." },
  ];
  const brands = ["Meridian", "Vector Labs", "Northwind", "Aperture", "Kairos Fin"];
  const mockRows = [
    { id: "INC-48291", t: "Payment gateway timeouts", s: "Sev-1 · auto-triage on", hot: true },
    { id: "CI-21", t: "SRV-ESX-DC1-01", s: "Healthy · 1024 GB RAM", hot: false },
    { id: "RB-1048", t: "Stripe pool exhaustion", s: "Runbook matched 96%", hot: false },
  ];

  return (
    <div className="landing landing--figma page-fade">
      <div className="lf-bg" aria-hidden="true" />
      <div className="lf-blob lf-blob-a" aria-hidden="true" />
      <div className="lf-blob lf-blob-b" aria-hidden="true" />
      <div className="lf-dots" aria-hidden="true" />

      <div className="lf-wrap">
        <header className="lf-top">
          <div className="row row-10">
            <div className="lf-mark" aria-hidden="true">N</div>
            <div>
              <b className="lf-who">NexEarn</b>
              <div className="lf-tag">ITSM · operations</div>
            </div>
          </div>
          <nav className="lf-nav" aria-label="Product">
            <span>Incidents</span>
            <span>CMDB</span>
            <span>Runbooks</span>
            <span>Changes</span>
          </nav>
          <button type="button" className="lf-ghost" onClick={onSignIn}>Sign in</button>
        </header>

        <section className="lf-hero-fig" aria-label="Product intro">
          <div className="lf-hero-in">
            <div className="lf-pill">
              <span className="lf-pill-glow" aria-hidden="true" />
              Community template · free to explore
            </div>
            <h1 className="lf-h1">Resolve incidents before the war room gets crowded</h1>
            <p className="lf-lead">
              One command system for CMDB, runbooks, changes, and service catalog—for teams outgrowing tool sprawl.
            </p>
            <div className="lf-cta">
              <button type="button" className="lf-btn lf-btn-dark" onClick={onStartTrial}>
                <i className="fa-solid fa-clone" style={{ fontSize: 12 }} />
                Duplicate workspace
              </button>
              <button type="button" className="lf-btn lf-btn-line" onClick={onStartTrial}>
                <i className="fa-solid fa-play" style={{ fontSize: 10 }} />
                Preview with demo
              </button>
              <button type="button" className="lf-btn lf-btn-line" onClick={onSignIn}>I have SSO</button>
            </div>
            <p className="lf-micro">No credit card · Demo tenant with realistic data</p>
            <p className="lf-file-meta">
              <i className="fa-solid fa-eye" style={{ marginRight: 6, opacity: 0.55, fontSize: 11 }} />
              12.4k views · 2.1k orgs · Last updated {new Date().toLocaleString("en-US", { month: "short", year: "numeric" })}
            </p>
            <div className="lf-stat3 lf-stat3-hero">
              {proof.map(([a, b, c]) => (
                <div key={b} className="lf-stat">
                  <div className="lf-stat-a">{a}</div>
                  <div className="lf-stat-b">{b}</div>
                  <div className="lf-stat-c">{c}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="lf-stage">
          <div className="lf-frame" aria-label="File preview (mock UI)">
            <div className="lf-chrome">
              <div className="lf-traffic">
                <span className="lf-circ lf-c1" />
                <span className="lf-circ lf-c2" />
                <span className="lf-circ lf-c3" />
              </div>
              <div className="lf-addr">
                <i className="fa-solid fa-lock" style={{ fontSize: 9, opacity: 0.45 }} />
                <span>app.nexearn.io / command / operations</span>
              </div>
            </div>
            <div className="lf-ui">
              <div className="lf-rail">
                <span className="lf-rail-i on" />
                <span className="lf-rail-i" />
                <span className="lf-rail-i" />
                <span className="lf-rail-i" />
              </div>
              <div className="lf-panel">
                <div className="lf-toolbar">
                  <span className="lf-tb-title">NexEarn · command</span>
                  <span className="lf-tb-pill">Live</span>
                </div>
                {mockRows.map((r) => (
                  <div key={r.id} className="lf-row">
                    <span className={`lf-dotp ${r.hot ? "is-hot" : ""}`} />
                    <div className="lf-row-txt">
                      <span className="lf-mono">{r.id}</span>
                      <span className="lf-row-name">{r.t}</span>
                      <span className="lf-row-sub">{r.s}</span>
                    </div>
                    <i className="fa-solid fa-chevron-right lf-chv" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="lf-cap">Full-width preview — same aspect as a Figma file carousel card</p>
        </div>

        <section className="lf-dup" aria-label="Get a copy in your org">
          <h2 className="lf-dup-h">Open in your organization</h2>
          <p className="lf-dup-d">Name your workspace and start with demo incidents, CMDB, and runbooks—like duplicating a file, but for production ops.</p>
          <aside className="lf-form card lf-form-narrow" aria-label="Workspace signup">
            <div className="lf-form-h">
              <span className="lf-form-ey">Work email & URL</span>
              <h3 className="lf-form-t">Create your workspace</h3>
            </div>
            <div className="stack stack-10">
              <div className="field"><label>Work email</label><input className="input" defaultValue="ops@company.com" /></div>
              <div className="field"><label>Company</label><input className="input" defaultValue="Meridian Holdings" /></div>
              <div className="field"><label>Workspace URL</label><input className="input mono" defaultValue="meridian.nexearn.io" /></div>
              <button type="button" className="lf-btn lf-btn-dark lf-btn-block" onClick={onStartTrial}>Continue setup</button>
            </div>
            <div className="lf-form-note">
              <b>Includes</b> demo incidents, CMDB samples, 184 runbooks, guided SSO.
            </div>
          </aside>
        </section>

        <section className="lf-band" aria-labelledby="lf-proof">
          <p className="lf-band-ey" id="lf-proof">Trusted by</p>
          <h2 className="lf-band-h">Teams that measure response in minutes</h2>
          <p className="lf-band-d">Same runbooks, same trail—from regulated finance to global retail.</p>
          <div className="lf-logos" role="list">
            {brands.map((b) => (
              <span key={b} className="lf-logo" role="listitem">{b}</span>
            ))}
          </div>
        </section>

        <section className="lf-how" aria-labelledby="lf-how-title">
          <div className="lf-how-l">
            <p className="lf-how-ey" id="lf-how-title">How it works</p>
            <h2 className="lf-how-h">Signal in. Context up. Work done.</h2>
            <p className="lf-how-d">Three beats—no PhD, no 60-tab spreadsheet.</p>
          </div>
          <div className="lf-how-grid">
            {steps.map((s) => (
              <article key={s.title} className="lf-tile">
                <div className="lf-tile-ic" aria-hidden="true"><i className={`fa-solid ${s.icon}`} /></div>
                <h3 className="lf-tile-t">{s.title}</h3>
                <p className="lf-tile-p">{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lf-bottom" aria-label="Get started">
          <div>
            <h2 className="lf-bt-t">Calmer on-call, starting today</h2>
            <p className="lf-bt-d">Spin up a full demo—your team can explore in minutes.</p>
          </div>
          <div className="lf-bt-btns">
            <button type="button" className="lf-btn lf-btn-dark" onClick={onStartTrial}>
              Create free workspace <i className="fa-solid fa-arrow-right" />
            </button>
            <button type="button" className="lf-btn lf-btn-line" onClick={onSignIn}>SSO sign-in</button>
          </div>
        </section>

        <footer className="lf-foot">
          <span>© {new Date().getFullYear()} NexEarn</span>
          <span className="lf-foot-r">
            <span>Security</span>
            <span>Status</span>
            <span>Docs</span>
          </span>
        </footer>
      </div>
    </div>
  );
}

Object.assign(window, { LandingScreen });
