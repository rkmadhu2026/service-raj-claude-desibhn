// app.jsx — root component, routing, tweaks

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [authed, setAuthed] = React.useState(false);
  const [publicScreen, setPublicScreen] = React.useState("landing");
  const [route, setRoute] = React.useState("dashboard");
  const [tenant, setTenant] = React.useState(TENANTS[0]);
  const [incidentDetailId, setIncidentDetailId] = React.useState(INCIDENTS[0].id);
  const [switcher, setSwitcher] = React.useState(false);

  const openIncidentDetail = React.useCallback((id) => {
    setIncidentDetailId(id);
    setRoute("incident-detail");
  }, []);

  const openDefaultActiveSev1 = React.useCallback(() => {
    const sev1 = INCIDENTS.find(i => i.sev === 1 && i.status === "active");
    openIncidentDetail(sev1 ? sev1.id : INCIDENTS[0].id);
  }, [openIncidentDetail]);

  const tryLogout = async () => {
    if (window.NexApi) await window.NexApi.logout().catch(() => {});
    setAuthed(false);
  };

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!window.NexApi) return;
      const me = await window.NexApi.bootstrapSession();
      if (!cancelled && me) {
        setAuthed(true);
        setRoute("dashboard");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    const h = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setSwitcher(true); }
      if (e.key === "Escape") setSwitcher(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // Derive the document theme attributes from tweaks
  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
    document.body.setAttribute("data-theme", t.dark ? "dark" : "light");
    document.body.setAttribute("data-density", t.density);
    document.body.setAttribute("data-sidebar", t.sidebarStyle);
    document.body.style.fontSize = t.fontSize + "px";
  }, [t.accent, t.dark, t.density, t.sidebarStyle, t.fontSize]);

  const enterWorkspace = () => {
    setAuthed(true);
    setRoute("dashboard");
  };

  if (!authed) {
    return <>
      {publicScreen === "landing" && <LandingScreen onSignIn={() => setPublicScreen("login")} onStartTrial={() => setPublicScreen("signup")} />}
      {publicScreen === "login" && (
        <LoginScreen
          onEnter={enterWorkspace}
          onBack={() => setPublicScreen("landing")}
          onStartTrial={() => setPublicScreen("signup")}
        />
      )}
      {publicScreen === "signup" && <SignupScreen onEnter={enterWorkspace} onSignIn={() => setPublicScreen("login")} onBack={() => setPublicScreen("landing")} />}
      <AppTweaks t={t} setTweak={setTweak} setRoute={() => {}} />
    </>;
  }

  const noChrome = route === "onboarding";

  return (
    <>
      <div className={`app${noChrome ? " no-chrome" : ""}`}>
        {!noChrome && <Sidebar route={route} setRoute={setRoute} setSwitcher={setSwitcher} tenant={tenant} />}
        {!noChrome && <Header route={route} setRoute={setRoute} setSwitcher={setSwitcher} tenant={tenant} onCmd={() => setSwitcher(true)} incidentDetailId={incidentDetailId} onOpenActiveSev1={openDefaultActiveSev1} />}
        <main className="main">
          {route === "dashboard"       && <DashboardScreen tenant={tenant} setRoute={setRoute} showSparklines={t.showSparklines} openIncidentDetail={openIncidentDetail} />}
          {route === "incidents"       && <IncidentsScreen tenant={tenant} setRoute={setRoute} openIncidentDetail={openIncidentDetail} />}
          {route === "incident-detail" && <IncidentDetailScreen setRoute={setRoute} layout={t.incidentLayout} incidentId={incidentDetailId} />}
          {route === "cross-tenant"    && <CrossTenantScreen setRoute={setRoute} setTenant={setTenant} openIncidentDetail={openIncidentDetail} />}
          {route === "admin-tenants"   && <AdminTenantsScreen setRoute={setRoute} setTenant={setTenant} />}
          {route === "admin-billing"   && <AdminBillingScreen />}
          {route === "admin-usage"     && <AdminUsageScreen />}
          {route === "onboarding"      && <OnboardingScreen setRoute={setRoute} />}
          {route === "settings"        && <SettingsScreen tenant={tenant} />}
          {route === "users"           && <UsersScreen tenant={tenant} />}
          {route === "services"        && <ServicesScreen tenant={tenant} setRoute={setRoute} openIncidentDetail={openIncidentDetail} />}
          {route === "runbooks"        && <RunbooksScreen setRoute={setRoute} />}
          {route === "integrations"    && <IntegrationsScreen />}
          {route === "problems"        && <ProblemsScreen setRoute={setRoute} />}
          {route === "problem-detail"  && <ProblemDetailScreen setRoute={setRoute} />}
          {route === "changes"         && <ChangesScreen setRoute={setRoute} />}
          {route === "change-detail"   && <ChangeDetailScreen setRoute={setRoute} />}
          {route === "catalog"         && <CatalogScreen setRoute={setRoute} />}
          {route === "catalog-request" && <CatalogRequestScreen setRoute={setRoute} />}
          {route === "cmdb"            && <CMDBScreen />}
          {route === "knowledge"       && <KnowledgeScreen setRoute={setRoute} />}
          {route === "knowledge-article" && <KnowledgeArticleScreen setRoute={setRoute} />}
          {route === "flow"            && <FlowScreen />}
          {route === "reports"         && <ReportsScreen />}
          {route === "slas"            && <SLAScreen />}
        </main>
      </div>
      <TenantSwitcher open={switcher} onClose={() => setSwitcher(false)} tenant={tenant} setTenant={setTenant} setRoute={setRoute} />
      <AppTweaks t={t} setTweak={setTweak} setRoute={setRoute} onLogout={tryLogout} openActiveSev1Incident={openDefaultActiveSev1} />
    </>
  );
}

