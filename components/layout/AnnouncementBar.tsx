const messages = [
  "Envíos gratis en CABA por compras superiores a $45.000",
  "Nuevas llegadas · Olio Extra Vergine Toscano 2024",
  "Un viaggio di sapori · Directo desde Italia a tu mesa",
  "Abierto en Barrio Norte & San Telmo",
];

export function AnnouncementBar() {
  const stream = [...messages, ...messages];
  return (
    <div className="overflow-hidden border-b border-ink/10 bg-ink text-ivory-50">
      <div className="flex animate-marquee whitespace-nowrap py-2.5">
        {stream.map((m, i) => (
          <span key={i} className="mx-8 text-[11px] uppercase tracking-extra-wide opacity-90">
            <span className="mr-8 opacity-60">◆</span>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
