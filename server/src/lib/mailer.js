import nodemailer from "nodemailer";

const hasLiveMail = process.env.MAILTRAP_USER && process.env.MAILTRAP_PASS;

let transporter = null;
if (hasLiveMail) {
  transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || "smtp.mailtrap.io",
    port: Number(process.env.MAILTRAP_PORT || 2525),
    auth: { user: process.env.MAILTRAP_USER, pass: process.env.MAILTRAP_PASS },
  });
}

export async function sendEmail({ to, subject, text, html }) {
  if (!transporter) {
    console.log("\n[TEST OUTBOX] ─────────────────────────────");
    console.log("To:     ", to);
    console.log("Subject:", subject);
    console.log("Body:   ", text || html);
    console.log("────────────────────────────────────────────\n");
    return { simulated: true };
  }
  return transporter.sendMail({
    from: process.env.MAIL_FROM || "no-reply@plu-mobi.test",
    to, subject, text, html,
  });
}
