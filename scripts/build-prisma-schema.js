const fs = require('fs');
const path = require('path');

const MODULES_DIR = path.join(__dirname, '../prisma/modules');
const OUTPUT_FILE = path.join(__dirname, '../prisma/schema.prisma');

/**
 * HEADER (single source of truth)
 */
const header = `
// ========================================
// AUTO-GENERATED FILE — DO NOT EDIT
// ========================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}
`.trim();

/**
 * Load modules
 */
const files = fs
  .readdirSync(MODULES_DIR)
  .filter(f => f.endsWith('.prisma'))
  .sort();

/**
 * Duplicate protection
 */
const seenDefinitions = new Set();

/**
 * Build output IN MEMORY first
 */
let output = header + '\n';

for (const file of files) {
  const filePath = path.join(MODULES_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8').trim();

  if (!content) continue;

  const normalized = content.replace(/\s+/g, ' ');

  if (seenDefinitions.has(normalized)) {
    throw new Error(`❌ Duplicate Prisma content detected in ${file}`);
  }

  seenDefinitions.add(normalized);

  output += `

// ========================================
// MODULE: ${file.toUpperCase()}
// ========================================

${content}
`;
}

/**
 * ATOMIC WRITE (overwrite, never append)
 */
fs.writeFileSync(OUTPUT_FILE, output.trim() + '\n', 'utf8');

console.log('✅ prisma/schema.prisma generated safely');
