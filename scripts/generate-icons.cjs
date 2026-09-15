const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const pngToIcoMod = require('png-to-ico');
const pngToIco = pngToIcoMod.default || pngToIcoMod;

async function generateIcons() {
  console.log('[*] Generating high-fidelity Windows icons (.ico & .png)...');
  const rootDir = path.resolve(__dirname, '..');
  const svgPath = path.join(rootDir, 'public', 'doge-target-icon.svg');

  if (!fs.existsSync(svgPath)) {
    console.error('[!] SVG source icon not found at', svgPath);
    return;
  }

  const svg = fs.readFileSync(svgPath, 'utf-8');

  // 1. High-resolution 512x512 PNG
  const resvg512 = new Resvg(svg, { fitTo: { mode: 'width', value: 512 } });
  const png512 = resvg512.render().asPng();

  // 2. Multi-resolution PNG buffers for Windows ICO standard:
  // Windows Explorer, Taskbar, Start Menu, Desktop, and NSIS installer
  // require 256, 128, 64, 48, 32, 16 sizes.
  const sizes = [256, 128, 64, 48, 32, 16];
  const pngBuffers = sizes.map(size => {
    const r = new Resvg(svg, { fitTo: { mode: 'width', value: size } });
    return r.render().asPng();
  });

  const icoBuffer = await pngToIco(pngBuffers);

  // Targets to write
  const destDirs = [
    path.join(rootDir, 'public'),
    path.join(rootDir, 'dist'),
    path.join(rootDir, 'build'),
    path.join(rootDir, 'electron', 'resources'),
  ];

  for (const dir of destDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, 'icon.ico'), icoBuffer);
    fs.writeFileSync(path.join(dir, 'icon.png'), png512);
  }

  console.log('[✓] Successfully generated full-color multi-resolution icon.ico and icon.png!');
}

generateIcons().catch(err => {
  console.error('[!] Failed to generate icons:', err);
  process.exit(1);
});
