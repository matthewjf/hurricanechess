var sg = require('../../config/sendgrid');

var confirm = function(email, url) {
  return sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: email,
            },
          ],
          subject: 'Hello World from the SendGrid Node.js Library!',
        },
      ],
      from: {
        email: 'test@example.com',
      },
      content: [
        {
          type: 'text/html',
          value: '<a target=_blank href=\"' + url + '\">Confirm your email</a>'
        },
      ],
    },
  });
};

module.exports = confirm;
