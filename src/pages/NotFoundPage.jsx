import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-shell auth-shell--center">
      <div className="notfound-card">
        <div className="notfound-card__code">404</div>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Button label="Go to dashboard" className="db-btn-primary" onClick={() => navigate("/dashboard")} />
      </div>
    </div>
  );
}