import { Settings } from "lucide-react";
import { USER_INFO } from "./NavConfig";

export default function NavFooter() {
  return (
    <div
      style={{
        padding: "12px 12px 24px",
        borderTop: "1px solid #f3f4f6",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          borderRadius: 12,
          cursor: "pointer",
          transition: "background 0.18s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {/* Avatar */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1a56db, #0b1a2e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>
            {USER_INFO.initials}
          </span>
        </div>

        {/* Name & role */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#0b1a2e",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              margin: 0,
              lineHeight: 1,
            }}
          >
            {USER_INFO.name}
          </p>
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 3, marginBottom: 0 }}>
            {USER_INFO.role}
          </p>
        </div>

        {/* Settings icon */}
        <Settings size={15} color="#9ca3af" strokeWidth={1.8} style={{ flexShrink: 0 }} />
      </div>
    </div>
  );
}