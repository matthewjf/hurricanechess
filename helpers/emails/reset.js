var sg = require('../../config/sendgrid');

var htmlContent = function(url) {
  return `
    <div style="">
      <a target=_blank style="" href=\"${url}\">
        Reset your password
      </a>
    </div>
  `;
};

var reset = function(email, url) {
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
          subject: 'ChessX: password reset',
        },
      ],
      from: {
        email: 'noreply@chessx.io',
      },
      content: [
        {
          type: 'text/html',
          value: htmlContent(url)
        },
      ],
    },
  });
};

export default reset;
