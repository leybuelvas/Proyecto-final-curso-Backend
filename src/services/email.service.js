const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};


/**
 * Send error email
 * @param {object} error
 * @returns {Promise}
 */
const sendErrorEmail = async (error) => {
  const subject = 'Server Error';
  // replace this url with the link to the email verification page of your front-end app
  const to = config.email.errorEmailAddressToSend;
  const text = `
      There was an error in server,
        id: ${error.code}
        detail: ${error.message}
    `;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendErrorEmail
};
