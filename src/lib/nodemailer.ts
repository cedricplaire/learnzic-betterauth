import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: String(process.env.NODEMAILER_USER),
    pass: String(process.env.NODEMAILER_APP_PASSWORD),
  },
});

export default transporter;
