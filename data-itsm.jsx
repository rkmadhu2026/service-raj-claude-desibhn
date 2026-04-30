// data-itsm.jsx — extended data for ITSM modules

const PROBLEMS = [
  { id: "PRB-3912", title: "Connection pool sizing regression in payments-primary", status: "Root cause analysis", priority: 1, assignee: "u2", linked: 4, created: "14 days ago", age: "14d", impact: "High · Meridian Financial", kb: "KB-2114" },
  { id: "PRB-3908", title: "Intermittent p95 spikes on inventory-service during scale events", status: "Known error", priority: 2, assignee: "u3", linked: 7, created: "28 days ago", age: "28d", impact: "Medium · Meridian Retail", kb: null },
  { id: "PRB-3902", title: "Elastic search shard rebalance causes query timeouts", status: "Resolved", priority: 3, assignee: "u4", linked: 3, created: "6 weeks ago", age: "42d", impact: "Low · internal", kb: "KB-1983" },
  { id: "PRB-3898", title: "Kafka consumer lag on notifications-worker during backfills", status: "Assessment", priority: 2, assignee: "u7", linked: 5, created: "2 months ago", age: "58d", impact: "Medium · cross-tenant", kb: null },
  { id: "PRB-3890", title: "Kubernetes etcd leader elections during network partition", status: "Root cause analysis", priority: 1, assignee: "u8", linked: 2, created: "9 days ago", age: "9d", impact: "High · Acme Subsidiary", kb: null },
  { id: "PRB-3882", title: "Memory leak in auth-svc after 72h uptime", status: "Known error", priority: 2, assignee: "u5", linked: 11, created: "3 months ago", age: "91d", impact: "Medium · all tenants", kb: "KB-2088" },
];

const CHANGES = [
  { id: "CHG-2219", title: "Rollback payments-primary pool config to 200 connections", type: "Emergency", state: "Approved", risk: "Moderate", window: "Now · immediate", assignee: "u1", approvers: 3, approved: 3, tenant: "meridian-fin", service: "payments-primary" },
  { id: "CHG-2218", title: "Upgrade Kubernetes control plane to 1.29 in prod-east", type: "Normal",    state: "CAB review",risk: "High",     window: "Sat Apr 27 · 02:00–04:00 UTC", assignee: "u2", approvers: 5, approved: 3, tenant: "meridian-fin", service: "k8s-control" },
  { id: "CHG-2217", title: "Enable TLS 1.3 on edge load balancers",                    type: "Standard",  state: "Scheduled", risk: "Low",      window: "Tue Apr 30 · 14:00 UTC",        assignee: "u7", approvers: 1, approved: 1, tenant: "meridian-health", service: "edge" },
  { id: "CHG-2216", title: "Deploy feature flag service v2.4",                         type: "Normal",    state: "Implementing", risk: "Moderate", window: "In progress",                 assignee: "u5", approvers: 3, approved: 3, tenant: "meridian-retail", service: "feature-flags" },
  { id: "CHG-2215", title: "Database schema migration for orders table",               type: "Normal",    state: "Draft",     risk: "High",     window: "TBD",                           assignee: "u4", approvers: 0, approved: 0, tenant: "meridian-fin", service: "orders-db" },
  { id: "CHG-2214", title: "Rotate Okta SAML certificate",                             type: "Standard",  state: "Completed", risk: "Low",      window: "Apr 22 · 10:00 UTC",            assignee: "u8", approvers: 1, approved: 1, tenant: "meridian-holdings", service: "sso" },
  { id: "CHG-2213", title: "Update CDN cache invalidation rules",                      type: "Standard",  state: "Completed", risk: "Low",      window: "Apr 21 · 08:30 UTC",            assignee: "u7", approvers: 1, approved: 1, tenant: "meridian-retail", service: "cdn" },
];

