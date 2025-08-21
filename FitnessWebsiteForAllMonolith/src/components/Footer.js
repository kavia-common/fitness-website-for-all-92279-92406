import React from "react";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <p>© {new Date().getFullYear()} Fitness Website For All. Built with accessibility in mind (WCAG 2.1 AA).</p>
      </div>
    </footer>
  );
}
