// Login — SSO (prototype) + email/password (FastAPI at same origin)
function LoginScreen({ onEnter, onBack, onStartTrial }) {
  const [email, setEmail] = React.useState("solo@nexearn.demo");
  const [password, setPassword] = React.useState("solo-demo!");
  const [step, setStep] = React.useState("choose");
  const [apiErr, setApiErr] = React.useState("");
  const [apiLoading, setApiLoading] = React.useState(false);
  const continueToVerify = () => setStep("verify");

  const canUseApi = typeof window.NexApi !== "undefined";
  const signInWithPassword = async (e) => {
    e.preventDefault();
    setApiErr("");
    if (!canUseApi) {
      setApiErr("Load the app from the API server (e.g. python ./backend/run-dev.sh) for password login.");
      return;
    }
    setApiLoading(true);
    try {
      await window.NexApi.loginWithPassword(email.trim(), password);
      onEnter();
    } catch (err) {
      setApiErr(String(err.message || err));
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-side">
        <div className="auth-logo">
          <div className="logo-mark">N</div>
          <span>NexEarn</span>
        </div>
        <div className="auth-pitch">
          <h2>The incident platform that <span className="highlight">resolves itself</span> before you&apos;ve finished reading the alert.</h2>
          <p>Detect, triage, respond and learn — in one pane, across every business unit. Multi-tenant from day zero. Trusted by teams who can&apos;t afford to page twice.</p>
          <div className="auth-stats">
            <div><b>4.2m</b><span>Incidents triaged / yr</span></div>
            <div><b>62%</b><span>Faster MTTR</span></div>
            <div><b>99.99%</b><span>Platform uptime</span></div>
          </div>
        </div>
      </div>
      <div className="auth-form">
        <div className="auth-form-inner">
          {onBack && <button className="btn sm ghost" onClick={onBack} style={{ marginBottom: 16 }}>← Back to landing</button>}
          {step === "choose" ? (
            <>
              <h1>Sign in to your workspace</h1>
              <p className="sub">Use your corporate SSO — we&apos;ll route you to the right business unit.</p>
              <button className="sso-btn" onClick={continueToVerify}><i className="fa-solid fa-key" style={{ color: "#007dc1" }} /> Continue with Okta</button>
              <button className="sso-btn" onClick={continueToVerify}><i className="fa-brands fa-microsoft" style={{ color: "#00a4ef" }} /> Microsoft Entra ID</button>
              <button className="sso-btn" onClick={continueToVerify}><i className="fa-brands fa-google" style={{ color: "#4285f4" }} /> Google Workspace</button>
              <button className="sso-btn" onClick={continueToVerify}><i className="fa-solid fa-shield-halved" style={{ color: "#64748b" }} /> SAML · Custom IdP</button>
              <div className="auth-divider">or with email (API)</div>
              <form onSubmit={signInWithPassword} className="stack stack-10" style={{ marginTop: 4 }}>
                <div className="field">
                  <label>Work email</label>
                  <input className="input" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
                </div>
                <div className="field">
                  <label>Password</label>
                  <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
                </div>
                {apiErr && <div className="text-mute" style={{ color: "var(--critical)", fontSize: 12.5 }}>{apiErr}</div>}
                <button type="submit" className="btn primary lg" style={{ width: "100%", justifyContent: "center" }} disabled={apiLoading}>
                  {apiLoading ? "Signing in…" : "Sign in with password"} <i className="fa-solid fa-arrow-right" style={{ marginLeft: 6 }} />
                </button>
                <p className="text-mute" style={{ fontSize: 11, margin: 0 }}>
                  Use the <strong>same email and password</strong> as <strong>Sign up</strong> — there are no preset demo accounts unless you create them.
                </p>
              </form>
            </>
          ) : (
            <>
              <div style={{ width: 48, height: 48, borderRadius: 14, display: "grid", placeItems: "center", background: "var(--success-bg)", color: "var(--success)", marginBottom: 16 }}>
                <i className="fa-solid fa-shield-check" />
              </div>
              <h1>Verify trusted session</h1>
              <p className="sub">We found Meridian Holdings for <b>{email}</b>. Complete the sign-in handoff to enter the production workspace.</p>
              <div className="card" style={{ padding: 14, margin: "18px 0", background: "var(--bg-muted)" }}>
                <div className="row row-10">
                  <div style={{ width: 34, height: 34, borderRadius: 8, display: "grid", placeItems: "center", background: "linear-gradient(135deg, var(--blue-500), var(--purple-500))", color: "#fff", fontSize: 11, fontWeight: 800 }}>MH</div>
                  <div style={{ flex: 1 }}>
                    <b>Meridian Holdings</b>
                    <div className="text-mute" style={{ fontSize: 11.5 }}>6 business units · SSO enforced · MFA required</div>
                  </div>
                  <Pill kind="success">Trusted</Pill>
                </div>
              </div>
              <button className="btn primary lg" style={{ width: "100%", justifyContent: "center" }} onClick={onEnter}>Enter workspace <i className="fa-solid fa-arrow-right" style={{ marginLeft: 6 }} /></button>
              <button className="btn lg" style={{ width: "100%", justifyContent: "center", marginTop: 10 }} onClick={() => setStep("choose")}>Use different method</button>
            </>
          )}
          <div style={{ marginTop: 20, fontSize: 11.5, color: "var(--fg-subtle)", textAlign: "center" }}>
            By continuing you agree to NexEarn&apos;s <span className="link">Terms</span> and <span className="link">Privacy Policy</span>.<br/>
            New to NexEarn?{" "}
            <span className="link" onClick={() => (onStartTrial ? onStartTrial() : onEnter())}>Start a free trial →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LoginScreen });
