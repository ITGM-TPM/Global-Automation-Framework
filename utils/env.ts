import * as dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
    baseURL: process.env.BASE_URL!,
    env: process.env.ENV || "QA",
    email: process.env.TEST_USER_EMAIL || "",
};