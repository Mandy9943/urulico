import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for the old category route
  if (pathname.startsWith("/categoria/")) {
    const categoria = pathname.split("/")[2];
    const url = request.nextUrl.clone();

    // Keep existing search params
    const searchParams = url.searchParams;
    searchParams.set("categoria", categoria);

    // Redirect to new route with search params
    url.pathname = "/categoria";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/categoria/:slug*",
};
