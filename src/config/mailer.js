const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '4778e47e0364c9',
    pass: 'f9f538e51c0d17',
  },
});
