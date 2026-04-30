// Signup / workspace setup — step 1 can register against FastAPI
function SignupScreen({ onEnter, onSignIn, onBack }) {
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState("ops@meridian.io");
  const [company, setCompany] = React.useState("Meridian Holdings");
  const [slug, setSlug] = React.useState("meridian");
  const [password, setPassword] = React.useState("hunter2000x");
  const [regErr, setRegErr] = React.useState("");
  const [regLoading, setRegLoading] = React.useState(false);
  const canUseApi = typeof window.NexApi !== "undefined";

  const onContinueOne = async () => {
    setRegErr("");
    if (!canUseApi) {
      setStep(2);
      return;
    }
    setRegLoading(true);
    try {
      await window.NexApi.registerWorkspace({
        email: email.trim(),
        password,
        tenant_name: company.trim(),
        tenant_slug: slug.trim() || undefined,
      });
      setStep(2);
    } catch (e) {
      setRegErr(String(e.message || e));
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="public-flow" style={{ minHeight: "100vh", width: "100vw", overflow: "auto" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "28px" }}>
        <header className="row row-12" style={{ justifyContent: "space-between", marginBottom: 42, flexWrap: "wrap" }}>
          <button className="btn ghost" onClick={onBack}>← Back</button>
          <div className="row row-8" style={{ color: "var(--fg-subtle)", fontSize: 12 }}>Already have an account? <span className="link" onClick={onSignIn}>Sign in</span></div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: 30, alignItems: "start" }}>
          <div>
            <div style={{ color: "var(--accent)", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".10em" }}>Workspace setup</div>
            <h1 style={{ margin: "10px 0 12px", fontSize: 52, lineHeight: .96, letterSpacing: "-.065em" }}>Create your NexEarn operations workspace.</h1>
            <p style={{ maxWidth: 600, color: "var(--fg-muted)", fontSize: 16, lineHeight: 1.65 }}>Start with a realistic demo environment, then connect SSO, CMDB discovery, paging, and runbook automation when you are ready.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 12, marginTop: 28 }}>
              {[
                ["1", "Company profile", step >= 1],
                ["2", "Operations scope", step >= 2],
                ["3", "Launch demo", step >= 3],
              ].map(([n, label, active]) => (
                <div key={label} style={{ padding: 14, borderRadius: 14, border: `1px solid ${active ? "color-mix(in srgb, var(--accent) 50%, var(--border))" : "var(--border)"}`, background: active ? "color-mix(in srgb, var(--accent) 12%, var(--bg-raised))" : "var(--bg-raised)" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 999, display: "grid", placeItems: "center", background: active ? "var(--accent)" : "var(--bg-muted)", color: active ? "#06251b" : "var(--fg-muted)", fontWeight: 800 }}>{n}</div>
                  <b style={{ display: "block", marginTop: 10, fontSize: 13 }}>{label}</b>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20, borderRadius: 22, boxShadow: "var(--shadow-lg)", width: "100%", boxSizing: "border-box" }}>
            {step === 1 && (
              <div className="stack stack-12">
                <div><h2 style={{ margin: 0, fontSize: 24, letterSpacing: "-.04em" }}>Tell us who owns ops</h2><p className="text-mute" style={{ marginTop: 4 }}>Creates your tenant in the API when the app is served from the backend.</p></div>
                <div className="field"><label>Work email</label><input className="input" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></div>
                <div className="field"><label>Password</label><input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" /></div>
                <div className="field"><label>Company name</label><input className="input" value={company} onChange={e => setCompany(e.target.value)} /></div>
                <div className="field"><label>Workspace slug</label><input className="input mono" value={slug} onChange={e => setSlug(e.target.value)} /></div>
                {regErr && <div style={{ color: "var(--critical)", fontSize: 12.5 }}>{regErr}</div>}
                <button className="btn primary lg" onClick={onContinueOne} style={{ justifyContent: "center" }} disabled={regLoading}>
                  {regLoading ? "Creating…" : "Continue"}</button>
                {!canUseApi && <p className="text-mute" style={{ fontSize: 11 }}>Without the API, this continues the prototype wizard only. Run <code>cd backend &amp;&amp; ./run-dev.sh</code> and open the served URL for real registration.</p>}
              </div>
            )}

            {step === 2 && (
              <div className="stack stack-12">
                <div><h2 style={{ margin: 0, fontSize: 24, letterSpacing: "-.04em" }}>Pick your starting scope</h2><p className="text-mute" style={{ marginTop: 4 }}>Choose what NexEarn should show first.</p></div>
                {[
                  ["Incident command", "Sev routing, timeline, AI RCA, status comms", true],
                  ["CMDB discovery", "Servers, VMs, network, cloud services, ownership", true],
                  ["Runbook automation", "Guarded execution, approvals, success metrics", true],
                ].map(([title, sub, checked]) => (
                  <label key={title} className="row row-12" style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 12, cursor: "pointer" }}>
                    <input type="checkbox" className="checkbox" defaultChecked={checked} />
                    <div><b>{title}</b><div className="text-mute" style={{ fontSize: 12 }}>{sub}</div></div>
                  </label>
                ))}
                <button className="btn primary lg" onClick={() => setStep(3)} style={{ justifyContent: "center" }}>Prepare demo workspace</button>
              </div>
            )}

            {step === 3 && (
              <div className="stack stack-12">
                <div style={{ width: 52, height: 52, borderRadius: 16, display: "grid", placeItems: "center", background: "var(--success-bg)", color: "var(--success)", fontSize: 22 }}><i className="fa-solid fa-check" /></div>
                <div><h2 style={{ margin: 0, fontSize: 24, letterSpacing: "-.04em" }}>Workspace ready</h2><p className="text-mute" style={{ marginTop: 4 }}>Demo data is loaded. You can connect real integrations after exploring.</p></div>
                <div style={{ padding: 14, borderRadius: 14, background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
                  <b>{slug}.nexearn.io</b>
                  <div className="text-mute" style={{ fontSize: 12 }}>6 tenants · 1,056 CIs · 184 runbooks · 23 active incidents</div>
                </div>
                <button className="btn primary lg" onClick={onEnter} style={{ justifyContent: "center" }}>Open workspace <i className="fa-solid fa-arrow-right" /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SignupScreen });
