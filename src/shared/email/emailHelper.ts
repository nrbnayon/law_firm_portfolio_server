// src\helpers\emailHelper.ts
import nodemailer from "nodemailer";
import { errorLogger, logger } from "../utils/logger";
import { ISendEmail } from "../types/email";
import config from "../../config";

export const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: Number(config.email.port),
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (values: ISendEmail) => {
  try {
    const info = await transporter.sendMail({
      from: `"Law Firm" ${config.email.from}`,
      to: values.to,
      subject: values.subject,
      html: values.html,
    });

    logger.info("Mail send successfully", info.accepted);
  } catch (error) {
    errorLogger.error("Email", error);
  }
};

export const emailHelper = {
  sendEmail,
};
