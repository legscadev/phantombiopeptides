import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/account"];
const SESSION_COOKIE = "pl_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!isProtected) return NextResponse.next();

  const session = req.cookies.get(SESSION_COOKIE)?.value;
  if (session) return NextResponse.next();

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/account/:path*"],
};
