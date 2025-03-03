
import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async(email, name, profileUrl) => {
    const receipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipient,
            subject: "WELCOME TO PeerNet!",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category: "Welcome",
        })
        console.log("Email sent successfully", response);
    } catch (error) {
        throw error;
    }
}