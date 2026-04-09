import { NextRequest, NextResponse } from "next/server";

const PASSWORD = process.env.SITE_PASSWORD || "Keystore";
const COOKIE_NAME = "functor-fees-auth";

export function middleware(request: NextRequest) {
  // Allow the login API route
  if (request.nextUrl.pathname === "/api/login") {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/login") ||
    request.nextUrl.pathname === "/favicon.png" ||
    request.nextUrl.pathname === "/functor-white.svg"
  ) {
    return NextResponse.next();
  }

  // Check auth cookie
  const authCookie = request.cookies.get(COOKIE_NAME);
  if (authCookie?.value === PASSWORD) {
    return NextResponse.next();
  }

  // Return login page
  return new NextResponse(loginHTML(), {
    status: 401,
    headers: { "Content-Type": "text/html" },
  });
}

function loginHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Functor - Access Required</title>
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a0a14;
      color: #f8f8f8;
      font-family: "Inter Tight", sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .container {
      text-align: center;
      max-width: 360px;
      padding: 40px;
    }
    .logo { margin-bottom: 24px; }
    h1 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    p {
      font-size: 14px;
      color: rgba(255,255,255,0.6);
      margin-bottom: 24px;
    }
    input {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      color: #f8f8f8;
      font-family: "Inter Tight", sans-serif;
      font-size: 14px;
      outline: none;
      margin-bottom: 12px;
    }
    input:focus { border-color: #1d4ed8; }
    button {
      width: 100%;
      padding: 12px;
      background: #1d4ed8;
      border: none;
      border-radius: 8px;
      color: white;
      font-family: "Inter Tight", sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    button:hover { background: #3b82f6; }
    .error {
      color: #ef4444;
      font-size: 13px;
      margin-top: 12px;
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="/functor-white.svg" alt="Functor" width="120" />
    </div>
    <h1>Protocol Fee Simulator</h1>
    <p>Enter password to continue</p>
    <form onsubmit="return handleLogin(event)">
      <input type="password" id="pwd" placeholder="Password" autocomplete="off" autofocus />
      <button type="submit">Enter</button>
    </form>
    <div class="error" id="err">Incorrect password</div>
  </div>
  <script>
    async function handleLogin(e) {
      e.preventDefault();
      const pwd = document.getElementById('pwd').value;
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        document.getElementById('err').style.display = 'block';
      }
      return false;
    }
  </script>
</body>
</html>`;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