const CATALOG_CATEGORIES = [
  { id: "access",    label: "Access & accounts",   icon: "fa-user-lock",       count: 24, color: "#2563eb" },
  { id: "hardware",  label: "Hardware",            icon: "fa-laptop",          count: 18, color: "#8b5cf6" },
  { id: "software",  label: "Software",            icon: "fa-box",             count: 42, color: "#10b981" },
  { id: "dev",       label: "Developer tools",     icon: "fa-code",            count: 31, color: "#f59e0b" },
  { id: "hr",        label: "People & HR",         icon: "fa-users",           count: 16, color: "#ec4899" },
  { id: "finance",   label: "Finance",             icon: "fa-coins",           count: 12, color: "#0891b2" },
  { id: "infra",     label: "Cloud & infra",       icon: "fa-cloud",           count: 28, color: "#6366f1" },
  { id: "security",  label: "Security",            icon: "fa-shield-halved",   count: 19, color: "#ef4444" },
];

const CATALOG_ITEMS = [
  { id: "ci-1",  cat: "access",   title: "New employee onboarding",       desc: "Provisions accounts, laptop, and day-1 software",         sla: "2 days", eta: "Next business day", popular: true,  badge: "Bundle" },
  { id: "ci-2",  cat: "access",   title: "Access request — production",   desc: "Time-bound elevated access with approval workflow",       sla: "1 hour", eta: "Within hour",        popular: true,  badge: "Approval" },
  { id: "ci-3",  cat: "hardware", title: "MacBook Pro 16\"",               desc: "Standard engineering laptop configuration",               sla: "3 days", eta: "2–3 business days",  popular: true },
  { id: "ci-4",  cat: "hardware", title: "External monitor",               desc: "Dell U2723QE · 27\" 4K · USB-C",                           sla: "5 days", eta: "1 week" },
  { id: "ci-5",  cat: "software", title: "Figma — Professional",           desc: "Full design seat with organization access",               sla: "30 min", eta: "Same day",           popular: true,  badge: "SSO" },
  { id: "ci-6",  cat: "software", title: "Adobe Creative Cloud",           desc: "All apps · managed license",                              sla: "1 day",  eta: "Next business day" },
  { id: "ci-7",  cat: "dev",      title: "GitHub org access",              desc: "Join the Meridian GitHub org with team scopes",          sla: "1 hour", eta: "Within hour",        badge: "Auto" },
  { id: "ci-8",  cat: "dev",      title: "AWS sandbox account",            desc: "Personal sandbox with $300 monthly budget",              sla: "4 hours", eta: "Same day",          badge: "Auto" },
  { id: "ci-9",  cat: "infra",    title: "Provision new micro-service",    desc: "Bootstrap repo, CI, k8s namespace, observability",       sla: "1 day",  eta: "Next business day",  badge: "Flow" },
  { id: "ci-10", cat: "infra",    title: "Spin up staging environment",    desc: "Ephemeral per-PR environment with data seed",            sla: "30 min", eta: "Within hour" },
  { id: "ci-11", cat: "hr",       title: "Time off request",               desc: "Vacation, sick, or personal time",                        sla: "1 day",  eta: "Next business day" },
  { id: "ci-12", cat: "security", title: "Report security concern",        desc: "Confidential · routed to security@",                      sla: "30 min", eta: "Immediate",          badge: "Urgent" },
];

