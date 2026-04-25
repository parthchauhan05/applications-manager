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
      <div className="auth-panel">
        <div className="auth-panel__intro">
          <div className="auth-panel__mark">CF</div>
          <div className="auth-panel__eyebrow">{APP_NAME}</div>
          <h1 className="auth-panel__title">Create your account.</h1>
          <p className="auth-panel__text">
            Start tracking your job search with a quieter, more usable dashboard.
          </p>
        </div>

        <form className="auth-card" onSubmit={submit}>
          <div className="auth-card__header">
            <h2>Register</h2>
            <p>Create your workspace in a minute.</p>
          </div>

          <div className="field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="field">
            <label htmlFor="register-email">Email</label>
            <InputText
              id="register-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              placeholder="Create password"
            />
          </div>

          {error && <Message severity="error" text={error} />}

          <Button
            type="submit"
            label={loading ? "Creating..." : "Register"}
            loading={loading}
            // className="auth-card__submit"
            className="db-btn-primary"
          />

          <div className="auth-card__switch">
            <span>Already have an account?</span>
            <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}