import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          margin: 0,
          background: "linear-gradient(90deg, #35e6ff, #8b5cf6)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Never Build Alone: Worldforge
      </h1>
      <p style={{ maxWidth: 560, opacity: 0.8, lineHeight: 1.6 }}>
        Vertical slice build in progress. This is a pre-alpha technical
        preview — not the final visual bar shown in the art bible.
      </p>
      <Link
        href="/world"
        style={{
          padding: "0.85rem 2rem",
          borderRadius: 999,
          border: "1px solid var(--nba-violet)",
          color: "#fff",
          textDecoration: "none",
          background:
            "linear-gradient(90deg, rgba(53,230,255,0.15), rgba(139,92,246,0.25))",
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        Enter the World →
      </Link>
    </main>
  );
}
