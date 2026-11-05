/** Large decorative SVGs. Server-only: never import from a client component. */
const modules = import.meta.glob('../assets/svg/decorations/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const registry = new Map<string, string>(
  Object.entries(modules).map(([path, markup]) => [path.split('/').pop()!.replace('.svg', ''), markup]),
);

export function decoration(name: string): string {
  const markup = registry.get(name);
  if (!markup) throw new Error(`Unknown decoration "${name}"`);
  return markup;
}
