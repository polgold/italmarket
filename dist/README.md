# Italmarket — Distributable artifacts

## `italmarket-wp.dxt`

Claude Desktop Extension para conectar el WordPress MCP del cliente.

### Uso (cliente)
1. Doble-click en `italmarket-wp.dxt`.
2. Claude Desktop pide **usuario** y **Application Password**.
3. Generar la Application Password en `https://shop.italmarket.com.ar/wp-admin` → **Usuarios → tu perfil → Contraseñas de aplicación** (hasta el final de la página).
   - Nombre sugerido: `claude-desktop`.
   - Copiar la password que aparece una sola vez (formato `abcd EFGH ijkl MNOP qrst UVWX`).
4. Pegar usuario + password en Claude Desktop y guardar.

> **Recomendado:** crear un usuario WordPress dedicado (`claude-bot`) con el rol mínimo necesario (Administrator si se van a tocar páginas y media, Shop Manager si es solo WooCommerce) y emitir la Application Password desde ese usuario. Si algún día querés revocar el acceso, borrás la password sin afectar tu login personal.

### Por qué Application Passwords y no JWT
Los JWT del plugin WordPress MCP vencen a los 30 días máximo. Las Application Passwords son nativas de WordPress, no vencen hasta que las revocás manualmente, y se pueden listar/borrar desde el perfil del usuario.

### Rebuild
Después de editar `italmarket-wp-dxt/manifest.json` o `wrapper.js`:

```bash
cd dist/italmarket-wp-dxt
zip -r ../italmarket-wp.dxt . -x "*.DS_Store"
```

### Contenido
```
italmarket-wp.dxt (zip)
├── manifest.json   Metadatos del connector + campos user/app_password
├── wrapper.js      Arma el header Authorization: Basic base64(user:password) y lanza mcp-remote
└── icon.png        Emblem de marca (copia de /public/brand/emblem.png)
```

`wrapper.js` convierte usuario + Application Password en un header HTTP `Authorization: Basic` y delega a `mcp-remote` (vía `npx`), que traduce el transporte HTTP streamable del WordPress MCP a stdio (lo que Claude Desktop consume). Requiere Node.js ≥18 en la máquina del cliente.
