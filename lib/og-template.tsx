import { ImageResponse } from "next/og";

/**
 * Shared OpenGraph image template for Italmarket (1200×630). Rendered via
 * Satori through next/og. Consumed by `opengraph-image.tsx` route files under
 * `app/`; each route passes its own eyebrow/title/kicker so we get a branded
 * card for every landing, recipe, marca and landing theme without maintaining
 * a separate SVG per surface.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const COLORS = {
  ivory: "#FAF6EC",
  ivoryDark: "#F3ECD7",
  ink: "#0E0E0C",
  muted: "#5A544A",
  accent: "#B8312B",
  gold: "#B08836",
};

let fontPromise: Promise<ArrayBuffer> | null = null;

/**
 * Lazily fetches Cormorant Garamond (600) from Google Fonts. Caches the
 * Promise at module scope so repeated OG renders reuse the same fetch.
 * Falls back to `null` when offline so the route still renders with Satori
 * defaults instead of crashing.
 */
async function loadSerif(): Promise<ArrayBuffer | null> {
  if (fontPromise) return fontPromise.catch(() => null);
  fontPromise = (async () => {
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    );
    const css = await cssRes.text();
    const match = css.match(/src:\s*url\(([^)]+\.ttf)\)/);
    if (!match) throw new Error("Cormorant TTF URL not found");
    const fontRes = await fetch(match[1]);
    return fontRes.arrayBuffer();
  })();
  return fontPromise.catch(() => null);
}

export interface OgTemplateProps {
  /** Small caps label above the headline, e.g. "Receta", "Marca". */
  eyebrow?: string;
  /** Main serif headline. Truncated automatically if too long. */
  title: string;
  /** Kicker / subtitle under the title. */
  kicker?: string;
  /** Right-side column label, e.g. "Barolo DOCG · Piemonte". */
  meta?: string;
  /** Accent color for the vertical rule. Defaults to Italian red. */
  accent?: string;
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

export async function renderOgImage(props: OgTemplateProps): Promise<ImageResponse> {
  const font = await loadSerif();
  const accent = props.accent ?? COLORS.accent;
  const title = truncate(props.title, 70);
  const kicker = props.kicker ? truncate(props.kicker, 140) : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: COLORS.ivory,
          padding: "64px 72px",
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "40px",
            border: `1px solid ${COLORS.ink}22`,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              letterSpacing: "0.32em",
              fontSize: 22,
              color: COLORS.ink,
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 600,
            }}
          >
            <span>ITALMARKET</span>
            <span
              style={{
                fontSize: 12,
                letterSpacing: "0.3em",
                color: COLORS.muted,
                marginTop: 4,
                fontWeight: 500,
              }}
            >
              DELIZIE ITALIANE · BUENOS AIRES
            </span>
          </div>
          {props.meta && (
            <div
              style={{
                fontSize: 18,
                letterSpacing: "0.22em",
                color: COLORS.muted,
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 500,
                textTransform: "uppercase",
                maxWidth: 460,
                textAlign: "right",
              }}
            >
              {props.meta}
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 40,
            maxWidth: 960,
          }}
        >
          {props.eyebrow && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 3,
                  backgroundColor: accent,
                }}
              />
              <span
                style={{
                  fontSize: 22,
                  letterSpacing: "0.32em",
                  color: accent,
                  textTransform: "uppercase",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontWeight: 600,
                }}
              >
                {props.eyebrow}
              </span>
            </div>
          )}
          <div
            style={{
              fontSize: title.length > 48 ? 82 : title.length > 28 ? 102 : 120,
              lineHeight: 1.05,
              color: COLORS.ink,
              fontWeight: 600,
              letterSpacing: "-0.015em",
            }}
          >
            {title}
          </div>
          {kicker && (
            <div
              style={{
                marginTop: 24,
                fontSize: 30,
                lineHeight: 1.35,
                color: COLORS.muted,
                maxWidth: 880,
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 400,
              }}
            >
              {kicker}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: `1px solid ${COLORS.ink}22`,
            fontSize: 18,
            letterSpacing: "0.22em",
            color: COLORS.muted,
            textTransform: "uppercase",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 500,
          }}
        >
          <span>italmarket.com.ar</span>
          <span>Barrio Norte · San Telmo</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font
        ? [
            {
              name: "Cormorant Garamond",
              data: font,
              style: "normal",
              weight: 600,
            },
          ]
        : [],
    },
  );
}
