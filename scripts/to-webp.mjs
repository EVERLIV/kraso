import sharp from 'sharp';
import { readdirSync, statSync, unlinkSync } from 'fs';
import { join, extname } from 'path';

const DIRS = ['public/templates', 'public/landing', 'public/main'];
const MAX_W = 1200;
const QUALITY = 82;
const exts = new Set(['.jpg', '.jpeg', '.png']);

let converted = 0, savedBytes = 0, failed = 0;

async function processFile(file) {
    const ext = extname(file).toLowerCase();
    if (!exts.has(ext)) return;
    const out = file.slice(0, -ext.length) + '.webp';
    try {
        const before = statSync(file).size;
        const img = sharp(file);
        const meta = await img.metadata();
        const pipeline = (meta.width && meta.width > MAX_W) ? img.resize({ width: MAX_W }) : img;
        await pipeline.webp({ quality: QUALITY }).toFile(out);
        const after = statSync(out).size;
        unlinkSync(file); // remove original
        converted++;
        savedBytes += (before - after);
        if (converted % 25 === 0) console.log(`  …${converted} готово`);
    } catch (e) {
        console.error('FAIL', file, e.message);
        failed++;
    }
}

async function walk(dir) {
    let entries;
    try { entries = readdirSync(dir); } catch { return; }
    for (const name of entries) {
        const p = join(dir, name);
        const st = statSync(p);
        if (st.isDirectory()) await walk(p);
        else await processFile(p);
    }
}

for (const d of DIRS) { console.log('DIR', d); await walk(d); }
console.log(`\n✅ Конвертировано: ${converted}, ошибок: ${failed}, экономия: ${(savedBytes / 1048576).toFixed(1)} МБ`);
