import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useAuth } from "../context/AuthContext";
import { APP_NAME } from "../utils/constants";

export default function AppTopbar({ onMenuClick, onCreateClick }) {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "CF";

  const menuItems = [
    {
      label: userEmail || "Account",
      items: [
        {
          label: "Dashboard",
          icon: "pi pi-home",
          command: () => navigate("/dashboard"),
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: logout,
        },
      ],
    },
  ];

  return (
    <header className="shell-topbar">
      <div className="shell-topbar__left">
        <Button
          icon="pi pi-bars"
          text
          rounded
          aria-label="Toggle navigation"
          // className="shell-topbar__menu"
          className="db-btn-primary"
          onClick={onMenuClick}
        />

        <button className="shell-brand shell-brand--mobile" onClick={() => navigate("/dashboard")}>
          <span className="shell-brand__mark">CF</span>
          <span className="shell-brand__text">{APP_NAME}</span>
        </button>
      </div>

      <div className="shell-topbar__right">
        <Button
          label="New"
          icon="pi pi-plus"
          size="small"
          // className="shell-topbar__new"
          className="db-btn-primary"
          onClick={onCreateClick}
        />

        <Menu model={menuItems} popup ref={menuRef} popupAlignment="right" />

        <button
          className="shell-profile"
          onClick={(e) => menuRef.current?.toggle(e)}
          aria-label="Open account menu"
        >
          <Avatar label={initials} shape="circle" className="shell-profile__avatar" />
        </button>
      </div>
    </header>
  );
}