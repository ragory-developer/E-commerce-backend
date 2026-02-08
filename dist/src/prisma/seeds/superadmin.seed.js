"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcryptjs"));
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Seeding SuperAdmin...\n');
    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@company.com';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123!';
    const firstName = process.env.SUPER_ADMIN_FIRST_NAME || 'Super';
    const lastName = process.env.SUPER_ADMIN_LAST_NAME || 'Admin';
    const existing = await prisma.admin.findFirst({
        where: { role: client_1.Role.SUPERADMIN },
    });
    if (existing) {
        console.log('⚠️  SuperAdmin already exists!');
        console.log(`   Email: ${existing.email}`);
        console.log('\n   Skipping seed...');
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const superAdmin = await prisma.admin.create({
        data: {
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: client_1.Role.SUPERADMIN,
            permissions: Object.values(client_1.Permission),
            isActive: true,
        },
    });
    console.log('✅ SuperAdmin created successfully!\n');
    console.log('   ┌────────────────────────────────────────┐');
    console.log('   │  SUPERADMIN CREDENTIALS                │');
    console.log('   ├────────────────────────────────────────┤');
    console.log(`   │  Email:     ${superAdmin.email.padEnd(27)}│`);
    console.log(`   │  Password:  ${password.padEnd(27)}│`);
    console.log('   └────────────────────────────────────────┘');
    console.log('\n   ⚠️  IMPORTANT: Change this password after first login!');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=superadmin.seed.js.map