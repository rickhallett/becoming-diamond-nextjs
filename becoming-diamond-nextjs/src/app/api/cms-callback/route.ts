import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const _state = searchParams.get('state');

  if (!code) {
    return new NextResponse('Missing authorization code', { status: 400 });
  }

  console.warn('Callback received code, exchanging for token...');

  // Exchange code for token immediately in callback
  let token = '';
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      throw new Error(tokenData.error_description || 'Failed to get access token');
    }

    token = tokenData.access_token;
    console.warn('Token obtained successfully in callback');
  } catch (error) {
    console.error('Token exchange failed in callback:', error);
    return new NextResponse('Authentication failed', { status: 500 });
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
            const token = "${token}";
            const provider = "github";

            if (!window.opener) {
              console.error('No window.opener found!');
              return;
            }

            console.log('Step 1: Notifying parent we are authorizing...');

            // Step 1: Send authorizing message to parent
            window.opener.postMessage("authorizing:" + provider, "*");

            // Step 2: Wait for acknowledgment from parent
            function receiveMessage(event) {
              console.log('Step 2: Received acknowledgment from parent:', event.data);

              // Step 3: Send token back to the acknowledged origin
              const data = {
                token: token,
                provider: provider
              };

              const message = 'authorization:' + provider + ':success:' + JSON.stringify(data);

              console.log('Step 3: Sending token to origin:', event.origin);
              window.opener.postMessage(message, event.origin);

              // Clean up listener
              window.removeEventListener("message", receiveMessage, false);

              // Close popup after successful auth
              setTimeout(function() {
                console.log('Authentication complete, closing popup...');
                window.close();
              }, 1000);
            }

            // Listen for acknowledgment
            window.addEventListener("message", receiveMessage, false);

            console.log('Waiting for parent acknowledgment...');
          })();
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
