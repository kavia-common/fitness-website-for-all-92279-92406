import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="container">
      <section className="card" style={{ padding: "1rem" }}>
        <h1>Welcome to Fitness Website For All</h1>
        <p>Your inclusive hub for workouts, nutrition, and community support.</p>
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          <Link to="/content" className="btn">Browse Content</Link>
          <Link to="/plans" className="btn success">Create Personalized Plan</Link>
          <Link to="/community" className="btn secondary">Visit Community</Link>
        </div>
      </section>
    </main>
  );
}
