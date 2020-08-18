const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "amitdgpghosh@gmail.com",
    subject: "Thanks for signing up!",
    text: `Welcome to the task app, ${name}!`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "amitdgpghosh@gmail.com",
    subject: "Sorry to see you go.",
    text: `Goodbye, ${name}.Hope to see you again soon.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
