import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";

// VentureLab brandmark — purple circle with kite
// We'll create a simple purple icon with "RTB" text as SVG, then convert
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#7A4AED"/>
  <text x="256" y="290" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="180" fill="white">RTB</text>
  <text x="256" y="380" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="600" font-size="60" fill="white" opacity="0.7">VentureLab</text>
</svg>`;

const svgBuffer = Buffer.from(svg);

// Generate PWA icons
await sharp(svgBuffer).resize(512, 512).png().toFile("public/icon-512.png");
await sharp(svgBuffer).resize(192, 192).png().toFile("public/icon-192.png");
await sharp(svgBuffer).resize(180, 180).png().toFile("public/apple-touch-icon.png");

// Generate favicon (32x32 PNG, Next.js 14+ supports PNG favicons)
await sharp(svgBuffer).resize(32, 32).png().toFile("src/app/icon.png");

// Remove old .ico
import { unlinkSync } from "fs";
try { unlinkSync("src/app/favicon.ico"); } catch {}

console.log("✓ Icons generated: icon-512, icon-192, apple-touch-icon, favicon");
