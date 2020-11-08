import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (to: string, html: string) => {
  //let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "waqomlfp73nh62ke@ethereal.email",
      pass: "xBRdk4cQSc13ENPwqd",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'nourba591@gmail.com', // sender address
    to,
    subject: "Change Password ✔", // Subject line
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
