// data.jsx — mock data for the NexEarn platform prototype
// Enterprise multi-tenant hierarchy: parent org → business units → sub-tenants

const ORG = {
  name: "Meridian Holdings",
  slug: "meridian",
  plan: "Enterprise Plus",
  seatsUsed: 1247,
  seatsTotal: 2000,
};

const TENANTS = [
  { id: "meridian-fin",     name: "Meridian Financial",  parent: "meridian", code: "MF", color: "amber",  users: 412, incidents: 23, sev1: 1, health: 94, mttr: 18,  spend: 48200, plan: "Enterprise" },
  { id: "meridian-health",  name: "Meridian Health",     parent: "meridian", code: "MH", color: "teal",   users: 286, incidents: 14, sev1: 0, health: 98, mttr: 12,  spend: 32100, plan: "Enterprise" },
  { id: "meridian-retail",  name: "Meridian Retail",     parent: "meridian", code: "MR", color: "pink",   users: 198, incidents: 31, sev1: 2, health: 82, mttr: 42,  spend: 28900, plan: "Business" },
  { id: "meridian-logix",   name: "Meridian Logix",      parent: "meridian", code: "ML", color: "purple", users: 94,  incidents: 9,  sev1: 0, health: 96, mttr: 22,  spend: 14600, plan: "Business" },
  { id: "meridian-labs",    name: "Meridian Labs",       parent: "meridian", code: "MX", color: "slate",  users: 38,  incidents: 4,  sev1: 0, health: 99, mttr: 8,   spend: 6400,  plan: "Growth" },
  { id: "acme-subsidiary",  name: "Acme Subsidiary",     parent: "meridian", code: "AC", color: "green",  users: 219, incidents: 18, sev1: 1, health: 88, mttr: 31,  spend: 22800, plan: "Business" },
];

const USERS = [
  { id: "u1",  name: "Priya Raghunathan",  email: "priya.r@meridian.io",     role: "Incident Commander", team: "SRE Platform",  color: "amber",  status: "online",   last: "now" },
  { id: "u2",  name: "Marcus Okafor",      email: "marcus.o@meridian.io",    role: "Admin",              team: "Platform",      color: "purple", status: "online",   last: "2m" },
  { id: "u3",  name: "Yuki Tanaka",        email: "yuki.t@meridian.io",      role: "Responder",          team: "Networking",    color: "teal",   status: "online",   last: "now" },
  { id: "u4",  name: "Elena Kowalski",     email: "elena.k@meridian.io",     role: "Responder",          team: "Database",      color: "pink",   status: "away",     last: "14m" },
  { id: "u5",  name: "Devon Hassan",       email: "devon.h@meridian.io",     role: "Manager",            team: "SRE Platform",  color: "green",  status: "online",   last: "5m" },
  { id: "u6",  name: "Sasha Volkov",       email: "sasha.v@meridian.io",     role: "Viewer",             team: "Finance Ops",   color: "slate",  status: "offline",  last: "1d" },
  { id: "u7",  name: "Jamal Washington",   email: "jamal.w@meridian.io",     role: "Responder",          team: "Security",      color: "slate",  status: "online",   last: "1m" },
  { id: "u8",  name: "Noor Rahimi",        email: "noor.r@meridian.io",      role: "Admin",              team: "Platform",      color: "amber",  status: "online",   last: "now" },
];

