import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIES } from "./lib/constant/Storage";

export function proxy(request: NextRequest) {
  if (!request.cookies.has(COOKIES.ACCESS_TOKEN)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
