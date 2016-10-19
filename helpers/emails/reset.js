var sg = require('../../config/sendgrid');
import htmlContent from './content';

var content = function(url) {
  var line = `<a href=\"${url}\" target=_blank style="text-decoration: none; font-weight: 300; color: #03a9f4;">
      Reset your password
    </a>`;
  return htmlContent(line);
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
          value: content(url)
        },
      ],
    },
  });
};

export default reset;
