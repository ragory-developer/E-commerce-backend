const fs = require('fs');
const path = require('path');

const MODULES_DIR = path.join(__dirname, '../prisma/modules');
const OUTPUT_FILE = path.join(__dirname, '../prisma/schema.prisma');

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

const files = fs
  .readdirSync(MODULES_DIR)
  .filter(f => f.endsWith('.prisma'))
  .sort();

let output = header + '\n';

for (const file of files) {
  const content = fs.readFileSync(
    path.join(MODULES_DIR, file),
    'utf8'
  ).trim();

  output += `

// ========================================
// MODULE: ${file.toUpperCase()}
// ========================================

${content}
`;
}

fs.writeFileSync(OUTPUT_FILE, output.trim());
console.log('prisma/schema.prisma generated');
