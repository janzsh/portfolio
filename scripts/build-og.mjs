// Rasterizes scripts/og.svg -> public/og.png (social crawlers do not render SVG og:image).
// sharp needs a Nix-provided runtime, so run it inside the dev shell:
//   nix develop --command pnpm run og
import sharp from 'sharp';

await sharp('scripts/og.svg', { density: 144 }).resize(1200, 630).png({ compressionLevel: 9 }).toFile('public/og.png');
console.log('public/og.png written');
