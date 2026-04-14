/**
 * SEO copy por categoría: hero keyword-rich, intro indexable y FAQs con
 * schema.org. Se renderiza en /productos?categoria=<slug> cuando el slug
 * aparece acá; si no, la página usa el fallback actual (nombre + description
 * de WooCommerce). Editable sin tocar WP.
 */
export interface CategorySEO {
  slug: string;
  eyebrow: string;
  h1: string;
  intro: string;
  faqs: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
}

export const CATEGORY_SEO: Record<string, CategorySEO> = {
  pasta: {
    slug: "pasta",
    eyebrow: "Paste italiane",
    h1: "Pastas italianas importadas",
    intro:
      "La pasta italiana auténtica no se parece a ninguna otra: trigo duro del sur de Italia, trafilatura al bronzo que da textura al fideo para que la salsa se adhiera, y un secado lento que preserva aroma y firmeza al dente. En Italmarket trabajamos con productores históricos —Rummo en Benevento, De Cecco en Abruzzo, Garofalo en Gragnano (la cuna de la pasta seca, con IGP), La Molisana en Molise— además de pastas frescas como ravioli, gnocchi y tortellini importados refrigerados. Todo el catálogo se importa directo desde Italia y se despacha a todo el país desde nuestras sucursales de Barrio Norte y San Telmo. Elegí por formato (spaghetti, penne, rigatoni, orecchiette, pappardelle), por productor o por región.",
    faqs: [
      {
        q: "¿Cuál es la diferencia entre pasta italiana y pasta nacional?",
        a: "La pasta italiana usa sémola de trigo duro 100% (durum wheat) y la mayoría se trafila en bronce (trafilatura al bronzo), lo que deja una superficie rugosa que retiene la salsa. El secado lento a baja temperatura preserva las proteínas y el aroma. Estas tres cosas juntas —trigo, trafila, secado— hacen que la pasta italiana tenga mejor tenacidad, color dorado más intenso y mejor tiempo de cocción al dente.",
      },
      {
        q: "¿Qué marcas italianas venden?",
        a: "Rummo, De Cecco, Garofalo (IGP Pasta di Gragnano), La Molisana, Barilla Collezione, Divella, Benedetto Cavalieri, Pastificio dei Campi, Mancini y varias más. Pasta fresca de productores artesanales argentinos con técnica italiana.",
      },
      {
        q: "¿Cuánto tarda el envío de pasta a todo el país?",
        a: "AMBA 24–48 h hábiles. Interior del país 3–5 días hábiles. La pasta seca viaja ambiente; las pastas frescas se despachan con logística refrigerada los días pautados.",
      },
      {
        q: "¿Puedo retirar pasta en Barrio Norte o San Telmo?",
        a: "Sí. Comprás online y retirás sin costo en Av. Santa Fe 2727 (Barrio Norte) o Defensa 863 (San Telmo).",
      },
    ],
    metaTitle: "Pastas italianas importadas · Rummo, De Cecco, Garofalo",
    metaDescription:
      "Pastas italianas auténticas importadas: Rummo, De Cecco, Garofalo (IGP Gragnano), La Molisana, Divella y más. Trafilate al bronzo, secado lento. Envíos a todo el país y retiro en Barrio Norte o San Telmo.",
  },

  "productos-frescos": {
    slug: "productos-frescos",
    eyebrow: "Prodotti freschi",
    h1: "Quesos y embutidos italianos frescos",
    intro:
      "El capítulo refrigerado del catálogo: quesos italianos (Parmigiano Reggiano DOP, Pecorino Romano DOP, Grana Padano, Gorgonzola, Mozzarella di Bufala Campana DOP, Ricotta, Mascarpone, Taleggio) y salumi (Prosciutto di Parma DOP, Prosciutto Crudo, Mortadella Bologna IGP, Bresaola, Salame Milano, Coppa, Guanciale, Pancetta). Mantenemos la cadena de frío desde origen y fraccionamos en local bajo pedido para que cada pieza llegue como corresponde. Perfecto para un tagliere, para rallar sobre una pasta o para montar una tabla con vino. Despacho con logística refrigerada en CABA y AMBA; consultar plazos para interior.",
    faqs: [
      {
        q: "¿Los quesos son DOP auténticos?",
        a: "Sí. El Parmigiano Reggiano DOP, Pecorino Romano DOP, Mozzarella di Bufala Campana DOP y Gorgonzola DOP que vendemos están certificados por el Consorzio di Tutela correspondiente: cada rueda tiene la marca al fuego y el número de matrícula del caseificio. Eso garantiza origen, método de elaboración y edad mínima de maduración.",
      },
      {
        q: "¿Cómo envían quesos y embutidos a domicilio?",
        a: "Usamos logística refrigerada. En AMBA salimos con moto térmica o camión refrigerado según pedido. Al interior coordinamos por transporte refrigerado y avisamos días de despacho por WhatsApp.",
      },
      {
        q: "¿Cuánto dura un prosciutto o un parmigiano una vez abierto?",
        a: "Prosciutto fileteado: 2 a 3 días en heladera envuelto en papel manteca. Parmigiano en trozo: hasta 30 días envuelto en film alimentario o papel encerado + film, siempre en la parte más fría de la heladera. Los cortes que fraccionamos se envasan al vacío y extienden esos plazos.",
      },
      {
        q: "¿Puedo armar una tabla o degustación en la tienda?",
        a: "Sí. Preparamos tablas personalizadas con quesos, salumi, grissini, aceitunas y mermeladas. Pedila por WhatsApp con 24 h de anticipación.",
      },
    ],
    metaTitle: "Quesos y embutidos italianos DOP · Parmigiano, Prosciutto",
    metaDescription:
      "Quesos italianos DOP (Parmigiano Reggiano, Mozzarella di Bufala, Pecorino) y salumi (Prosciutto di Parma, Mortadella IGP, Bresaola, Salame). Cadena de frío desde origen. Retiro en Barrio Norte y San Telmo, envíos refrigerados.",
  },

  dolci: {
    slug: "dolci",
    eyebrow: "Dolci italiani",
    h1: "Dulces italianos importados",
    intro:
      "Los dolci son el cierre natural de la mesa italiana: panettone y pandoro artesanales en temporada, amaretti de Saronno, cantucci toscani, pizzelle, baci di dama del Piamonte, tiramisú en formato listo o sus componentes (mascarpone, savoiardi, café), biscotti, nougat (torrone), chocolates Baci Perugina y cremas de avellana como la Nocciolata. Seleccionamos productores con fermentaciones largas (hasta 60 h en el caso de los panettoni premium), manteca real y harinas italianas — nada de emulsionantes ni grasas vegetales baratas. Es la categoría que más crece en Italmarket entre septiembre y enero por la temporada de fiestas.",
    faqs: [
      {
        q: "¿Tienen panettone artesanal importado todo el año?",
        a: "El panettone artesanal italiano (Loison, Fiasconaro, Filippi, Borsari y similares) entra entre octubre y diciembre. Fuera de temporada reponemos puntualmente lo que queda en stock y rotamos con alternativas argentinas de calidad. Lo mejor: suscribirse al newsletter para aviso de llegada.",
      },
      {
        q: "¿Qué diferencia al panettone artesanal del industrial?",
        a: "Fermentación con levadura madre (lievito madre) de 36 a 60 horas en vez de levadura química instantánea, manteca en lugar de grasas vegetales, frutas confitadas sin colorantes artificiales y decoración glassatura con almendras enteras. El resultado es miga filante, aroma cítrico natural y vida útil más larga.",
      },
      {
        q: "¿Hacen cajas de regalo con dolci?",
        a: "Sí. Preparamos cajas corporativas y gifting navideño combinando panettone, vino, cafè y chocolates. Consultanos por WhatsApp con volumen y presupuesto.",
      },
    ],
    metaTitle: "Dulces italianos · Panettone, Amaretti, Tiramisú, Torrone",
    metaDescription:
      "Dulces italianos importados: panettone artesanal, pandoro, amaretti, cantucci, torrone, biscotti, chocolates Baci Perugina y Nocciolata. Envíos a todo el país y retiro en Barrio Norte o San Telmo.",
  },

  bebidas: {
    slug: "bebidas",
    eyebrow: "Bevande italiane",
    h1: "Bebidas italianas y vinos importados",
    intro:
      "Vinos italianos por región (Chianti Classico DOCG de Toscana, Barolo y Barbaresco de Piamonte, Valpolicella y Amarone del Véneto, Prosecco DOC, Lambrusco, vinos del sur como Primitivo y Nero d'Avola), aperitivos clásicos para el rito del aperitivo (Campari, Aperol, Cynar, Vermouth di Torino), grappas, licores artesanales (limoncello de Sorrento, amaretto, sambuca, fernet italiano), aguas italianas (San Pellegrino, Acqua Panna) y gaseosas artesanales. Trabajamos con importadores oficiales y seleccionamos bodegas pequeñas además de las etiquetas clásicas.",
    faqs: [
      {
        q: "¿Puedo pedir vinos italianos a todo el país?",
        a: "Sí, con todos los recaudos logísticos (embalaje térmico en verano, doble caja para botellas). Despachamos a todo el país salvo provincias con restricciones puntuales; confirmanos por WhatsApp el destino.",
      },
      {
        q: "¿Qué diferencia un Chianti Classico DOCG de uno común?",
        a: "DOCG (Denominazione di Origine Controllata e Garantita) es el sello más alto del sistema italiano: zona geográfica delimitada (en este caso el histórico Chianti Classico entre Florencia y Siena), cepas Sangiovese mínimo 80%, crianza mínima obligatoria y cata de aprobación por un panel oficial. El 'Chianti' sin 'Classico DOCG' es DOCG pero de zona más amplia y reglas algo más flexibles.",
      },
      {
        q: "¿Tienen maridajes recomendados por pasta o plato?",
        a: "Sí. En /recetas y /guias publicamos maridajes concretos por plato. Para pasta al ragù napoletano o una lasagna: un Chianti Classico joven. Para risotto al funghi: Barbera o Pinot Nero. Para pescado: Vermentino o Soave. Consultanos.",
      },
    ],
    metaTitle: "Vinos italianos importados · Chianti, Barolo, Prosecco, Aperol",
    metaDescription:
      "Vinos italianos DOCG y DOC (Chianti Classico, Barolo, Prosecco, Valpolicella, Primitivo), aperitivos (Campari, Aperol, Vermouth), grappas, limoncello y agua San Pellegrino. Envíos a todo el país.",
  },

  "trufa-y-hongos": {
    slug: "trufa-y-hongos",
    eyebrow: "Tartufo e funghi",
    h1: "Trufa y hongos italianos importados",
    intro:
      "La trufa italiana —la blanca de Alba (Tuber magnatum pico) y la negra del Norcia (Tuber melanosporum)— es uno de los productos más codiciados de la gastronomía mundial. En Italmarket trabajamos la categoría completa: trufa fresca en temporada (octubre a enero para la blanca de Alba), salsas y cremas de trufa (tartufata, salsa al tartufo bianco, salsa al tartufo nero), aceites trufados de calidad seria con shavings reales y no solo aroma, quesos con trufa (pecorino al tartufo, brie con tartufo) y una selección de hongos porcini secos, chiodini y mixtos. Es una de nuestras categorías más técnicas y nos encanta asesorarla.",
    faqs: [
      {
        q: "¿Venden trufa blanca fresca de Alba?",
        a: "Sí, en temporada (octubre a enero). La pedimos directa a proveedores del Piamonte y se reserva con anticipación por WhatsApp porque la frescura es cuestión de días. Fuera de temporada: trufa negra fresca, salsas y aceites trufados premium.",
      },
      {
        q: "¿El aceite de trufa italiano es auténtico?",
        a: "Depende de la marca. Muchos aceites trufados del mercado usan aroma sintético (2,4-ditiapentano). Los que nosotros elegimos vienen con trufa real picada dentro de la botella y usan el aroma natural de la trufa macerada; la diferencia sensorial y el precio son notables. Consultanos qué referencia buscás.",
      },
      {
        q: "¿Cómo uso los hongos porcini secos?",
        a: "Se hidratan en agua tibia 20–30 minutos antes de usarlos. El agua de hidratación (colada para sacar arena) es oro líquido: incorporala al risotto, al ragù o a una salsa de pasta. Con 20 g de porcini secos hidratados cubrís un risotto para 4 personas.",
      },
    ],
    metaTitle: "Trufa italiana y hongos porcini · Alba, Norcia, Tartufata",
    metaDescription:
      "Trufa blanca de Alba y negra de Norcia (en temporada), salsas tartufate, aceites trufados auténticos, quesos al tartufo y porcini secos italianos. Asesoramiento experto en Barrio Norte y San Telmo.",
  },

  aceites: {
    slug: "aceites",
    eyebrow: "Oli d'oliva",
    h1: "Aceites de oliva italianos extra virgen",
    intro:
      "El aceite de oliva extra virgen italiano (olio extravergine d'oliva) es uno de los pilares de la cocina italiana: hay tantos perfiles como regiones. De la Toscana vienen aceites intensos, herbáceos y ligeramente picantes (cultivares Frantoio, Leccino, Moraiolo). De Puglia, aceites más redondos y frutados (Coratina, Ogliarola). De Sicilia y Liguria, aceites delicados ideales para pescados. Trabajamos fincas que cosechan verde, prensado en frío (spremitura a freddo) dentro de las 24 h del corte, y separamos claramente los DOP/IGP de los blends. Para cocinar, para crudo sobre una bruschetta, para un pesto casero o para un carpaccio.",
    faqs: [
      {
        q: "¿Qué significa 'extra virgen' y por qué importa?",
        a: "'Extra virgen' es la categoría más alta del aceite de oliva: acidez libre menor a 0,8 g/100g y sin defectos sensoriales en panel de cata. Se obtiene solo por medios mecánicos (prensado en frío), sin solventes ni refinamiento químico. Fuera del mundo italiano se abusa del término; nosotros verificamos análisis de cada lote.",
      },
      {
        q: "¿Cuál es la diferencia entre aceite DOP y no DOP?",
        a: "DOP (Denominazione di Origine Protetta) certifica que las aceitunas se cultivaron, cosecharon y prensaron en una zona geográfica específica y respetando cultivares y métodos tradicionales. Ejemplos: Chianti Classico DOP, Terra di Bari DOP, Riviera Ligure DOP. Un aceite extra virgen italiano sin DOP puede ser excelente pero no tiene esa trazabilidad regional.",
      },
      {
        q: "¿Cuánto dura abierto y cómo conservarlo?",
        a: "Un aceite extra virgen se consume idealmente dentro de los 12–18 meses de la cosecha. Una vez abierto, dura de 2 a 3 meses en su punto sin oxidarse. Guardalo en un lugar oscuro y fresco (18–22 °C), nunca al lado de la cocina ni expuesto al sol. La botella oscura protege de la luz.",
      },
    ],
    metaTitle: "Aceites de oliva italianos extra virgen · Toscana, Puglia, DOP",
    metaDescription:
      "Aceite de oliva extra virgen italiano (olio extravergine) de Toscana, Puglia, Sicilia y Liguria. Prensado en frío, DOP e IGP. Seleccionados por perfil sensorial. Envíos a todo el país.",
  },

  conservas: {
    slug: "conservas",
    eyebrow: "Conserve italiane",
    h1: "Conservas italianas importadas",
    intro:
      "La despensa italiana vive en sus conservas: pomodori pelados San Marzano DOP (la única variedad reconocida para el vero ragù napoletano), passata di pomodoro, tomate datterino, pesto alla genovese, vegetales al olio (alcauciles, berenjenas, peperoni arrostiti), anchoas del Cantábrico y de Sicilia en aceite, aceitunas taggiasche de Liguria, tapenade, pestos al tartufo y cremas de verduras. Cada conserva debería leerse como ingrediente: miramos lista corta, aceite de oliva de verdad (no girasol), sal marina, sin acidulantes extras.",
    faqs: [
      {
        q: "¿Qué es el pomodoro San Marzano DOP?",
        a: "Es una variedad de tomate cultivada en la zona volcánica de Agro Sarnese-Nocerino, entre Nápoles y Salerno. Tiene forma alargada, pulpa firme, pocas semillas y acidez baja. Es el único tomate reconocido por la Associazione Verace Pizza Napoletana para una pizza margherita auténtica. El DOP garantiza origen y método de producción — cuidado con imitaciones con etiqueta parecida.",
      },
      {
        q: "¿Tienen pesto genovese con DOP?",
        a: "Sí. Trabajamos pestos alla genovese con albahaca genovese DOP, piñones mediterráneos, pecorino sardo y parmigiano reggiano, aceite de oliva extra virgen ligur y sin queso vegetal ni espesantes. Diferencia abismal con los pestos industriales con aceite de girasol.",
      },
      {
        q: "¿Las anchoas italianas valen la pena?",
        a: "Absolutamente. Las de Sciacca (Sicilia) y las del Cantábrico son las mejores del Mediterráneo: maduración larga en sal, fileteado a mano, aceite de oliva de calidad. El precio por lata es mayor, pero hablamos de otro producto: carne firme, sabor umami profundo, sin metalizado. Ideales sobre pan con manteca, en una pasta puttanesca o sobre pizza.",
      },
    ],
    metaTitle: "Conservas italianas · Pomodoro San Marzano DOP, Pesto, Anchoas",
    metaDescription:
      "Conservas italianas importadas: pomodoro San Marzano DOP, passata, pesto genovese DOP, aceitunas taggiasche, anchoas, alcauciles al olio y más. Envíos a todo el país.",
  },

  cafe: {
    slug: "cafe",
    eyebrow: "Caffè italiano",
    h1: "Café italiano importado",
    intro:
      "El café italiano es un ritual: espresso corto, crema avellana, tueste medio-oscuro con predominio de Robusta para el cuerpo y aromas de cacao. En Italmarket trabajamos las tostadurías históricas (Illy, Lavazza Gran Selezione, Pellini Top, Kimbo Napoletano, Vergnano, Hausbrandt) y también blends artesanales de torrefattori más chicos. Tenemos café en grano, molido para moka, cápsulas compatibles Nespresso y cápsulas originales, además de todo lo que rodea el ritual: cafeteras moka Bialetti, tazas espresso, azúcar de caña, amaretti para acompañar.",
    faqs: [
      {
        q: "¿Prefieren café 100% Arábica o blend con Robusta?",
        a: "Depende del perfil buscado. El café italiano clásico (napoletano, turinese) es un blend Arábica + Robusta: la Robusta aporta cuerpo, crema densa y amargor estructural. El 100% Arábica es más suave, más frutado y más aromático. Para una moka casera, un blend funciona mejor; para filtro o V60, 100% Arábica single origin.",
      },
      {
        q: "¿Tienen café molido para moka (cafetera italiana)?",
        a: "Sí. El molido moka es clave: medio-fino, ni el de filtro (muy grueso) ni el de espresso (muy fino). Las latas italianas de molido moka vienen exactamente con ese punto. También vendemos molido espresso y grano entero si tenés molinillo.",
      },
      {
        q: "¿Venden la cafetera Bialetti original?",
        a: "Sí, la Bialetti Moka Express original (3, 6, 9 tazas) y modelos premium como la Venus y la Brikka. La moka es el ícono del café italiano casero desde 1933.",
      },
    ],
    metaTitle: "Café italiano · Illy, Lavazza, Kimbo, moka Bialetti",
    metaDescription:
      "Café italiano importado (Illy, Lavazza Gran Selezione, Pellini, Kimbo Napoletano, Vergnano) en grano, molido moka y cápsulas. Cafeteras Bialetti originales. Envíos a todo el país.",
  },
};

export function getCategorySeo(slug: string): CategorySEO | undefined {
  return CATEGORY_SEO[slug];
}
