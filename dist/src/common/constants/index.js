"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_CONFIG = exports.SUCCESS_MESSAGES = exports.ERROR_MESSAGES = void 0;
exports.ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'You must be logged in to access this resource',
    FORBIDDEN: 'You do not have permission to perform this action',
    TOKEN_EXPIRED: 'Your session has expired. Please login again',
    TOKEN_INVALID: 'Invalid token',
    USER_NOT_FOUND: 'User not found',
    USER_INACTIVE: 'Your account has been deactivated',
    EMAIL_EXISTS: 'An account with this email already exists',
    PHONE_EXISTS: 'An account with this phone number already exists',
    ONLY_SUPERADMIN: 'Only SuperAdmin can perform this action',
    CANNOT_MODIFY_SUPERADMIN: 'Cannot modify SuperAdmin account',
    SUPERADMIN_EXISTS: 'SuperAdmin already exists',
};
exports.SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REGISTER_SUCCESS: 'Account created successfully',
    ADMIN_CREATED: 'Admin created successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
};
exports.AUTH_CONFIG = {
    SALT_ROUNDS: 12,
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d',
    MAX_LOGIN_ATTEMPTS: 5,
    LOCK_TIME_MINUTES: 30,
};
//# sourceMappingURL=index.js.map