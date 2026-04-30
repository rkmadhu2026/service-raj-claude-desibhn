// Knowledge base

function KnowledgeScreen({ setRoute }) {
  const [cat, setCat] = React.useState("all");
  const filtered = cat === "all" ? ARTICLES : ARTICLES.filter(a => a.cat.toLowerCase() === cat);
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>Knowledge base</h1>
          <div className="subtitle">{ARTICLES.length * 12} articles · {ARTICLES.filter(a => a.cat === "Runbooks").length * 4} runbooks · AI-assisted authoring</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-robot" /> Generate from incident</button>
          <button className="btn primary"><i className="fa-solid fa-plus" /> New article</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        {[
          { l: "Runbooks",      c: 84, i: "fa-book",     col: "#2563eb", id: "runbooks" },
          { l: "Process",       c: 42, i: "fa-diagram-project", col: "#8b5cf6", id: "process" },
          { l: "Onboarding",    c: 28, i: "fa-door-open", col: "#10b981", id: "onboarding" },
          { l: "Known errors",  c: 12, i: "fa-bug",      col: "#f59e0b", id: "known errors" },
        ].map(x => (
          <div key={x.id} className="card" style={{ padding: 16, cursor: "pointer", borderColor: cat === x.id ? "var(--accent)" : undefined }} onClick={() => setCat(cat === x.id ? "all" : x.id)}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: x.col + "20", color: x.col, display: "grid", placeItems: "center", fontSize: 15, marginBottom: 10 }}><i className={`fa-solid ${x.i}`} /></div>
            <b style={{ fontSize: 14 }}>{x.l}</b>
            <div style={{ fontSize: 11.5, color: "var(--fg-subtle)", marginTop: 2 }}>{x.c} articles</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div className="card">
          <div className="toolbar">
            <input className="filter-input" placeholder="Search articles…" style={{ paddingLeft: 12 }} />
            <div className="spacer" />
            <div className="seg"><button className="active">Most viewed</button><button>Newest</button><button>Top rated</button></div>
          </div>
          <div className="card-body stack stack-10" style={{ padding: 12 }}>
            {filtered.map(a => (
              <div key={a.id} className="card" style={{ padding: 14, cursor: "pointer" }} onClick={() => setRoute("knowledge-article")}>
                <div className="row row-12">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row row-8" style={{ marginBottom: 4 }}>
                      <span className="c-id" style={{ fontSize: 11 }}>{a.id}</span>
                      <Pill kind="neutral" noDot>{a.cat}</Pill>
                      <span className="text-mute" style={{ fontSize: 11 }}>#{a.tag}</span>
                    </div>
                    <b style={{ fontSize: 14, display: "block" }}>{a.title}</b>
                    <div className="row row-12" style={{ marginTop: 8, fontSize: 11.5, color: "var(--fg-subtle)" }}>
                      <UserById id={a.author} />
                      <span>· Updated {a.upd}</span>
                      <span>· <i className="fa-solid fa-eye" /> {a.views.toLocaleString()} views</span>
                      <span>· <i className="fa-solid fa-star" style={{ color: "var(--warning)" }} /> {a.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stack stack-12">
          <div className="ai-card">
            <h4><span className="ai-glyph">✦</span> AI authoring</h4>
            <p>Based on your last 4 resolved incidents, NexEarn can draft 2 new runbooks.</p>
            <button className="btn primary sm" style={{ marginTop: 8 }}>Review drafts</button>
          </div>
          <div className="card">
            <div className="card-head"><h3>Trending tags</h3></div>
            <div className="card-body" style={{ padding: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["payments", "k8s", "incident", "database", "auth", "postmortem", "on-call", "chatops", "cdn", "terraform"].map(t => (
                <span key={t} className="chip" style={{ fontSize: 11 }}>#{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KnowledgeArticleScreen({ setRoute }) {
  const a = ARTICLES[0];
  return (
    <div className="page page-fade" style={{ maxWidth: 900, margin: "0 auto" }}>
      <div className="page-head">
        <div className="page-actions" style={{ marginLeft: "auto" }}>
          <button className="btn" onClick={() => setRoute("knowledge")}>← Back</button>
          <button className="btn"><i className="fa-solid fa-share" /> Share</button>
          <button className="btn"><i className="fa-solid fa-pen" /> Edit</button>
        </div>
      </div>
      <div className="card">
        <div className="card-body" style={{ padding: "32px 40px" }}>
          <div className="row row-8" style={{ marginBottom: 10 }}>
            <span className="c-id">{a.id}</span>
            <Pill kind="info" noDot>{a.cat}</Pill>
            <Pill kind="success">Published</Pill>
          </div>
          <h1 style={{ fontSize: 28, marginBottom: 12, letterSpacing: "-0.02em" }}>{a.title}</h1>
          <div className="row row-12" style={{ marginBottom: 24, fontSize: 12, color: "var(--fg-subtle)", paddingBottom: 16, borderBottom: "1px solid var(--border-subtle)" }}>
            <UserById id={a.author} />
            <span>· Updated {a.upd}</span>
            <span>· <i className="fa-solid fa-eye" /> {a.views.toLocaleString()}</span>
            <span>· <i className="fa-solid fa-star" style={{ color: "var(--warning)" }} /> {a.rating} ({Math.floor(a.views / 23)} ratings)</span>
          </div>

          <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--fg)" }}>
            <h3 style={{ fontSize: 16, margin: "20px 0 8px" }}>Symptoms</h3>
            <p>Elevated 5xx response rate on <code style={{ background: "var(--bg-muted)", padding: "1px 6px", borderRadius: 3, fontSize: 13 }}>checkout-api</code>, correlated with timeouts against Stripe. p95 latency climbs above 5s, error rate exceeds 10%.</p>

            <h3 style={{ fontSize: 16, margin: "20px 0 8px" }}>Cause</h3>
            <p>The most common trigger is exhaustion of the database connection pool on <code style={{ background: "var(--bg-muted)", padding: "1px 6px", borderRadius: 3, fontSize: 13 }}>payments-primary</code>. This leaves checkout-api workers blocked on DB acquisition, which in turn exhausts Stripe HTTP client pools.</p>

            <h3 style={{ fontSize: 16, margin: "20px 0 8px" }}>Resolution</h3>
            <ol style={{ paddingLeft: 22 }}>
              <li>Confirm the incident hypothesis using the <span className="link">payments-primary connection pool dashboard</span>.</li>
              <li>If pool utilization is at 100%, execute runbook <span className="link">pool-expansion-v3</span> to scale to 200.</li>
              <li>Roll back any deploy in the last 2 hours that touched pool configuration.</li>
              <li>Monitor for 10 minutes; if recovery holds, update status page.</li>
            </ol>

            <div style={{ background: "var(--bg-muted)", borderLeft: "3px solid var(--accent)", padding: "12px 16px", borderRadius: 6, margin: "20px 0", fontSize: 13 }}>
              <b>⚡ Tip</b> · NexEarn can auto-execute step 2 when this runbook is tagged on an active incident.
            </div>

            <h3 style={{ fontSize: 16, margin: "20px 0 8px" }}>Related</h3>
            <ul style={{ paddingLeft: 22 }}>
              <li><span className="link">KB-2113</span> — How to declare and lead a Sev-1 incident</li>
              <li><span className="link">PRB-3912</span> — Connection pool sizing regression</li>
              <li><span className="link">Runbook: pool-expansion-v3</span></li>
            </ul>
          </div>

          <div style={{ marginTop: 32, padding: "16px 20px", background: "var(--bg-muted)", borderRadius: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Was this helpful?</span>
            <button className="btn sm"><i className="fa-solid fa-thumbs-up" /> Yes</button>
            <button className="btn sm"><i className="fa-solid fa-thumbs-down" /> No</button>
            <div className="spacer" />
            <span className="text-mute" style={{ fontSize: 11 }}>96% found this helpful · 184 ratings</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { KnowledgeScreen, KnowledgeArticleScreen });
