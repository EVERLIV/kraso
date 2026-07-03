#!/usr/bin/env node
/**
 * Audit verified fal.ai model IDs before deploy.
 *
 * Usage:
 *   node scripts/verify-fal-models.mjs           # list registry + check docs URLs
 *   node scripts/verify-fal-models.mjs --json    # machine-readable output
 *
 * Requires network for docs URL checks.
 */

import {
  FAL_REGISTRY_VERIFIED_AT,
  FAL_MODELS,
  TEMPLATE_TIER_MODELS,
  STUDIO_TIER_MODELS,
  listAllModelIds,
} from '../functions/lib/falModelRegistry.js';

const jsonMode = process.argv.includes('--json');
const skipFetch = process.argv.includes('--skip-fetch');

async function checkDocsUrl(modelId, docsUrl) {
  if (skipFetch) return { ok: true, status: 'skipped' };
  try {
    const res = await fetch(docsUrl, { method: 'HEAD', redirect: 'follow' });
    if (res.ok) return { ok: true, status: res.status };
    // Some fal pages reject HEAD — try GET with range
    const getRes = await fetch(docsUrl, { redirect: 'follow' });
    return { ok: getRes.ok, status: getRes.status };
  } catch (err) {
    return { ok: false, status: 0, error: err.message };
  }
}

async function main() {
  const ids = listAllModelIds();
  const results = [];

  for (const id of ids) {
    const entry = FAL_MODELS[id];
    const check = await checkDocsUrl(id, entry.docsUrl);
    results.push({
      id,
      kind: entry.kind,
      label: entry.label,
      docsUrl: entry.docsUrl,
      docsOk: check.ok,
      httpStatus: check.status,
      error: check.error,
    });
  }

  const failed = results.filter((r) => !r.docsOk);
  const summary = {
    verifiedAt: FAL_REGISTRY_VERIFIED_AT,
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    templateTiers: TEMPLATE_TIER_MODELS,
    studioTiers: STUDIO_TIER_MODELS,
    models: results,
  };

  if (jsonMode) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(`\nFAL model registry — verified ${FAL_REGISTRY_VERIFIED_AT}\n`);
    console.log('Template tiers (primary → alternatives):');
    for (const [tier, cfg] of Object.entries(TEMPLATE_TIER_MODELS)) {
      console.log(`  ${tier}: ${cfg.primary}`);
      console.log(`    alt: ${cfg.alternatives.join(', ')}`);
    }
    console.log('\nStudio tiers (Kraso → FAL edit):');
    for (const [tier, cfg] of Object.entries(STUDIO_TIER_MODELS)) {
      console.log(`  ${tier}: ${cfg.primary}`);
      console.log(`    alt: ${cfg.alternatives.join(', ')}`);
    }
    console.log('\nModel docs check:');
    for (const r of results) {
      const mark = r.docsOk ? '✓' : '✗';
      console.log(`  ${mark} ${r.id} (${r.httpStatus})`);
      if (!r.docsOk) console.log(`      ${r.docsUrl}${r.error ? ` — ${r.error}` : ''}`);
    }
    console.log(`\n${summary.passed}/${summary.total} docs OK\n`);
  }

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
