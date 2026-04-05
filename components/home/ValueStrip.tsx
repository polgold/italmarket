const values = [
  { title: "Importación directa", text: "Seleccionamos productores italianos visitando cada región." },
  { title: "Alta calidad", text: "Certificaciones DOP, IGP y DOCG avalan nuestro catálogo." },
  { title: "Envíos a todo el país", text: "Logística refrigerada en AMBA y despacho a provincias." },
  { title: "Asesoramiento experto", text: "Nuestro equipo te guía en maridajes y recetas italianas." },
];

export function ValueStrip() {
  return (
    <section className="border-y border-ink/10 bg-ivory-100">
      <div className="container-x grid grid-cols-2 gap-y-10 py-14 lg:grid-cols-4">
        {values.map((v) => (
          <div key={v.title} className="flex flex-col items-center px-6 text-center">
            <span className="font-serif text-3xl text-bosco-700">◆</span>
            <h3 className="mt-3 font-serif text-xl text-ink">{v.title}</h3>
            <p className="mt-2 max-w-[240px] text-sm leading-relaxed text-ink/60">{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
