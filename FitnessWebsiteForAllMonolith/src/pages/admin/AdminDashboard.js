import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../services/api";

export default function AdminDashboard() {
  return (
    <main className="container">
      <h1>Admin Panel</h1>
      <div className="grid grid-2">
        <UsersPanel />
        <ContentPanel />
        <AuditLogsPanel />
        <SettingsPanel />
      </div>
    </main>
  );
}

function UsersPanel() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    AdminAPI.listUsers().then((d) => setItems(d?.results || d || [])).catch(() => {});
  }, []);
  return (
    <section className="card" style={{ padding: "1rem" }} aria-labelledby="admin-users-title">
      <h2 id="admin-users-title">Users</h2>
      <ul>
        {items.map((u) => (
          <li key={u.id} className="card" style={{ margin: ".3rem 0", padding: ".5rem" }}>
            <strong>{u.name || u.email}</strong> — {u.email}
          </li>
        ))}
        {items.length === 0 && <li>No users.</li>}
      </ul>
    </section>
  );
}

function ContentPanel() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    AdminAPI.listContent().then((d) => setItems(d?.results || d || [])).catch(() => {});
  }, []);
  return (
    <section className="card" style={{ padding: "1rem" }}>
      <h2>Content</h2>
      <ul>
        {items.map((c) => (
          <li key={c.id} className="card" style={{ padding: ".5rem", margin: ".3rem 0" }}>
            <strong>{c.title}</strong>
          </li>
        ))}
        {items.length === 0 && <li>No content.</li>}
      </ul>
    </section>
  );
}

function AuditLogsPanel() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    AdminAPI.auditLogs().then((d) => setItems(d?.results || d || [])).catch(() => {});
  }, []);
  return (
    <section className="card" style={{ padding: "1rem" }}>
      <h2>Audit Logs</h2>
      <ul>
        {items.map((l) => (
          <li key={l.id}><code>{l.action}</code> — {l.timestamp}</li>
        ))}
        {items.length === 0 && <li>No logs.</li>}
      </ul>
    </section>
  );
}

function SettingsPanel() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    AdminAPI.getSettings().then(setSettings).catch(() => setSettings({ allow_registration: true, maintenance_mode: false }));
  }, []);
  const save = async () => {
    setSaving(true);
    try {
      await AdminAPI.updateSettings(settings);
      alert("Settings saved");
    } catch (e) {
      alert(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };
  if (!settings) return <section className="card" style={{ padding: "1rem" }}><h2>Settings</h2><p>Loading...</p></section>;
  return (
    <section className="card" style={{ padding: "1rem" }}>
      <h2>Settings</h2>
      <label>
        <input type="checkbox" checked={settings.allow_registration} onChange={(e) => setSettings({ ...settings, allow_registration: e.target.checked })} />
        <span style={{ marginLeft: ".5rem" }}>Allow registration</span>
      </label>
      <br />
      <label>
        <input type="checkbox" checked={settings.maintenance_mode} onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })} />
        <span style={{ marginLeft: ".5rem" }}>Maintenance mode</span>
      </label>
      <div style={{ marginTop: ".6rem" }}>
        <button className="btn" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
      </div>
    </section>
  );
}
