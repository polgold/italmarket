/**
 * Renders a JSON-LD block inside a `<script type="application/ld+json">` tag.
 * Pass the Schema.org object (or array) as `data` — serialization runs on the
 * server, so bots see the structured data without waiting for JS.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
