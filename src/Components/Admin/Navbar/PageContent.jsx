export default function PageContent({ page }) {
    return (
      <main
        style={{
          marginLeft: 240,
          flex: 1,
          minHeight: "100vh",
          overflowY: "auto",
          background: "#f9fafb",
          padding: 40,
        }}
      >
        <div style={{ maxWidth: 720 }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>{page.emoji}</p>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#0b1a2e",
              letterSpacing: "-0.5px",
              marginBottom: 8,
              marginTop: 0,
            }}
          >
            {page.title}
          </h1>
          <p style={{ color: "#6b7280", fontSize: 15, marginTop: 0 }}>{page.subtitle}</p>
  
          {/* Placeholder skeleton cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginTop: 40,
            }}
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 20,
                  height: 110,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }