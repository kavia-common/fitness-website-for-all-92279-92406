import React, { useEffect, useState } from "react";
import { ContentAPI } from "../services/api";
import { Link, useParams } from "react-router-dom";

export function ContentList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    ContentAPI.listContent().then((data) => setItems(data?.results || data || [])).catch(() => {});
  }, []);
  const filtered = items.filter((i) => i.title?.toLowerCase().includes(q.toLowerCase()));
  return (
    <main className="container">
      <h1>Fitness Content</h1>
      <div className="form-row">
        <label htmlFor="search">Search</label>
        <input id="search" className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search workouts, nutrition..." />
      </div>
      <div className="grid grid-3">
        {filtered.map((item) => (
          <article key={item.id} className="card" style={{ padding: ".8rem" }}>
            <h3>{item.title}</h3>
            <p>{item.summary || item.description?.slice(0, 120)}</p>
            <Link to={`/content/${item.id}`} className="btn">Open</Link>
          </article>
        ))}
        {filtered.length === 0 && <p>No content found.</p>}
      </div>
    </main>
  );
}

export function ContentDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  useEffect(() => {
    ContentAPI.getContent(id).then((data) => setItem(data)).catch(() => {});
  }, [id]);
  if (!item) return <main className="container"><p>Loading...</p></main>;
  return (
    <main className="container">
      <article className="card" style={{ padding: "1rem" }}>
        <h1>{item.title}</h1>
        <p>{item.body || item.description}</p>
      </article>
    </main>
  );
}

export function Plans() {
  const [goal, setGoal] = useState("fat-loss");
  const [days, setDays] = useState(30);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const data = await ContentAPI.generatePlan({ goal, days });
      setPlan(data);
    } catch (e) {
      alert(e.message || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <section className="card" style={{ padding: "1rem" }}>
        <h1>Personalized Plan</h1>
        <div className="grid grid-2">
          <div>
            <div className="form-row">
              <label htmlFor="plan-goal">Goal</label>
              <select id="plan-goal" className="input" value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="fat-loss">Fat Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="general-fitness">General Fitness</option>
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="plan-days">Duration (days)</label>
              <input id="plan-days" className="input" type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} />
            </div>
            <button className="btn" onClick={generate} disabled={loading} data-cy="generate-plan">{loading ? "Generating..." : "Generate Plan"}</button>
          </div>
          <div>
            {plan ? (
              <div className="card" style={{ padding: ".8rem" }}>
                <h2>{plan.title || "Your Plan"}</h2>
                <pre aria-label="Plan details" style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(plan, null, 2)}</pre>
              </div>
            ) : (
              <p>Fill in your preferences and generate your personalized plan.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
