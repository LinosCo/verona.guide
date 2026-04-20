export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0E0904",
        color: "#F5F0E8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: "6rem", fontWeight: 800, opacity: 0.15 }}>404</div>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        style={{
          marginTop: "2rem",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#FFB200",
          textDecoration: "none",
          opacity: 0.7,
        }}
      >
        ← Verona.Guide
      </a>
    </div>
  );
}
