export declare const ERROR_MESSAGES: {
    INVALID_CREDENTIALS: string;
    UNAUTHORIZED: string;
    FORBIDDEN: string;
    TOKEN_EXPIRED: string;
    TOKEN_INVALID: string;
    USER_NOT_FOUND: string;
    USER_INACTIVE: string;
    EMAIL_EXISTS: string;
    PHONE_EXISTS: string;
    ONLY_SUPERADMIN: string;
    CANNOT_MODIFY_SUPERADMIN: string;
    SUPERADMIN_EXISTS: string;
};
export declare const SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: string;
    LOGOUT_SUCCESS: string;
    REGISTER_SUCCESS: string;
    ADMIN_CREATED: string;
    PASSWORD_CHANGED: string;
};
export declare const AUTH_CONFIG: {
    SALT_ROUNDS: number;
    ACCESS_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_EXPIRY: string;
    MAX_LOGIN_ATTEMPTS: number;
    LOCK_TIME_MINUTES: number;
};
