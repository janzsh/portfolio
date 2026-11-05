// Only the icons the IDE uses. The shared registry bundles every SVG, which is far too much to ship
// inside a client island, so each one is imported on its own and the bundler keeps just these.
import braces from '../../assets/svg/icons/braces.svg?raw';
import branch from '../../assets/svg/icons/branch.svg?raw';
import close from '../../assets/svg/icons/close.svg?raw';
import downArrow from '../../assets/svg/icons/down-arrow.svg?raw';
import folder from '../../assets/svg/icons/folder.svg?raw';
import markdown from '../../assets/svg/icons/markdown.svg?raw';
import rightArrow from '../../assets/svg/icons/right-arrow.svg?raw';
import logo from '../../assets/svg/brand/logo.svg?raw';

const ICONS = { braces, branch, close, 'down-arrow': downArrow, folder, markdown, 'right-arrow': rightArrow, logo } as const;

export type IdeIconName = keyof typeof ICONS;

export const isIdeIcon = (name: string): name is IdeIconName => name in ICONS;

export function IdeIcon({ name, size = '1em', class: className = '' }: { name: string; size?: string; class?: string }) {
  if (!isIdeIcon(name)) throw new Error(`Unknown IDE icon "${name}"`);
  return <span class={`icon ${className}`.trim()} style={`--size:${size}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />;
}
