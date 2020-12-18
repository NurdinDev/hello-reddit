declare namespace NodeJS {
  export interface ProcessEnv {
    CORS_ORIGIN: string;
    SESSION_SECRET: string;
    PORT: string;
    TYPEORM_CONNECTION: string;
    TYPEORM_HOST: string;
    TYPEORM_PORT: string;
    TYPEORM_USERNAME: string;
    TYPEORM_PASSWORD: string;
    TYPEORM_DATABASE: string;
    TYPEORM_SYNCHRONIZE: string;
    TYPEORM_LOGGING: string;
    TYPEORM_LOGGER: string;
  }
}
