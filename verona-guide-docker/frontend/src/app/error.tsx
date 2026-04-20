"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      <div style={{ fontSize: "6rem", fontWeight: 800, opacity: 0.15 }}>500</div>
      <button
        onClick={reset}
        style={{
          marginTop: "2rem",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#FFB200",
          background: "none",
          border: "none",
          cursor: "pointer",
          opacity: 0.7,
        }}
      >
        Try again
      </button>
    </div>
  );
}
