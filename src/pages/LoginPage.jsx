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
      <div className="auth-panel">
        <div className="auth-panel__intro">
          <div className="auth-panel__mark">CF</div>
          <div className="auth-panel__eyebrow">{APP_NAME}</div>
          <h1 className="auth-panel__title">Welcome back.</h1>
          <p className="auth-panel__text">
            Track your applications in one clean, focused workspace.
          </p>
        </div>

        <form className="auth-card" onSubmit={submit}>
          <div className="auth-card__header">
            <h2>Login</h2>
            <p>Enter your details to continue.</p>
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              placeholder="Enter password"
            />
          </div>

          {error && <Message severity="error" text={error} />}

          <Button
            type="submit"
            label={loading ? "Signing in..." : "Login"}
            loading={loading}
            // className="auth-card__submit"
            className="db-btn-primary"
          />

          <div className="auth-card__switch">
            <span>Don’t have an account?</span>
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}