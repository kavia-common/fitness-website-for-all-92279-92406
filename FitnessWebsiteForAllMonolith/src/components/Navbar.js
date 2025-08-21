import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onToggleTheme }) {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="navbar" role="navigation" aria-label="Primary">
      <div className="navbar-inner container">
        <NavLink to="/" className="navlink" aria-label="Home">Fitness For All</NavLink>
        <NavLink to="/content" className="navlink">Content</NavLink>
        <NavLink to="/community" className="navlink">Community</NavLink>
        <NavLink to="/plans" className="navlink">Plans</NavLink>
        <div className="nav-spacer" />
        <button className="btn secondary" onClick={onToggleTheme} aria-label="Toggle theme">Toggle Theme</button>
        {user ? (
          <>
            <NavLink to="/profile" className="navlink">Profile</NavLink>
            {isAdmin && <NavLink to="/admin" className="navlink">Admin</NavLink>}
            <button className="btn" onClick={logout} data-cy="nav-logout">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="navlink">Login</NavLink>
            <NavLink to="/register" className="navlink">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
