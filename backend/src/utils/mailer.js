const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your gmail
    pass: process.env.EMAIL_PASS, // app password (not real gmail password)
  },
});

async function sendOtpEmail(toEmail, otp) {
  await transporter.sendMail({
    from: `"ResumeAIFixer" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your email - ResumeAIFixer",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
    `,
  });
}

module.exports = { sendOtpEmail };