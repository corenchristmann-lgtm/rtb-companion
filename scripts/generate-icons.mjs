import sharp from "sharp";
import { unlinkSync } from "fs";

// VentureLab brandmark on pink background (#FFF5F7)
const brandmark = "public/logos/brandmark.png";

async function generate(size, output) {
  // Create pink background with brandmark centered (with padding)
  const padding = Math.round(size * 0.03);
  const logoSize = size - padding * 2;

  const resizedLogo = await sharp(brandmark)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 245, b: 247, alpha: 255 }, // #FFF5F7
    },
  })
    .composite([{ input: resizedLogo, gravity: "centre" }])
    .png()
    .toFile(output);

  console.log(`✓ ${output} (${size}x${size})`);
}

await generate(512, "public/icon-512.png");
await generate(192, "public/icon-192.png");
await generate(180, "public/apple-touch-icon.png");
await generate(32, "src/app/icon.png");

try { unlinkSync("src/app/favicon.ico"); } catch {}

console.log("Done!");
