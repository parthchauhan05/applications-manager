import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Message } from "primereact/message";
import { useAuth } from "../context/AuthContext";
import { APP_NAME } from "../utils/constants";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">

      {/* ── Left hero ── */}
      <div className="auth-hero">
        <div className="auth-hero__mark">CF</div>
        <div className="auth-hero__eyebrow">{APP_NAME}</div>
        <h1 className="auth-hero__title">Welcome back.</h1>
        <p className="auth-hero__text">
          Track your applications in one clean, focused workspace. Stay on top of every stage of your job search.
        </p>

        <div className="auth-hero__features">
          <div className="auth-hero__feature">
            <div className="auth-hero__feature-icon">
              <i className="pi pi-briefcase" />
            </div>
            <div className="auth-hero__feature-text">
              <strong>Track every application</strong>
              <span>Log jobs across all stages — saved, applied, interviewing, and beyond.</span>
            </div>
          </div>

          <div className="auth-hero__feature">
            <div className="auth-hero__feature-icon">
              <i className="pi pi-chart-bar" />
            </div>
            <div className="auth-hero__feature-text">
              <strong>See your pipeline at a glance</strong>
              <span>Dashboard KPIs and status charts that surface what needs attention.</span>
            </div>
          </div>

          <div className="auth-hero__feature">
            <div className="auth-hero__feature-icon">
              <i className="pi pi-calendar" />
            </div>
            <div className="auth-hero__feature-text">
              <strong>Never miss a follow-up</strong>
              <span>Log interview dates and follow-up reminders right alongside each role.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-card__header">
            <h2>Sign in</h2>
            <p>Enter your credentials to continue.</p>
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              className="w-full"
              inputClassName="w-full"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && <Message severity="error" text={error} />}

          <Button
            type="submit"
            label={loading ? "Signing in…" : "Sign in"}
            loading={loading}
            className="auth-card__submit"
          />

          <div className="auth-card__switch">
            <span>Don’t have an account?</span>
            <Link to="/register">Create one</Link>
          </div>
        </form>
      </div>

    </div>
  );
}