const INCIDENTS = [
  { id: "INC-48291", sev: 1, title: "Payment gateway timeouts — Stripe connection pool exhausted", service: "checkout-api", tenant: "meridian-fin",    assignee: "u1", status: "active",     age: "14m", sla: 0.32, sloBurn: 8.4, impacted: "12,400 users", client: "Meridian Financial — Retail Banking", application: "Consumer Checkout", asset: { name: "payments-primary-db-01", type: "PostgreSQL cluster", host: "payments-primary-db-01.prod.mf.internal", ip: "10.42.18.103", serial: "AWS vol vol-0f8c2d91", role: "Primary writer", env: "production" } },
  { id: "INC-48290", sev: 2, title: "Elevated 5xx on inventory-service, us-east-1 AZ-b",              service: "inventory",   tenant: "meridian-retail", assignee: "u3", status: "active",     age: "42m", sla: 0.68, sloBurn: 3.2, impacted: "3 regions", client: "Meridian Retail — Omnichannel", application: "Inventory & Availability API", asset: { name: "inv-svc-pool-azb", type: "Kubernetes deployment", cluster: "retail-prod-use1", host: "10.100.44.0/24", role: "Workload replicas", env: "production" } },
  { id: "INC-48289", sev: 3, title: "Slow queries against analytics_events warehouse",                service: "warehouse",   tenant: "meridian-fin",    assignee: "u4", status: "mitigating", age: "1h 12m", sla: 0.85, sloBurn: 1.1, impacted: "internal dashboards", client: "Meridian Financial — Data Platform", application: "Analytics Warehouse", asset: { name: "snowflake.wh.prod", type: "Warehouse", role: "FIN_WH_LARGE", host: "meridian.aws.snowflakecomputing.com", env: "production" } },
  { id: "INC-48288", sev: 2, title: "Auth service CPU saturation during peak window",                 service: "auth-svc",    tenant: "meridian-health", assignee: "u5", status: "active",     age: "2h 4m", sla: 0.45, sloBurn: 4.8, impacted: "all tenants", client: "Meridian Health — Member Portal", application: "SSO & Session Service", asset: { name: "auth-svc-prod-7d4f9", type: "Container / ECS", host: "auth.internal.meridian-health.io", ip: "10.88.12.44", serial: "task-def:rev 184", role: "API service", env: "production" } },
  { id: "INC-48286", sev: 4, title: "Flaky CI runs on deployment pipeline #darwin",                   service: "ci-pipeline", tenant: "meridian-labs",   assignee: "u2", status: "investigating", age: "3h 18m", sla: 0.92, sloBurn: 0.4, impacted: "internal", client: "Meridian Labs — R&D", application: "Build & Release (Darwin)", asset: { name: "gha-runner-macos-12", type: "CI runner host", host: "runner-labs-12.internal", serial: "C7H2-KK91", role: "GitHub Actions", env: "labs" } },
  { id: "INC-48282", sev: 3, title: "Queue backlog on notifications-worker exceeding threshold",      service: "notifications", tenant: "meridian-retail", assignee: "u7", status: "mitigating", age: "4h 52m", sla: 0.71, sloBurn: 1.8, impacted: "email delivery delayed", client: "Meridian Retail — Marketing Ops", application: "Customer Notifications", asset: { name: "notif-worker-amd-3", type: "VM", host: "notif-worker-03.retail.internal", ip: "172.20.8.91", role: "SQS consumer", env: "production" } },
  { id: "INC-48279", sev: 1, title: "Kubernetes control plane unreachable — cluster prod-west",       service: "k8s-control",  tenant: "acme-subsidiary", assignee: "u8", status: "active",     age: "6m", sla: 0.18, sloBurn: 12.2, impacted: "deployment blocked", client: "Acme Subsidiary — Platform", application: "Shared Kubernetes (prod-west)", asset: { name: "prod-west-api-lb", type: "Load balancer / control endpoint", host: "k8s-api.prod-west.acme.internal", ip: "10.50.0.1", role: "Regional control plane", env: "production" } },
  { id: "INC-48276", sev: 4, title: "Certificate expiring in 7 days on api.meridian-logix.com",        service: "edge",        tenant: "meridian-logix",  assignee: null, status: "open",       age: "12h", sla: 0.95, sloBurn: 0.0, impacted: "proactive", client: "Meridian Logix — Logistics API", application: "Public API Gateway", asset: { name: "cf-cert-api-meridian-logix", type: "TLS certificate", host: "api.meridian-logix.com", role: "Edge / Cloudflare", env: "production" } },
];

