

/** @type { import("drizzle-kit").Config } */
import * as dotenv from 'dotenv';
dotenv.config({path: '.env.local'}); 
const DB_PATH = process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;


export default {
    schema: "./src/db/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: DB_PATH,
    },
};
