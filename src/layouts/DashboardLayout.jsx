import { useState } from "react";
import AppSidebar from "../components/AppSidebar";
import AppTopbar from "../components/AppTopbar";

export default function DashboardLayout({ children, onCreateClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`shell shell--app ${sidebarOpen ? "shell--sidebar-open" : "shell--sidebar-closed"}`}>
      <aside className="shell-sidebar-rail">
        <AppSidebar collapsed={!sidebarOpen} />
      </aside>

      <div className="shell-content-area">
        <AppTopbar
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          onCreateClick={onCreateClick}
        />
        <main className="shell-main">{children}</main>
      </div>
    </div>
  );
}