const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "amitdgpghosh@gmail.com",
    subject: "Thanks for signing up!",
    text: `Welcome to the app, ${name}!`,
    html:
      "<strong>Organize your tasks and increase your producitivity from anywhere!</strong>",
  });
};

module.exports = {
  sendWelcomeEmail,
};
