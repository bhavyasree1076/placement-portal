const nodemailer = require("nodemailer");

const sendEmail = async (
  to,
  subject,
  text
) => {
  const transporter =
    nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bhavyasree1076@gmail.com",
        pass: "nyxq qcbd uguz quzs",
      },
    });

  await transporter.sendMail({
    from: "bhavyasree1076@gmail.com",
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;