function AppTweaks({ t, setTweak, setRoute, onLogout, openActiveSev1Incident }) {
  return (
    <TweaksPanel>
      <TweakSection label="Jump to screen" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
        {[
          ["Login", () => { if (onLogout) onLogout(); }],
          ["Dashboard", () => setRoute("dashboard")],
          ["Incidents", () => setRoute("incidents")],
          ["Sev-1 detail", () => (openActiveSev1Incident ? openActiveSev1Incident() : setRoute("incident-detail"))],
          ["Services", () => setRoute("services")],
          ["Problems", () => setRoute("problems")],
          ["Problem detail", () => setRoute("problem-detail")],
          ["Changes", () => setRoute("changes")],
          ["CAB change detail", () => setRoute("change-detail")],
          ["Service catalog", () => setRoute("catalog")],
          ["Catalog request", () => setRoute("catalog-request")],
          ["CMDB", () => setRoute("cmdb")],
          ["Knowledge base", () => setRoute("knowledge")],
          ["KB article", () => setRoute("knowledge-article")],
          ["Flow Designer", () => setRoute("flow")],
          ["Reports", () => setRoute("reports")],
          ["SLA definitions", () => setRoute("slas")],
          ["Cross-tenant", () => setRoute("cross-tenant")],
          ["Admin: Tenants", () => setRoute("admin-tenants")],
          ["Admin: Billing", () => setRoute("admin-billing")],
          ["Admin: Usage", () => setRoute("admin-usage")],
          ["Onboarding", () => setRoute("onboarding")],
          ["Settings", () => setRoute("settings")],
          ["People", () => setRoute("users")],
          ["Integrations", () => setRoute("integrations")],
        ].map(([label, fn]) => (
          <button key={label} className="twk-btn" onClick={fn} style={{ padding: "5px 8px", fontSize: 11, border: ".5px solid rgba(0,0,0,.1)", background: "rgba(255,255,255,.6)", borderRadius: 6, cursor: "pointer" }}>{label}</button>
        ))}
      </div>

      <TweakSection label="Theme" />
      <TweakColor label="Accent" value={t.accent} onChange={v => setTweak("accent", v)} />
      <TweakToggle label="Dark mode" value={t.dark} onChange={v => setTweak("dark", v)} />
      <TweakRadio label="Sidebar" value={t.sidebarStyle} options={["navy", "light"]} onChange={v => setTweak("sidebarStyle", v)} />

      <TweakSection label="Density" />
      <TweakRadio label="Density" value={t.density} options={["compact", "regular", "comfy"]} onChange={v => setTweak("density", v)} />
      <TweakSlider label="Font size" value={t.fontSize} min={11} max={15} unit="px" onChange={v => setTweak("fontSize", v)} />

      <TweakSection label="Components" />
      <TweakToggle label="KPI sparklines" value={t.showSparklines} onChange={v => setTweak("showSparklines", v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
