
import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate, createCommentNotificationEmailTemplate, createConnectionAcceptedEmailTemplate } from "./emailTemplates.js";

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

export const sendCommentNotificatioEmail = async(
    receipientEmail, receipientName, commenterName, postUrl, commentContent) => {
    const receipient = [{email: receipientEmail}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipient,
            subject: "New Comment on Your Post",
            html: createCommentNotificationEmailTemplate(receipientName, commenterName, postUrl, commentContent),
            category: "comment_notification",
        });
        console.log("Email sent successfully", response);

    } catch (error) {
        throw error;
    }
}

export const sendConnectionAcceptedEmail = async(senderEmail, senderName, profileUrl, recipientName) => {
    const recipient = [{email: senderEmail}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: `${recipientName} accepted your connection request!`,
            html: createConnectionAcceptedEmailTemplate(senderName, profileUrl, recipientName),
            category: "connection_accepted",
        })
    } catch (error) {
        
    }
};