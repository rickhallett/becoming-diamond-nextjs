import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return new NextResponse('Missing authorization code', { status: 400 });
  }

  // Return HTML that sends the code back to the CMS opener window via postMessage
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authenticating...</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: #000;
            color: #fff;
          }
          .message {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="message">
          <h1>Authenticating...</h1>
          <p>You can close this window.</p>
        </div>
        <script>
          (function() {
            function sendMessage() {
              const data = {
                code: "${code}",
                state: "${state || ''}",
                provider: "github"
              };

              // Send to opener window
              if (window.opener) {
                window.opener.postMessage(
                  'authorization:github:success:' + JSON.stringify(data),
                  window.location.origin
                );
              }

              // Auto-close after sending
              setTimeout(function() {
                window.close();
              }, 1000);
            }

            sendMessage();
          })();
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
