import NavLogo from "./Navlogo";
import NavItem from "./NavItems";
import NavFooter from "./NavFooter";
import { NAV_ITEMS } from "./NavConfig";

export default function Sidebar({ activeId, onSelect }) {
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: 240,
        background: "#ffffff",
        boxShadow: "4px 0 20px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <NavLogo />

      {/* Nav links */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#9ca3af",
            padding: "0 10px",
            marginBottom: 10,
            marginTop: 0,
          }}
        >
          Main Menu
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              activeId={activeId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <NavFooter />
    </aside>
  );
}