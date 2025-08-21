import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TextInput from "../components/forms/TextInput";

export default function Login() {
  const { register: reg, handleSubmit, formState: { errors } } = useForm();
  const { login, setError, error } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container">
      <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ padding: "1rem", maxWidth: 480, margin: "1rem auto" }} aria-describedby={error ? "login-error" : undefined}>
        <h1>Login</h1>
        {error && <div id="login-error" className="alert danger" role="alert">{error}</div>}
        <TextInput id="email" label="Email" required register={reg("email", { required: "Email is required" })} error={errors.email} placeholder="you@example.com" type="email" data-cy="login-email" />
        <TextInput id="password" label="Password" required register={reg("password", { required: "Password is required" })} error={errors.password} type="password" data-cy="login-password" />
        <button className="btn" type="submit" disabled={submitting} data-cy="login-submit">{submitting ? "Signing in..." : "Sign In"}</button>
        <p>Don’t have an account? <Link to="/register">Register</Link></p>
      </form>
    </main>
  );
}