const CIS = [
  // Cloud & Applications
  { id: "CI-01", name: "checkout-api",      cls: "Application",    env: "prod", region: "us-east-1", owner: "u1", health: "degraded", deps: 6 },
  { id: "CI-02", name: "payments-primary",  cls: "Database",       env: "prod", region: "us-east-1", owner: "u4", health: "degraded", deps: 2 },
  { id: "CI-03", name: "auth-svc",          cls: "Application",    env: "prod", region: "us-east-1", owner: "u8", health: "healthy",  deps: 4 },
  { id: "CI-04", name: "inventory",         cls: "Application",    env: "prod", region: "us-east-1", owner: "u3", health: "degraded", deps: 9 },
  { id: "CI-05", name: "notifications",     cls: "Application",    env: "prod", region: "us-east-1", owner: "u7", health: "healthy",  deps: 3 },
  { id: "CI-06", name: "warehouse",         cls: "Data store",     env: "prod", region: "us-east-1", owner: "u4", health: "healthy",  deps: 11 },
  { id: "CI-07", name: "edge",              cls: "Load balancer",  env: "prod", region: "global",    owner: "u7", health: "healthy",  deps: 2 },
  { id: "CI-08", name: "k8s-control",       cls: "Platform",       env: "prod", region: "us-west-2", owner: "u2", health: "down",     deps: 0 },
  { id: "CI-09", name: "redis-cache",       cls: "Cache",          env: "prod", region: "us-east-1", owner: "u2", health: "healthy",  deps: 1 },
  { id: "CI-10", name: "kafka-broker",      cls: "Message queue",  env: "prod", region: "us-east-1", owner: "u2", health: "healthy",  deps: 3 },
  { id: "CI-11", name: "stripe-api",        cls: "External SaaS",  env: "prod", region: "global",    owner: null, health: "degraded", deps: 0 },
  { id: "CI-12", name: "datadog",           cls: "External SaaS",  env: "prod", region: "global",    owner: null, health: "healthy",  deps: 0 },
  // On-prem — Firewalls
  { id: "CI-13", name: "FW-CORE-DC1-01",    cls: "Firewall",       env: "prod", region: "dc-mumbai",   owner: "u3", health: "healthy",  deps: 4, vendor: "Palo Alto", model: "PA-5260",   ip: "10.1.0.1",    os: "PAN-OS 11.1.2", serial: "PA-5260-MUM-001" },
  { id: "CI-14", name: "FW-CORE-DC2-01",    cls: "Firewall",       env: "prod", region: "dc-chennai",  owner: "u3", health: "healthy",  deps: 4, vendor: "Palo Alto", model: "PA-5260",   ip: "10.2.0.1",    os: "PAN-OS 11.1.2", serial: "PA-5260-CHN-001" },
  { id: "CI-15", name: "FW-DMZ-DC1-01",     cls: "Firewall",       env: "prod", region: "dc-mumbai",   owner: "u7", health: "warning",  deps: 2, vendor: "Fortinet",  model: "FG-3600E",  ip: "10.1.0.5",    os: "FortiOS 7.4.3",  serial: "FG-3600E-MUM-001" },
  { id: "CI-16", name: "FW-BRANCH-BLR-01",  cls: "Firewall",       env: "prod", region: "branch-blr",  owner: "u3", health: "healthy",  deps: 1, vendor: "Fortinet",  model: "FG-200F",   ip: "172.16.1.1",  os: "FortiOS 7.4.3",  serial: "FG-200F-BLR-001" },
  // On-prem — Switches
  { id: "CI-17", name: "SW-CORE-DC1-01",    cls: "Switch",         env: "prod", region: "dc-mumbai",   owner: "u3", health: "healthy",  deps: 8, vendor: "Cisco",     model: "Nexus 9336C-FX2", ip: "10.1.1.1", os: "NX-OS 10.3(4a)", serial: "N9K-MUM-001" },
  { id: "CI-18", name: "SW-CORE-DC1-02",    cls: "Switch",         env: "prod", region: "dc-mumbai",   owner: "u3", health: "healthy",  deps: 8, vendor: "Cisco",     model: "Nexus 9336C-FX2", ip: "10.1.1.2", os: "NX-OS 10.3(4a)", serial: "N9K-MUM-002" },
  { id: "CI-19", name: "SW-TOR-DC1-R01",    cls: "Switch",         env: "prod", region: "dc-mumbai",   owner: "u3", health: "degraded", deps: 3, vendor: "Arista",    model: "7050X3",          ip: "10.1.2.1", os: "EOS 4.31.1F",    serial: "AR-7050-MUM-001" },
  { id: "CI-20", name: "SW-DIST-DC2-01",    cls: "Switch",         env: "prod", region: "dc-chennai",  owner: "u3", health: "healthy",  deps: 6, vendor: "Cisco",     model: "Catalyst 9500",   ip: "10.2.1.1", os: "IOS-XE 17.12.2", serial: "C9500-CHN-001" },
  // On-prem — Physical servers
  { id: "CI-21", name: "SRV-ESX-DC1-01",    cls: "Physical server", env: "prod", region: "dc-mumbai",  owner: "u2", health: "healthy",  deps: 12, vendor: "Dell",     model: "PowerEdge R760",  ip: "10.1.10.1",  os: "ESXi 8.0 U2",    serial: "DELL-R760-001", cpu: "2x Xeon 8490H", ram: "1024 GB", storage: "24x 1.92TB NVMe" },
  { id: "CI-22", name: "SRV-ESX-DC1-02",    cls: "Physical server", env: "prod", region: "dc-mumbai",  owner: "u2", health: "healthy",  deps: 10, vendor: "Dell",     model: "PowerEdge R760",  ip: "10.1.10.2",  os: "ESXi 8.0 U2",    serial: "DELL-R760-002", cpu: "2x Xeon 8490H", ram: "1024 GB", storage: "24x 1.92TB NVMe" },
  { id: "CI-23", name: "SRV-ESX-DC1-03",    cls: "Physical server", env: "prod", region: "dc-mumbai",  owner: "u2", health: "warning",  deps: 8,  vendor: "HPE",      model: "ProLiant DL380 Gen11", ip: "10.1.10.3", os: "ESXi 8.0 U2", serial: "HPE-DL380-001", cpu: "2x Xeon 6430", ram: "768 GB", storage: "16x 1.92TB SAS" },
  { id: "CI-24", name: "SRV-HCI-DC2-01",    cls: "Physical server", env: "prod", region: "dc-chennai", owner: "u2", health: "healthy",  deps: 6,  vendor: "Dell",     model: "PowerEdge R660",  ip: "10.2.10.1",  os: "Azure Stack HCI 23H2", serial: "DELL-R660-001", cpu: "2x Xeon 8462Y", ram: "512 GB", storage: "12x 3.84TB NVMe" },
  { id: "CI-25", name: "SRV-BARE-DC1-DB01", cls: "Physical server", env: "prod", region: "dc-mumbai",  owner: "u4", health: "healthy",  deps: 3,  vendor: "Dell",     model: "PowerEdge R760",  ip: "10.1.10.10", os: "RHEL 9.3",        serial: "DELL-R760-DB01", cpu: "2x Xeon 8490H", ram: "2048 GB", storage: "24x 3.84TB NVMe" },
  // On-prem — Windows servers
  { id: "CI-26", name: "WIN-AD-DC1-01",     cls: "Windows server",  env: "prod", region: "dc-mumbai",  owner: "u8", health: "healthy",  deps: 14, vendor: "Dell",     model: "PowerEdge R450",  ip: "10.1.20.1",  os: "Windows Server 2022 DC", serial: "DELL-R450-AD01", role: "Active Directory DC" },
  { id: "CI-27", name: "WIN-AD-DC2-01",     cls: "Windows server",  env: "prod", region: "dc-chennai", owner: "u8", health: "healthy",  deps: 14, vendor: "HPE",      model: "ProLiant DL360 Gen11", ip: "10.2.20.1", os: "Windows Server 2022 DC", serial: "HPE-DL360-AD01", role: "Active Directory DC" },
  { id: "CI-28", name: "WIN-SQL-DC1-01",    cls: "Windows server",  env: "prod", region: "dc-mumbai",  owner: "u4", health: "healthy",  deps: 7,  vendor: "Dell",     model: "PowerEdge R760",  ip: "10.1.20.10", os: "Windows Server 2022 · SQL 2022", serial: "DELL-R760-SQL01", role: "SQL Server Always-On Primary" },
  { id: "CI-29", name: "WIN-FILE-DC1-01",   cls: "Windows server",  env: "prod", region: "dc-mumbai",  owner: "u8", health: "warning",  deps: 5,  vendor: "Dell",     model: "PowerEdge R550",  ip: "10.1.20.20", os: "Windows Server 2022 Std", serial: "DELL-R550-FS01", role: "File Server (DFS)" },
  { id: "CI-30", name: "WIN-SCCM-DC1-01",   cls: "Windows server",  env: "prod", region: "dc-mumbai",  owner: "u8", health: "healthy",  deps: 3,  vendor: "Dell",     model: "PowerEdge R550",  ip: "10.1.20.30", os: "Windows Server 2022 Std · MECM", serial: "DELL-R550-SCCM01", role: "SCCM / Endpoint Manager" },
  // On-prem — VMs & Virtual assets
  { id: "CI-31", name: "VM-APP-DC1-WEB01",  cls: "Virtual machine", env: "prod", region: "dc-mumbai",  owner: "u1", health: "healthy",  deps: 4, host: "CI-21", vcpu: 8,  ram: "32 GB",  os: "Ubuntu 22.04 LTS", ip: "10.1.30.1" },
  { id: "CI-32", name: "VM-APP-DC1-WEB02",  cls: "Virtual machine", env: "prod", region: "dc-mumbai",  owner: "u1", health: "healthy",  deps: 4, host: "CI-21", vcpu: 8,  ram: "32 GB",  os: "Ubuntu 22.04 LTS", ip: "10.1.30.2" },
  { id: "CI-33", name: "VM-APP-DC1-API01",  cls: "Virtual machine", env: "prod", region: "dc-mumbai",  owner: "u5", health: "degraded", deps: 6, host: "CI-22", vcpu: 16, ram: "64 GB",  os: "RHEL 9.3",         ip: "10.1.30.10" },
  { id: "CI-34", name: "VM-DB-DC1-PG01",    cls: "Virtual machine", env: "prod", region: "dc-mumbai",  owner: "u4", health: "healthy",  deps: 2, host: "CI-22", vcpu: 32, ram: "128 GB", os: "RHEL 9.3 · PostgreSQL 16", ip: "10.1.30.20" },
  { id: "CI-35", name: "VM-MON-DC1-01",     cls: "Virtual machine", env: "prod", region: "dc-mumbai",  owner: "u2", health: "healthy",  deps: 1, host: "CI-23", vcpu: 8,  ram: "32 GB",  os: "Ubuntu 22.04 · Prometheus", ip: "10.1.30.30" },
  { id: "CI-36", name: "VM-LOG-DC1-01",     cls: "Virtual machine", env: "prod", region: "dc-mumbai",  owner: "u2", health: "healthy",  deps: 1, host: "CI-23", vcpu: 16, ram: "64 GB",  os: "Ubuntu 22.04 · ELK Stack",  ip: "10.1.30.31" },
  // On-prem — Exporters & monitoring agents
  { id: "CI-37", name: "node-exporter-dc1", cls: "Exporter",        env: "prod", region: "dc-mumbai",  owner: "u2", health: "healthy",  deps: 0, type: "node_exporter",     port: 9100, targets: 14 },
  { id: "CI-38", name: "snmp-exporter-dc1", cls: "Exporter",        env: "prod", region: "dc-mumbai",  owner: "u3", health: "healthy",  deps: 0, type: "snmp_exporter",     port: 9116, targets: 12 },
  { id: "CI-39", name: "wmi-exporter-dc1",  cls: "Exporter",        env: "prod", region: "dc-mumbai",  owner: "u8", health: "warning",  deps: 0, type: "windows_exporter",  port: 9182, targets: 5 },
  { id: "CI-40", name: "blackbox-exp-dc1",  cls: "Exporter",        env: "prod", region: "dc-mumbai",  owner: "u2", health: "healthy",  deps: 0, type: "blackbox_exporter", port: 9115, targets: 28 },
  { id: "CI-41", name: "vmware-exp-dc1",    cls: "Exporter",        env: "prod", region: "dc-mumbai",  owner: "u2", health: "healthy",  deps: 0, type: "vmware_exporter",   port: 9272, targets: 3 },
  // On-prem — Network infrastructure
  { id: "CI-42", name: "RTR-CORE-DC1-01",   cls: "Router",          env: "prod", region: "dc-mumbai",  owner: "u3", health: "healthy",  deps: 4, vendor: "Cisco",    model: "ASR 9901",     ip: "10.1.0.254", os: "IOS-XR 7.10.1", serial: "ASR-9901-MUM-001" },
  { id: "CI-43", name: "RTR-WAN-DC2-01",    cls: "Router",          env: "prod", region: "dc-chennai", owner: "u3", health: "healthy",  deps: 3, vendor: "Juniper",  model: "MX204",        ip: "10.2.0.254", os: "Junos 23.4R1",  serial: "MX204-CHN-001" },
  { id: "CI-44", name: "LB-F5-DC1-01",      cls: "Load balancer",   env: "prod", region: "dc-mumbai",  owner: "u7", health: "healthy",  deps: 6, vendor: "F5",       model: "BIG-IP i5800", ip: "10.1.3.1",   os: "TMOS 17.1.1",   serial: "F5-i5800-MUM-001" },
  { id: "CI-45", name: "WAP-OFFICE-BLR-01", cls: "Wireless AP",     env: "prod", region: "branch-blr", owner: "u3", health: "healthy",  deps: 0, vendor: "Cisco",    model: "Catalyst 9130AXI", ip: "172.16.2.10", os: "IOS-XE 17.12", serial: "C9130-BLR-001" },
  // Storage
  { id: "CI-46", name: "SAN-DC1-01",        cls: "Storage array",   env: "prod", region: "dc-mumbai",  owner: "u2", health: "healthy",  deps: 4, vendor: "NetApp",   model: "AFF A900",     ip: "10.1.5.1",   os: "ONTAP 9.14.1",  serial: "NTAP-A900-001", capacity: "480 TB", used: "312 TB" },
  { id: "CI-47", name: "SAN-DC2-01",        cls: "Storage array",   env: "prod", region: "dc-chennai", owner: "u2", health: "healthy",  deps: 3, vendor: "Pure",     model: "FlashArray//X70", ip: "10.2.5.1", os: "Purity//FA 6.5", serial: "PURE-X70-001", capacity: "240 TB", used: "168 TB" },
  { id: "CI-48", name: "BACKUP-DC1-01",     cls: "Backup appliance",env: "prod", region: "dc-mumbai",  owner: "u2", health: "healthy",  deps: 2, vendor: "Veeam",    model: "v12 · Dell DR4300", ip: "10.1.5.10", os: "Veeam B&R 12.1", serial: "VEEAM-DR-001" },
];

