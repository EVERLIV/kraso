
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'components', 'TemplateGrid.tsx');

try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Regex to match presets: { id: '...', category: '...', ... }
    // We look for id and category close to each other
    const regex = /id:\s*'([^']+)',\s*category:\s*'([^']+)'/g;

    let match;
    const presets = [];

    while ((match = regex.exec(content)) !== null) {
        presets.push({ id: match[1], category: match[2] });
    }

    // Check specifically for makeup items
    const makeupPresets = presets.filter(p => p.id.startsWith('makeup-'));

    console.log('--- Makeup Presets Analysis ---');
    console.log(`Total Makeup Presets found: ${makeupPresets.length}`);
    makeupPresets.forEach(p => {
        console.log(`ID: ${p.id}, Category: ${p.category}`);
        if (p.category !== 'makeup') {
            console.warn(`WARNING: Preset ${p.id} has WRONG category: ${p.category}`);
        }
    });

    // Check for any duplicates
    const ids = presets.map(p => p.id);
    const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
    if (duplicates.length > 0) {
        console.log('--- Duplicates Found ---');
        console.log([...new Set(duplicates)]); // unique duplicates
    }

} catch (err) {
    console.error("Error reading file:", err);
}