const TIMELINE_EVENTS = [
  { t: "14:32:08", type: "critical", body: <>PagerDuty escalation triggered — <b>Sev 1</b> declared automatically by alert rule <code>stripe_timeout_rate &gt; 5%</code></>, meta: ["Alert rule", "auto"] },
  { t: "14:32:14", type: "ai",      body: <><b>NexEarn AI</b> correlated 3 related signals: increased DB CPU on <code>payments-primary</code>, GC pauses on <code>checkout-api</code>, and inbound rate limit on Stripe webhook. Likely root cause: <b>connection pool exhaustion</b>.</>, meta: ["Confidence 87%", "2 runbooks suggested"] },
  { t: "14:32:30", type: "info",    body: <>Priya Raghunathan joined as <b>Incident Commander</b></>, meta: ["SRE Platform"] },
  { t: "14:34:02", type: "info",    body: <>Bridge opened in #inc-48291-war-room · Zoom bridge auto-provisioned</>, meta: ["Slack", "Zoom"] },
  { t: "14:35:47", type: "warn",    body: <>Auto-scaled <code>checkout-api</code> from 12 → 24 replicas via runbook <i>pool-expansion-v3</i></>, meta: ["runbook", "Kubernetes"] },
  { t: "14:38:15", type: "info",    body: <>Status page updated: "Investigating elevated payment failures"</>, meta: ["statuspage.io", "public"] },
  { t: "14:41:09", type: "success", body: <>p95 latency on <code>checkout-api</code> dropped from 8.4s → 420ms</>, meta: ["Datadog metric"] },
  { t: "14:42:50", type: "ai",      body: <><b>NexEarn AI</b> recommends creating a problem record to track the underlying pool-sizing regression.</>, meta: ["Suggestion"] },
];

const CHAT = [
  { u: "u1", role: "IC",        time: "14:33", text: "Taking IC. Can someone grab the last deploy diff for checkout-api?" },
  { u: "u3", role: "Responder", time: "14:34", text: "On it. Looking at commits since 12:00 UTC." },
  { u: "u5", role: "Manager",   time: "14:35", text: "FYI exec comms — Meridian Financial finance team pinged. I'll handle stakeholder updates." },
  { ai: true,                   time: "14:36", text: "Pool size on payments-primary was reduced from 200 → 120 in deploy `2f8a1c` at 12:47 UTC. High likelihood this is the trigger. Rollback suggested." },
  { u: "u3", role: "Responder", time: "14:37", text: "Confirmed — rolling back now via argo-rollbacks." },
  { u: "u1", role: "IC",        time: "14:39", text: "Status page updated. Let's wait 3m and see if errors drop." },
];

const SERVICES = [
  { name: "checkout-api",    status: "degraded",  uptime: 98.4, p95: "420ms", err: 2.1, deps: 6,  tier: "Tier 0", squad: "SRE Platform",    units: ["meridian-fin"],           summary: "Consumer checkout and payment edge APIs." },
  { name: "auth-svc",        status: "healthy",   uptime: 99.95, p95: "82ms",  err: 0.04, deps: 4, tier: "Tier 0", squad: "Platform Identity", units: ["meridian-health", "meridian-fin", "meridian-retail", "acme-subsidiary"], summary: "SSO, tokens, and session management." },
  { name: "inventory",       status: "degraded",  uptime: 99.1, p95: "1.2s",  err: 0.8,  deps: 9, tier: "Tier 1", squad: "Retail Eng",        units: ["meridian-retail"],        summary: "Stock, reservations, and availability." },
  { name: "notifications",   status: "healthy",   uptime: 99.8, p95: "210ms", err: 0.12, deps: 3, tier: "Tier 1", squad: "Retail Eng",        units: ["meridian-retail"],        summary: "Email, SMS, and push fan-out workers." },
  { name: "warehouse",       status: "healthy",   uptime: 99.99, p95: "4.1s", err: 0.0,  deps: 11, tier: "Tier 1", squad: "Data Platform",     units: ["meridian-fin"],           summary: "Analytics warehouse and batch exports." },
  { name: "edge",            status: "healthy",   uptime: 100,  p95: "24ms",  err: 0.0,  deps: 2, tier: "Tier 0", squad: "Edge & Network",    units: ["meridian-logix", "meridian-fin"], summary: "CDN, WAF, and public ingress." },
  { name: "k8s-control",     status: "down",      uptime: 97.2, p95: "—",     err: 100,  deps: 0, tier: "Tier 0", squad: "Platform K8s",      units: ["acme-subsidiary"],      summary: "Regional Kubernetes control plane." },
  { name: "payments-primary",status: "degraded",  uptime: 99.2, p95: "2.4s",  err: 1.4,  deps: 2, tier: "Tier 0", squad: "SRE Platform",    units: ["meridian-fin"],           summary: "Core payment orchestration and ledger connectors." },
  { name: "ci-pipeline",     status: "healthy",   uptime: 99.4, p95: "890ms", err: 0.2,  deps: 5, tier: "Tier 2", squad: "Labs Platform",     units: ["meridian-labs"],          summary: "CI runners, build queues, and artifact promotion." },
];

const INTEGRATIONS = [
  { name: "Slack",       icon: "fa-brands fa-slack",     connected: true },
  { name: "PagerDuty",   icon: "fa-solid fa-bell",       connected: true },
  { name: "Datadog",     icon: "fa-solid fa-dog",        connected: true },
  { name: "GitHub",      icon: "fa-brands fa-github",    connected: true },
  { name: "Jira",        icon: "fa-brands fa-jira",      connected: true },
  { name: "AWS",         icon: "fa-brands fa-aws",       connected: true },
  { name: "Azure",       icon: "fa-brands fa-microsoft", connected: false },
  { name: "GCP",         icon: "fa-brands fa-google",    connected: false },
  { name: "Okta",        icon: "fa-solid fa-key",        connected: true },
  { name: "Zoom",        icon: "fa-solid fa-video",      connected: true },
  { name: "Terraform",   icon: "fa-solid fa-cube",       connected: true },
  { name: "Salesforce",  icon: "fa-solid fa-cloud",      connected: false },
];

// Sparkline data (24 points)
const spark = (seed, trend = 0) => {
  const out = [];
  let v = 50 + (seed % 30);
  for (let i = 0; i < 24; i++) {
    v += (Math.sin(seed + i * 0.6) * 8) + trend * (i / 24) * 20 + ((seed * (i+1)) % 7) - 3;
    out.push(Math.max(4, Math.min(96, v)));
  }
  return out;
};

Object.assign(window, { ORG, TENANTS, USERS, INCIDENTS, TIMELINE_EVENTS, CHAT, SERVICES, INTEGRATIONS, spark });
