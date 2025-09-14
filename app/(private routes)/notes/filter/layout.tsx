export default function FilterLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>
      <aside style={{ borderRight: "1px solid #e5e7eb", padding: 16 }}>
        {sidebar}
      </aside>
      <section style={{ position: "relative", padding: 16 }}>
        {children}
      </section>
    </div>
  );
}
