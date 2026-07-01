
import fs from 'fs';
import path from 'path';

function getEnv(key) {
    try {
        const envPath = path.resolve('.env');
        if (!fs.existsSync(envPath)) return null;
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.trim().startsWith(`${key}=`)) {
                return line.split('=')[1].trim().replace(/^["']|["']$/g, '');
            }
        }
    } catch (e) {
        console.error('Error reading .env:', e);
    }
    return null;
}

const API_KEY = getEnv('VITE_GEMINI_API_KEY');

if (!API_KEY) {
    console.error('❌ ERROR: VITE_GEMINI_API_KEY is not set in .env');
    process.exit(1);
}

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Failed to list models:', error);
    }
}

listModels();
