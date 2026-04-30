// Users & roles

function UsersScreen({ tenant }) {
  return (
    <div className="page page-fade wide">
      <div className="page-head">
        <div className="page-title">
          <h1>People & roles</h1>
          <div className="subtitle">{tenant.name} · {USERS.length * 52} users · 8 roles</div>
        </div>
        <div className="page-actions">
          <button className="btn"><i className="fa-solid fa-user-gear" /> Role matrix</button>
          <button className="btn primary"><i className="fa-solid fa-user-plus" /> Invite people</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        <div className="card"><div className="kpi"><div className="kpi-label">Total users</div><div className="kpi-value">{USERS.length * 52}</div><div className="kpi-delta up">+12 this month</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">On-call now</div><div className="kpi-value">14</div><div className="kpi-delta neutral">3 teams rotating</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Admins</div><div className="kpi-value">8</div><div className="kpi-delta neutral">Audit via SSO</div></div></div>
        <div className="card"><div className="kpi"><div className="kpi-label">Pending invites</div><div className="kpi-value">3</div><div className="kpi-delta neutral">Expires in 7 days</div></div></div>
      </div>

      <div className="card">
        <div className="toolbar">
          <input className="filter-input" placeholder="Search people…" style={{ paddingLeft: 12 }} />
          <span className="chip">+ Role</span>
          <span className="chip">+ Team</span>
          <span className="chip">+ Status</span>
          <div className="spacer" />
          <div className="seg"><button className="active">All</button><button>Admins</button><button>Responders</button><button>Viewers</button></div>
        </div>
        <div className="card-body flush">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 36 }}><input type="checkbox" className="checkbox" /></th>
                <th>User</th>
                <th>Role</th>
                <th>Team</th>
                <th>On-call</th>
                <th>Auth</th>
                <th>Last active</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id}>
                  <td><input type="checkbox" className="checkbox" /></td>
                  <td>
                    <div className="row row-12">
                      <Avatar name={u.name} color={u.color} />
                      <div><b style={{ fontSize: 13 }}>{u.name}</b><div style={{ fontSize: 11, color: "var(--fg-subtle)" }}>{u.email}</div></div>
                    </div>
                  </td>
                  <td><Pill kind={u.role === "Admin" ? "purple" : u.role === "Incident Commander" ? "critical" : u.role === "Manager" ? "info" : u.role === "Viewer" ? "neutral" : "success"} noDot>{u.role}</Pill></td>
                  <td style={{ fontSize: 12.5 }}>{u.team}</td>
                  <td>{(u.role === "Incident Commander" || u.role === "Responder") ? <Pill kind="info" noDot>Rotating</Pill> : <span className="text-faint">—</span>}</td>
                  <td><Pill kind="neutral" noDot><i className="fa-solid fa-key" style={{ marginRight: 4 }} />SSO</Pill></td>
                  <td className="text-mute" style={{ fontSize: 12 }}>{u.last}</td>
                  <td><Pill kind={u.status === "online" ? "success" : u.status === "away" ? "warning" : "neutral"}>{u.status}</Pill></td>
                  <td><button className="icon-btn"><i className="fa-solid fa-ellipsis" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { UsersScreen });
