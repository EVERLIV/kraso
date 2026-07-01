/**
 * Запуск теста callback из папки functions.
 * Сам скрипт лежит в корне: ../scripts/test-alfa-callback.js
 *
 * Из папки functions:
 *   node scripts/test-alfa-callback.js [email] [plan]
 *
 * Или из корня проекта:
 *   node scripts/test-alfa-callback.js [email] [plan]
 */

const path = require("path");
const { spawnSync } = require("child_process");

const rootScript = path.join(__dirname, "..", "..", "scripts", "test-alfa-callback.js");
const args = process.argv.slice(2);

const r = spawnSync(process.execPath, [rootScript, ...args], {
  stdio: "inherit",
  cwd: path.join(__dirname, "..", ".."),
  shell: false,
});

process.exit(r.status !== null ? r.status : 1);
