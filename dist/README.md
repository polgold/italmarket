# Italmarket — Distributable artifacts

## `italmarket-wp.dxt`

Claude Desktop Extension para conectar el WordPress MCP del cliente.

### Uso (cliente)
1. Doble-click en `italmarket-wp.dxt`.
2. Claude Desktop pide un token JWT.
3. Generarlo en `https://shop.italmarket.com.ar/wp-admin` → **WordPress MCP → Authentication Tokens** (elegir 30 días).
4. Pegar el token y guardar.

### Rebuild
Después de editar `italmarket-wp-dxt/manifest.json`:

```bash
cd dist/italmarket-wp-dxt
zip -r ../italmarket-wp.dxt . -x "*.DS_Store"
```

### Contenido
```
italmarket-wp.dxt (zip)
├── manifest.json   Metadatos del connector + URL del MCP + campo para token
└── icon.png        Emblem de marca (copia de /public/brand/emblem.png)
```

El connector usa `mcp-remote` (vía `npx`) para convertir el transporte HTTP streamable del WordPress MCP a stdio, que es lo que Claude Desktop consume. Requiere Node.js ≥18 instalado en la máquina del cliente.
