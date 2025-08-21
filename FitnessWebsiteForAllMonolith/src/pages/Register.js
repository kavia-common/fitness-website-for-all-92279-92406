import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextInput from "../components/forms/TextInput";
import { useAuth } from "../context/AuthContext";

const schema = yup.object({
  name: yup.string().min(2, "Name too short").required("Name required"),
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup.string().min(6, "Min 6 chars").required("Password required"),
});

export default function Register() {
  const { register: reg, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { register: doRegister, setError, error } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      await doRegister(values);
      navigate("/profile");
    } catch (e) {
      setError(e.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container">
      <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ padding: "1rem", maxWidth: 560, margin: "1rem auto" }} aria-describedby={error ? "register-error" : undefined}>
        <h1>Create your account</h1>
        {error && <div id="register-error" className="alert danger" role="alert">{error}</div>}
        <TextInput id="name" label="Full name" required register={reg("name")} error={errors.name} placeholder="Jane Doe" data-cy="register-name" />
        <TextInput id="email" label="Email" required register={reg("email")} error={errors.email} placeholder="you@example.com" type="email" data-cy="register-email" />
        <TextInput id="password" label="Password" required register={reg("password")} error={errors.password} type="password" data-cy="register-password" />
        <button className="btn" type="submit" disabled={submitting} data-cy="register-submit">{submitting ? "Creating..." : "Create account"}</button>
        <p>Already registered? <Link to="/login">Sign in</Link></p>
      </form>
    </main>
  );
}
