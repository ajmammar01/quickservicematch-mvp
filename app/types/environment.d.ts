declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NEXT_PUBLIC_SITE_URL: string;
    NEXT_PUBLIC_API_KEY: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
  }
}