const ARTICLES = [
  { id: "KB-2114", title: "Runbook: Stripe connection pool exhaustion",        cat: "Runbooks", views: 1283, upd: "2 days ago",   author: "u1", rating: 4.8, tag: "payments" },
  { id: "KB-2113", title: "How to declare and lead a Sev-1 incident",          cat: "Process",  views: 4120, upd: "1 week ago",   author: "u5", rating: 4.9, tag: "incident" },
  { id: "KB-2110", title: "Setting up on-call rotations in NexEarn",         cat: "Onboarding", views: 782, upd: "2 weeks ago", author: "u2", rating: 4.6, tag: "on-call" },
  { id: "KB-2108", title: "Writing effective post-incident reviews",           cat: "Process",  views: 988,  upd: "3 weeks ago",  author: "u5", rating: 4.7, tag: "postmortem" },
  { id: "KB-2104", title: "Database migration playbook — zero-downtime",       cat: "Runbooks", views: 2011, upd: "1 month ago",  author: "u4", rating: 4.9, tag: "database" },
  { id: "KB-2088", title: "Known error: auth-svc memory leak after 72h",       cat: "Known errors", views: 144, upd: "1 month ago", author: "u5", rating: 4.2, tag: "auth" },
  { id: "KB-1983", title: "Elasticsearch shard rebalance tuning",              cat: "Runbooks", views: 312,  upd: "3 months ago", author: "u3", rating: 4.5, tag: "search" },
  { id: "KB-1880", title: "Slack integration — incident channels & bots",      cat: "Onboarding", views: 621, upd: "4 months ago", author: "u8", rating: 4.4, tag: "chatops" },
];

