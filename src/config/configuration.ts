/**
 * CONFIGURATION FILE
 *
 * This file loads all environment variables and provides them
 * in a structured, type-safe way throughout the application.
 *
 * HOW TO USE:
 * 1. Inject ConfigService in your class
 * 2. Call configService.get('jwt.secret')
 */

export default () => ({
  // App settings
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  },

  // Super Admin credentials (for seeding)
  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@company.com',
    password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123!',
    firstName: process.env.SUPER_ADMIN_FIRST_NAME || 'Super',
    lastName: process.env.SUPER_ADMIN_LAST_NAME || 'Admin',
  },

  // Security settings
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    throttleTtl: parseInt(process.env.THROTTLE_TTL, 10) || 60000,
    throttleLimit: parseInt(process.env.THROTTLE_LIMIT, 10) || 100,
  },
});
