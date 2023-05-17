import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 8080;
export const ACCESSKEY_ID = process.env.ACCESSKEY_ID;
export const SECRET_ACCESSKEY = process.env.SECRET_ACCESSKEY;
export const REGION = process.env.REGION;