import React, { useEffect, useState } from "react";
import { UserAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [goals, setGoals] = useState({ target_weight: "", weekly_workouts: 3, dietary_pref: "" });

  useEffect(() => {
    UserAPI.getProfile()
      .then((data) => {
        setProfile(data);
        if (data?.goals) setGoals({ ...goals, ...data.goals });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await UserAPI.updateProfile({ name: profile?.name, bio: profile?.bio });
      await UserAPI.updateGoals(goals);
      setMessage("Profile saved");
    } catch (e2) {
      setMessage(e2.message || "Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const onConnectDevice = async (provider) => {
    try {
      const { redirect_url } = await UserAPI.connectDevice(provider);
      if (redirect_url) {
        window.location.assign(redirect_url);
      } else {
        alert("Device connection initiated. Follow instructions on your device app.");
      }
    } catch (e) {
      alert(e.message || "Device connection failed");
    }
  };

  return (
    <main className="container">
      <div className="grid grid-2">
        <section className="card" style={{ padding: "1rem" }}>
          <h1>My Profile</h1>
          <form onSubmit={onSaveProfile}>
            <div className="form-row">
              <label htmlFor="pname">Name</label>
              <input id="pname" className="input" value={profile?.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="form-row">
              <label htmlFor="pbio">Bio</label>
              <textarea id="pbio" className="input" rows={4} value={profile?.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
            </div>
            <button className="btn" disabled={saving} data-cy="profile-save">{saving ? "Saving..." : "Save"}</button>
            {message && <p className="alert success" role="status" aria-live="polite" style={{ marginTop: ".6rem" }}>{message}</p>}
          </form>
        </section>

        <section className="card" style={{ padding: "1rem" }}>
          <h2>My Goals</h2>
          <div className="form-row">
            <label htmlFor="goal-weight">Target weight (kg)</label>
            <input id="goal-weight" type="number" className="input" value={goals.target_weight} onChange={(e) => setGoals({ ...goals, target_weight: e.target.value })} />
          </div>
          <div className="form-row">
            <label htmlFor="goal-workouts">Weekly workouts</label>
            <input id="goal-workouts" type="number" className="input" value={goals.weekly_workouts} onChange={(e) => setGoals({ ...goals, weekly_workouts: Number(e.target.value) })} />
          </div>
          <div className="form-row">
            <label htmlFor="goal-diet">Dietary preference</label>
            <input id="goal-diet" className="input" value={goals.dietary_pref} onChange={(e) => setGoals({ ...goals, dietary_pref: e.target.value })} />
          </div>
          <button className="btn" onClick={onSaveProfile} disabled={saving}>Save Goals</button>
        </section>
      </div>

      {process.env.REACT_APP_ENABLE_DEVICE_CONNECT === "true" && (
        <section className="card" style={{ padding: "1rem", marginTop: "1rem" }}>
          <h2>Connect your device</h2>
          <p>Connect wearables and apps to sync your activity and health data.</p>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            <button className="btn secondary" onClick={() => onConnectDevice("fitbit")} data-cy="connect-fitbit">Connect Fitbit</button>
            <button className="btn secondary" onClick={() => onConnectDevice("apple-health")} data-cy="connect-apple">Connect Apple Health</button>
            <button className="btn secondary" onClick={() => onConnectDevice("google-fit")} data-cy="connect-googlefit">Connect Google Fit</button>
          </div>
        </section>
      )}

      <section className="card" style={{ padding: "1rem", marginTop: "1rem" }}>
        <h2>Notifications</h2>
        <NotificationsList />
      </section>

      <section aria-label="Accessibility tips" className="card" style={{ padding: "1rem", marginTop: "1rem" }}>
        <h2>Accessibility</h2>
        <p>This application supports keyboard navigation, screen reader landmarks, and high contrast themes.</p>
        <ul>
          <li>Press Tab to navigate through interactive elements.</li>
          <li>Use the theme toggle in the top navigation for dark/light mode.</li>
        </ul>
      </section>
    </main>
  );
}

function NotificationsList() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    UserAPI.getNotifications().then((data) => setItems(data?.results || data || [])).catch(() => {});
  }, []);
  const markRead = async (id) => {
    try {
      await UserAPI.readNotification(id);
      setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch {}
  };
  return (
    <ul aria-live="polite">
      {items.length === 0 && <li>No notifications</li>}
      {items.map((n) => (
        <li key={n.id} className="card" style={{ margin: ".5rem 0", padding: ".7rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: ".5rem" }}>
            <div>
              <strong>{n.title || "Notification"}</strong>
              <p style={{ margin: 0 }}>{n.body || n.message}</p>
            </div>
            {!n.read && <button className="btn success" onClick={() => markRead(n.id)}>Mark read</button>}
          </div>
        </li>
      ))}
    </ul>
  );
}
