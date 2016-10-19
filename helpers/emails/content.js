var htmlContent = function(content) {
  return `
    <div style="padding: 1rem; font-size: 16px; border-radius: 2px; background-color: hsl(0,0%,26%); min-height: 250px;">
      <a href="https://www.chessx.io" style="text-decoration: none;">
        <h1 style="font-size: 40px; margin: 0 0 1rem 0; font-weight: 100; color: #ffa726">ChessX</h1>
      </a>`
      + content +
      `<p style="text-decoration: none; margin-top: 6rem; font-weight: 300; color: #bdbdbd">Questions?
        <a href="mailto:contact@chessx.io" style="text-decoration: none; font-weight: 200; color: #03a9f4;">
          Email us
        </a>
      </p>
    </div>
  `;
};

export default htmlContent;
