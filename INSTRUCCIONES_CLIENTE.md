# Guía de uso — Italmarket + Claude

Cómo administrar **italmarket.com.ar** conversando con Claude.
No hace falta saber programar: solo describí en palabras lo que querés y Claude lo hace.

---

## Índice

1. [¿Qué es esto y cómo funciona?](#1-qué-es-esto-y-cómo-funciona)
2. [Antes de empezar](#2-antes-de-empezar)
3. [Cómo hablarle a Claude (reglas de oro)](#3-cómo-hablarle-a-claude-reglas-de-oro)
4. [Productos — agregar, modificar, eliminar](#4-productos--agregar-modificar-eliminar)
5. [Carrito y ventas asistidas](#5-carrito-y-ventas-asistidas)
6. [Textos e imágenes del sitio](#6-textos-e-imágenes-del-sitio)
7. [Datos de contacto y sucursales](#7-datos-de-contacto-y-sucursales)
8. [Ofertas, promociones y cupones](#8-ofertas-promociones-y-cupones)
9. [Flyers y piezas gráficas](#9-flyers-y-piezas-gráficas)
10. [Newsletter y mailings](#10-newsletter-y-mailings)
11. [Nuevas secciones o páginas](#11-nuevas-secciones-o-páginas)
12. [Publicar los cambios](#12-publicar-los-cambios)
13. [Preguntas frecuentes](#13-preguntas-frecuentes)

---

## 1. ¿Qué es esto y cómo funciona?

Tu sitio **italmarket.com.ar** está conectado a **Claude** (un asistente de inteligencia artificial) a través de un puente llamado **MCP**. Eso significa que Claude puede:

- **Leer** el catálogo de productos de tu WooCommerce en tiempo real.
- **Armar carritos** y generar links de checkout para tus clientes.
- **Modificar** cualquier parte del sitio (textos, imágenes, páginas, colores, ofertas, etc.).
- **Crear** piezas nuevas: flyers, mailings, landings de promoción.

Vos hablás con Claude **en lenguaje común** y él se encarga de la parte técnica.

> **Importante:** Claude no publica nada online solo. Hace los cambios en un entorno de prueba y después los publicás vos (o tu desarrollador) con un paso final. Ver [sección 12](#12-publicar-los-cambios).

---

## 2. Antes de empezar

### Dónde hablar con Claude

Abrí la aplicación **Claude** (escritorio o web) en el equipo que tiene instalado el proyecto Italmarket. El MCP ya está conectado — no hace falta configurar nada cada vez.

### Cómo saber si el MCP está conectado

Preguntale a Claude:

> *"¿Podés buscar el producto 'parmesano' en el catálogo?"*

Si te devuelve resultados con precio y stock, la conexión funciona.
Si dice que no tiene acceso, avisale a tu desarrollador.

### Qué tener a mano

- **Fotos** en buena calidad (JPG o PNG, idealmente 1200px de ancho o más).
- **Textos** ya redactados o una idea clara de lo que querés comunicar.
- **Datos concretos**: precios, fechas de vigencia, códigos de cupón, etc.

---

## 3. Cómo hablarle a Claude (reglas de oro)

**1. Sé específico.** Cuanto más detalle das, mejor sale.

- Mal: *"Subí un producto."*
- Bien: *"Subí el producto Parmigiano Reggiano 24 meses, $12.500, 200g, categoría Quesos, con esta foto: [adjunto]."*

**2. Pedí una cosa por vez** (o varias pero ordenadas).
Claude puede hacer 5 tareas en una conversación, pero si le tirás todo junto y sin orden, se pierde.

**3. Pedí que te muestre antes de publicar.**

> *"Antes de guardarlo, mostrame cómo va a quedar."*

**4. Si algo no te gusta, decilo en criollo.**

> *"El título está muy grande, achicalo."*
> *"Cambiá el verde, quiero un tono más oscuro."*

**5. Para tareas complejas, adjuntá ejemplos.**
Si querés un flyer estilo "estos tres que te paso", adjuntá imágenes de referencia.

---

## 4. Productos — agregar, modificar, eliminar

Los productos viven en **WooCommerce** (el panel de administración clásico de WordPress). Hay dos caminos:

### A. Agregarlos vos desde WooCommerce

Entrás a `italmarket.com.ar/wp-admin` → **Productos** → **Añadir nuevo**. Es el método tradicional.

### B. Pedirle a Claude que los prepare

Podés pedirle a Claude que:

- **Te arme la ficha completa** (título, descripción corta, descripción larga, SEO, categorías sugeridas) a partir de un nombre o foto.
- **Corrija descripciones** existentes con mejor redacción.
- **Traduzca** fichas del italiano o inglés.
- **Sugiera categorías** y etiquetas coherentes con el resto del catálogo.

**Ejemplos de pedidos:**

> *"Redactame la ficha de producto del 'Prosciutto di Parma DOP 18 meses'. Tono editorial, corto, destacando el método de curado. Incluí meta-título y meta-descripción SEO."*

> *"Revisá las fichas de la categoría 'Aceites' y unificá el tono. Todas deberían tener una oración de origen, una de maridaje y una de conservación."*

> *"Sacá del catálogo el producto 'Panettone 2023' — ya no se vende."*
> *(Claude te guía para desactivarlo o ponerlo fuera de stock en WooCommerce.)*

### Buscar un producto puntual

> *"¿Cuánto stock me queda de burrata?"*
> *"Mostrame todos los productos de la categoría 'Pastas' ordenados por precio."*

---

## 5. Carrito y ventas asistidas

Si un cliente te escribe por WhatsApp o teléfono y querés armarle el pedido sin que tenga que buscar uno por uno, pedile a Claude:

> *"Armá un carrito con: 2 burratas, 1 prosciutto di parma, 1 aceite Frantoia 500ml. Generame el link de checkout para mandárselo al cliente."*

Claude te devuelve una URL — se la pasás al cliente y él paga directamente.

También podés:

- **Aplicar cupones** antes de enviar el link (*"Agregale el cupón BIENVENIDA10"*).
- **Ver qué hay** en un carrito que armaste antes.
- **Conectar el carrito del navegador** con el de Claude para trabajar ambos sobre el mismo pedido.

---

## 6. Textos e imágenes del sitio

Todos los textos visibles del sitio (home, nosotros, sucursales, etc.) se pueden editar pidiéndoselo a Claude.

### Ejemplos

> *"Cambiá el título del home de 'Delizie Italiane' a 'Auténtica Italia en Buenos Aires'."*

> *"Reescribí la sección 'Nuestra historia' para que sea más emocional, mencionando a mi abuelo que llegó en 1952."*

> *"Cambiá la foto principal del home por esta [adjunto foto]."*

> *"En la página de Sucursales, actualizá el horario de Barrio Norte: ahora abrimos domingos de 10 a 14."*

### Imágenes

- Pasale la foto por el chat (arrastrar al cuadro de texto).
- Decile dónde va: *"Reemplazá la foto del hero"*, *"Agregá esta foto a la galería de San Telmo"*.
- Si querés, pedí recortes o variantes: *"Hacela cuadrada para Instagram"*, *"Probá una versión con más contraste"*.

---

## 7. Datos de contacto y sucursales

Los datos de contacto (teléfonos, emails, direcciones, WhatsApp, redes sociales, horarios) aparecen en varios lugares del sitio: footer, página de contacto, página de sucursales, schema SEO.

**Cuando cambie algo, pedilo una sola vez** y Claude lo actualiza en todos los lugares.

### Ejemplos

> *"Cambié el WhatsApp. Ahora es +54 9 11 5555-1234. Actualizalo donde aparezca."*

> *"Agregá una tercera sucursal: Italmarket Palermo, Av. Santa Fe 3456, tel 4777-1234, horario lunes a sábado 9 a 21."*

> *"Sacá la dirección de mail 'ventas@italmarket' del footer, dejá solo 'hola@italmarket.com.ar'."*

> *"Agregá el link de Instagram (@italmarket.ar) en el header y en el footer."*

---

## 8. Ofertas, promociones y cupones

### Ofertas por producto o categoría

Los precios y descuentos **se cargan en WooCommerce** (campo "Precio rebajado"). Claude puede ayudarte a:

- Preparar el listado de qué productos entran.
- Redactar el copy promocional.
- Armar el banner del home anunciándola.
- Crear una **página de landing** dedicada a la promo.

### Cupones

Los cupones también viven en WooCommerce (Marketing → Cupones). Pedile a Claude:

> *"Necesito un cupón BIENVENIDA10 del 10% para primeros compradores, válido 30 días. Guiame paso a paso para cargarlo en WooCommerce."*

### Anunciar la promo en el sitio

> *"Agregá una barra superior que diga 'ENVÍO GRATIS en compras mayores a $30.000'. Color rosso. Con un botón 'Ver productos'."*

> *"Armá una sección en el home para la promo de Semana Santa: banner grande, 6 productos seleccionados, botón 'Ver todo'. Vigencia del 10 al 20 de abril."*

---

## 9. Flyers y piezas gráficas

Claude puede diseñar flyers digitales para **redes sociales, WhatsApp o email** respetando la identidad de marca de Italmarket (paleta ivory / verde bosco / rosso / oro, tipografías Cormorant + Inter).

### Cómo pedirlo

> *"Armame un flyer para Instagram (formato 1080×1350) anunciando la llegada del nuevo Parmigiano Reggiano 36 meses. Estilo editorial, foto grande arriba, texto abajo."*

> *"Necesito 3 placas cuadradas (1080×1080) para stories, una por cada nueva pasta artesanal. Misma estética entre las tres."*

> *"Hacé un flyer para imprimir A5 con el menú de degustación del sábado."*

### Qué te devuelve

Claude genera el diseño en HTML/imagen y te lo muestra. Si te gusta, lo descargás; si no, pedís ajustes (*"más grande el título"*, *"cambiá la foto"*, *"probá fondo oscuro"*).

---

## 10. Newsletter y mailings

### Lista de suscriptores

Se captura desde el formulario del home. Consultale a Claude:

> *"¿Cuántos suscriptores nuevos tengo este mes?"*
> *"Exportame la lista en CSV."*

### Redactar un mailing

> *"Escribí un mailing para mandar el viernes anunciando la nueva carta de quesos de temporada. Tono cálido, corto, con 3 productos destacados y un botón al sitio."*

> *"Armá la versión HTML del mail con el mismo diseño visual del sitio. Mostrámelo antes de enviarlo."*

### Envío

Claude puede **preparar** el mail pero el **envío masivo** se hace desde una plataforma (Mailchimp, Brevo, o la que uses). Pedile que te deje el HTML listo para pegar ahí.

---

## 11. Nuevas secciones o páginas

Si querés sumar algo nuevo al sitio — una página de eventos, un blog de recetas, un catálogo para regalos corporativos, etc. — describílo y Claude lo arma.

### Ejemplos

> *"Quiero una página nueva /recetas donde pueda ir cargando recetas italianas con foto, ingredientes y paso a paso. Que se vea desde el menú principal."*

> *"Armá una landing /corporativo para ventas a empresas: formulario de contacto con campos 'empresa', 'cantidad estimada', 'mensaje'."*

> *"Agregá una sección 'Preguntas frecuentes' en la página de contacto con 8 preguntas típicas (envíos, devoluciones, horarios, etc.). Las respuestas las completo yo."*

---

## 12. Publicar los cambios

Cuando Claude termina una edición:

1. **Te muestra una vista previa** en el entorno local (si estás trabajando con tu desarrollador) o te deja los archivos listos.
2. **Revisás** que esté todo como querés.
3. **Se publica** con un comando (`npm run build` + deploy) o directamente con *"Subilo al sitio"* si tu desarrollador ya dejó el despliegue automático configurado.

> **Regla importante:** los cambios **no se ven en italmarket.com.ar hasta que se publican**. Si hiciste un cambio y no lo ves online, probablemente falta el paso de deploy. Preguntale a Claude:
>
> *"¿Quedó publicado el cambio del footer o todavía está local?"*

---

## 13. Preguntas frecuentes

**¿Le puedo pedir cualquier cosa a Claude?**
Sí, pero algunas cosas requieren pasos manuales (ej: generar cupones en WooCommerce, enviar mails masivos). Claude te guía paso a paso.

**¿Si me equivoco, puedo volver atrás?**
Sí. Todos los cambios quedan registrados en el historial (Git). Pedí: *"Revertí el último cambio del home."*

**¿Claude puede borrar todo el sitio por error?**
No. Los cambios pasan siempre por una revisión tuya antes de publicarse. Además hay copias de seguridad automáticas.

**¿Puedo usar esto desde el celular?**
Sí — la app Claude funciona en iOS y Android. Eso sí, para publicar cambios al sitio conviene estar en la compu donde está instalado el proyecto.

**¿Y si Claude no entiende lo que quiero?**
Reformulá en palabras más simples, o dale un ejemplo. Si sigue sin entender, escribile a tu desarrollador.

**¿Cuánto cuesta usar Claude?**
Claude funciona con una suscripción mensual que contratás a tu nombre en [claude.ai](https://claude.ai). Alcanza con el plan más básico (Pro) para administrar el sitio sin problema. No se paga por tarea: dentro del plan podés pedir todo lo que necesites.

**¿Puedo ver estadísticas del sitio por acá?**
Claude puede **leer** datos del catálogo y del carrito. Para analytics (visitas, conversiones) conviene Google Analytics o Plausible — pedile que te resuma los números si tenés esas cuentas conectadas.

---

## Contacto técnico

Para cualquier duda que exceda esta guía, escribile a tu desarrollador. Mencionalo también si ves algo raro en el sitio (un error, una imagen rota, un precio mal cargado).

*Última actualización: abril 2026*
