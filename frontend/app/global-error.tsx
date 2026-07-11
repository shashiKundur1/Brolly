"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          textAlign: "center",
          backgroundColor: "#ffffff",
          color: "#2f3e36",
          fontFamily: "system-ui, sans-serif",
          padding: "1.5rem",
        }}
      >
        <svg
          viewBox="0 0 160 160"
          width="120"
          height="120"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M24 96c8-30 30-52 56-52s48 22 56 52c-15-7-30-2-40 3-8-4-16-4-24 0-8-4-16-4-24 0-8-4-16-4-24-3Z"
            stroke="#e8756a"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M80 96v34c0 6-5 11-11 11"
            stroke="#2f3e36"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <p style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          brolly itself needs an umbrella.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "1rem",
            fontWeight: 600,
            color: "#ffffff",
            backgroundColor: "#e8756a",
            border: "2px solid #2f3e36",
            borderRadius: "0.75rem",
            padding: "0.6rem 1.4rem",
            boxShadow: "3px 3px 0 0 #2f3e36",
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