const SLAS = [
  { id: "SLA-01", name: "Sev 1 response",   target: "5 min",   window: "24×7",      breach: 2, compliance: 94.2 },
  { id: "SLA-02", name: "Sev 1 resolution", target: "1 hour",  window: "24×7",      breach: 4, compliance: 88.6 },
  { id: "SLA-03", name: "Sev 2 response",   target: "15 min",  window: "24×7",      breach: 1, compliance: 97.4 },
  { id: "SLA-04", name: "Sev 2 resolution", target: "4 hours", window: "24×7",      breach: 3, compliance: 92.1 },
  { id: "SLA-05", name: "Sev 3 resolution", target: "1 day",   window: "business",  breach: 0, compliance: 99.0 },
  { id: "SLA-06", name: "Change approval",  target: "2 days",  window: "business",  breach: 0, compliance: 98.3 },
  { id: "SLA-07", name: "Access request",   target: "1 hour",  window: "24×7",      breach: 0, compliance: 96.8 },
  { id: "SLA-08", name: "Problem RCA",      target: "5 days",  window: "business",  breach: 1, compliance: 91.4 },
];

Object.assign(window, { PROBLEMS, CHANGES, CATALOG_CATEGORIES, CATALOG_ITEMS, CIS, ARTICLES, SLAS });
