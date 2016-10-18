var htmlContent = function(content) {
  return `
    <div style="padding: 1rem; font-size: 16px; border-radius: 2px; background-color: hsl(0,0%,26%); min-height: 250px;">
      <h1 style="margin-top: 0; font-weight: 200; color: #ffa726">ChessX</h1>`
      + content +
      `<p style="margin-top: 2rem; font-weight: 200; color: white">Questions? <a style="font-weight: 200; color: #03a9f4;" href="mailto:contact@chessx.io">Email us</a></p>
    </div>
  `;
};

export default htmlContent;
