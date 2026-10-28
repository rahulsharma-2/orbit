export default function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-16">
      <section
        className="w-full max-w-2xl rounded-3xl border p-8 sm:p-12"
        style={{
          background: "var(--surface-card)",
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <p
          className="mb-4 text-sm font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--action-primary)" }}
        >
          Foundation checkpoint
        </p>
        <h1 className="m-0 text-4xl font-semibold tracking-tight sm:text-6xl">
          Orbit is taking shape.
        </h1>
        <p
          className="mt-6 max-w-xl text-lg leading-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The web and API boundaries are alive. Product workflows come
          next—carefully, incrementally, and without distributed-systems
          cosplay.
        </p>
      </section>
    </main>
  );
}
