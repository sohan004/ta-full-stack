import { NextResponse } from "next/server";

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const loggedIn = req.cookies.get(process.env.NEXT_PUBLIC_ACCESS_TOKEN);

  if (!loggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (loggedIn && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
