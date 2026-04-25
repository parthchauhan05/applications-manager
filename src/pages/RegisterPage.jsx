import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Message } from "primereact/message";
import { useAuth } from "../context/AuthContext";
import { APP_NAME } from "../utils/constants";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
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
        <h1 className="auth-hero__title">Your search, organised.</h1>
        <p className="auth-hero__text">
          Start tracking your job search with a quieter, more usable dashboard. Everything in one place, zero clutter.
        </p>

        <div className="auth-hero__features">
          <div className="auth-hero__feature">
            <div className="auth-hero__feature-icon">
              <i className="pi pi-bolt" />
            </div>
            <div className="auth-hero__feature-text">
              <strong>Up and running in seconds</strong>
              <span>Create an account and log your first application in under a minute.</span>
            </div>
          </div>

          <div className="auth-hero__feature">
            <div className="auth-hero__feature-icon">
              <i className="pi pi-filter" />
            </div>
            <div className="auth-hero__feature-text">
              <strong>Filter, search, and sort</strong>
              <span>Find any application instantly with live search and status filters.</span>
            </div>
          </div>

          <div className="auth-hero__feature">
            <div className="auth-hero__feature-icon">
              <i className="pi pi-shield" />
            </div>
            <div className="auth-hero__feature-text">
              <strong>Your data, private</strong>
              <span>Each account is fully isolated. Nobody else sees your applications.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-card__header">
            <h2>Create account</h2>
            <p>Get your workspace set up in a minute.</p>
          </div>

          <div className="field">
            <label htmlFor="name">Full name</label>
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label htmlFor="register-email">Email</label>
            <InputText
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="register-password">Password</label>
            <Password
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              className="w-full"
              inputClassName="w-full"
              placeholder="Create a password"
              autoComplete="new-password"
            />
          </div>

          {error && <Message severity="error" text={error} />}

          <Button
            type="submit"
            label={loading ? "Creating account…" : "Create account"}
            loading={loading}
            className="auth-card__submit"
          />

          <div className="auth-card__switch">
            <span>Already have an account?</span>
            <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>

    </div>
  );
}
