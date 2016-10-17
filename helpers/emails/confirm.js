var sg = require('../../config/sendgrid');

var htmlContent = function(url) {
  return `
    <div style="background-color: #2e2e2e; height: 100%; width: 100%;">
      <a target=_blank style="color: #03a9f4;" href=\"${url}\">
        Confirm your email address
      </a>
    </div>
  `;
};

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
          subject: 'chessX: email address confirmation',
        },
      ],
      from: {
        email: 'noreply@chessx.io',
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

export default confirm;
