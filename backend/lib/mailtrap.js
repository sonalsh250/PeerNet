process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config(); //to access environment variables from .env file

const TOKEN = process.env.MAILTRAP_TOKEN;
console.log("Using Mailtrap Token:", TOKEN);
export const mailtrapClient = new MailtrapClient({
    token: TOKEN
});

export const sender = {
    email:process.env.EMAIL_FROM,
    name:process.env.EMAIL_FROM_NAME
};
