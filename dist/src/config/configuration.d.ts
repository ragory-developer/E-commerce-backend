declare const _default: () => {
    nodeEnv: string;
    port: number;
    database: {
        url: string | undefined;
    };
    jwt: {
        secret: string | undefined;
        accessExpires: string;
        refreshExpires: string;
    };
    superAdmin: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    };
    security: {
        bcryptRounds: number;
        throttleTtl: number;
        throttleLimit: number;
    };
};
export default _default;
