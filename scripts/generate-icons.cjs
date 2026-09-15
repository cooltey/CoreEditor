const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const rootDir = path.resolve(__dirname, '..');
  const buildIco = path.join(rootDir, 'build', 'icon.ico');
  const publicIco = path.join(rootDir, 'public', 'icon.ico');

  // Check if native conversion libraries are installed
  let Resvg, pngToIco;
  try {
    Resvg = require('@resvg/resvg-js').Resvg;
    const pngToIcoMod = require('png-to-ico');
    pngToIco = pngToIcoMod.default || pngToIcoMod;
  } catch {
    // If dependencies are not installed on the user's system,
    // gracefully rely on the pre-built icon.ico committed in the repository
    if (fs.existsSync(buildIco)) {
      console.log('[*] Using pre-built Windows icon:', buildIco);
      return;
    }
    if (fs.existsSync(publicIco)) {
      const buildDir = path.join(rootDir, 'build');
      if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });
      fs.copyFileSync(publicIco, buildIco);
      console.log('[*] Copied pre-built icon to:', buildIco);
      return;
    }
    console.warn('[!] Optional icon generator dependencies not found, skipping icon regeneration.');
    return;
  }

  const svgPath = path.join(rootDir, 'public', 'doge-target-icon.svg');
  if (!fs.existsSync(svgPath)) {
    return;
  }

  try {
    const svg = fs.readFileSync(svgPath, 'utf-8');

    // 1. High-resolution 512x512 PNG
    const resvg512 = new Resvg(svg, { fitTo: { mode: 'width', value: 512 } });
    const png512 = resvg512.render().asPng();

    // 2. Multi-resolution Windows ICO (256, 128, 64, 48, 32, 16)
    const sizes = [256, 128, 64, 48, 32, 16];
    const pngBuffers = sizes.map(size => {
      const r = new Resvg(svg, { fitTo: { mode: 'width', value: size } });
      return r.render().asPng();
    });

    const icoBuffer = await pngToIco(pngBuffers);

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

    console.log('[✓] Successfully updated full-color multi-resolution icon.ico and icon.png!');
  } catch (err) {
    console.warn('[!] Could not regenerate icon, using existing pre-built icon:', err.message);
  }
}

generateIcons().then(() => {
  process.exit(0);
}).catch(() => {
  process.exit(0);
});
