export default function Loading() {
  return (
    <main>
      <section className="hero">
        <div>
          {/* Eyebrow skeleton */}
          <div
            className="skeleton"
            style={{
              width: "180px",
              height: "28px",
              borderRadius: "9999px",
              marginBottom: "var(--space-4)",
            }}
          />
          {/* Title skeleton */}
          <div
            className="skeleton"
            style={{
              width: "90%",
              height: "48px",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--space-2)",
            }}
          />
          <div
            className="skeleton"
            style={{
              width: "70%",
              height: "48px",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--space-4)",
            }}
          />
          {/* Paragraph skeleton */}
          <div
            className="skeleton"
            style={{
              width: "100%",
              height: "16px",
              borderRadius: "var(--radius-sm)",
              marginBottom: "var(--space-2)",
            }}
          />
          <div
            className="skeleton"
            style={{
              width: "95%",
              height: "16px",
              borderRadius: "var(--radius-sm)",
              marginBottom: "var(--space-2)",
            }}
          />
          <div
            className="skeleton"
            style={{
              width: "60%",
              height: "16px",
              borderRadius: "var(--radius-sm)",
              marginBottom: "var(--space-6)",
            }}
          />
          {/* Hero Actions skeleton */}
          <div className="hero-actions">
            <div
              className="skeleton"
              style={{
                width: "140px",
                height: "46px",
                borderRadius: "9999px",
              }}
            />
            <div
              className="skeleton"
              style={{
                width: "160px",
                height: "46px",
                borderRadius: "9999px",
              }}
            />
          </div>
        </div>

        {/* Hero Card skeleton */}
        <aside className="hero-card">
          <div className="hero-card-header">
            <div className="flex items-center gap-3">
              <div
                className="skeleton"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "9999px",
                }}
              />
              <div className="flex flex-col gap-1.5">
                <div
                  className="skeleton"
                  style={{
                    width: "80px",
                    height: "12px",
                    borderRadius: "var(--radius-sm)",
                  }}
                />
                <div
                  className="skeleton"
                  style={{
                    width: "140px",
                    height: "16px",
                    borderRadius: "var(--radius-sm)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Graph Grid skeleton */}
          <div
            className="skeleton"
            style={{
              width: "100%",
              height: "130px",
              borderRadius: "var(--radius-md)",
              marginTop: "var(--space-5)",
            }}
          />

          {/* Mini KPIs skeleton */}
          <div className="mini-kpis">
            <div
              className="skeleton"
              style={{
                height: "82px",
                borderRadius: "var(--radius-lg)",
              }}
            />
            <div
              className="skeleton"
              style={{
                height: "82px",
                borderRadius: "var(--radius-lg)",
              }}
            />
          </div>
        </aside>
      </section>

      {/* Leaderboard section skeleton */}
      <section className="mt-20">
        <div
          className="skeleton"
          style={{
            width: "100%",
            height: "400px",
            borderRadius: "var(--radius-xl)",
          }}
        />
      </section>
    </main>
  );
}
