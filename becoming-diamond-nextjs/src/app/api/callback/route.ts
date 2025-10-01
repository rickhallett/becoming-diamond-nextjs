import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return new NextResponse('Authorization code not found', { status: 400 });
  }

  // Create an HTML page that posts the code back to the CMS
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Authenticating...</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: #f5f5f5;
          }
          .container {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          p {
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Authenticating...</h1>
          <p>Please wait while we complete the authentication process.</p>
        </div>
        <script>
          (function() {
            function receiveMessage(e) {
              console.log("receiveMessage", e);
              
              if (e.origin !== window.location.origin) {
                console.log("Invalid origin:", e.origin);
                return;
              }

              if (e.data === "authorizing:github") {
                e.source.postMessage(
                  {
                    code: "${code}",
                    state: "${state || ''}"
                  },
                  e.origin
                );
              }
            }
            
            window.addEventListener("message", receiveMessage, false);
            window.opener?.postMessage("authorizing:github", window.location.origin);
          })();
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}