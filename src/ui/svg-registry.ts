/**
 * Icons and brand marks as raw SVG strings. Small enough to ship to the client,
 * so Astro and Preact render identical markup from one source.
 */
const modules = import.meta.glob('../assets/svg/{icons,brand}/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const registry = new Map<string, string>(
  Object.entries(modules).map(([path, markup]) => [path.split('/').pop()!.replace('.svg', ''), markup]),
);

export function svg(name: string): string {
  const markup = registry.get(name);
  if (!markup) throw new Error(`Unknown svg asset "${name}"`);
  return markup;
}
