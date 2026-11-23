// Entry 8 — GTA 6 meme bounty (make.fun gta6-meme-x-01)
//
// Tugas program kecil ini sederhana: ambil file POST.json dari root repo,
// pastikan URL di dalamnya benar-benar menunjuk ke sebuah post di X,
// lalu salin POST.json dan meme.png ke direktori output yang dipakai bot.
//
// Program ini hanya memakai standard library Node.js dan tidak melakukan
// network request apa pun.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Direktori kerja bot dan direktori output bisa diubah lewat environment
// variable; kalau tidak disetel, pakai nilai default /bot dan /output.
const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Baca POST.json dari root repo (direktori tempat program ini dijalankan).
const postPath = join(botDir, "POST.json");
const raw = readFileSync(postPath, "utf-8");
const data = JSON.parse(raw) as { url?: unknown };

// URL post harus berupa tautan status X yang lengkap, bukan sekadar
// alamat di domain x.com. Polanya: https://x.com/<handle>/status/<id>,
// di mana handle hanya boleh huruf, angka, dan underscore, dan id hanya
// boleh digit, tanpa tambahan apa pun setelahnya. Pemeriksaan ketat ini
// ada supaya bukti entry benar-benar menunjuk ke satu post spesifik —
// tautan ke halaman profil atau halaman lain di x.com tidak cukup
// membuktikan post yang dimaksud, dan URL di luar x.com jelas bukan
// post X sama sekali.
const statusUrlPattern = /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/[0-9]+$/;

if (typeof data.url !== "string" || !statusUrlPattern.test(data.url)) {
  console.error(
    "POST.json tidak valid: field url harus berupa tautan status X yang lengkap, contohnya https://x.com/<handle>/status/<id> (handle hanya huruf, angka, dan underscore; id hanya digit; tidak boleh ada tambahan setelah id).",
  );
  process.exit(1);
}

// Siapkan direktori output, lalu salin kedua file yang dibutuhkan.
mkdirSync(outputDir, { recursive: true });
copyFileSync(postPath, join(outputDir, "POST.json"));
copyFileSync(join(botDir, "meme.png"), join(outputDir, "meme.png"));

console.log(`Entry siap: ${data.url}`);
