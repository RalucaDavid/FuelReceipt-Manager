import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "COMPANY" | "ACCOUNTANT";

function getRoleFromToken(token: string): Role | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    const scope: string = decoded.scope ?? "";
    if (scope.includes("ROLE_COMPANY")) return "COMPANY";
    if (scope.includes("ROLE_ACCOUNTANT")) return "ACCOUNTANT";
    return null;
  } catch {
    return null;
  }
}

const ACCOUNTANT_ONLY = ["/clients"];
const COMPANY_ONLY = ["/accountants", "/vehicles"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (!token) {
    if (isAuthPage) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const role = getRoleFromToken(token);

  const isAccountantOnly = ACCOUNTANT_ONLY.some((p) => pathname.startsWith(p));
  const isCompanyOnly = COMPANY_ONLY.some((p) => pathname.startsWith(p));

  if (isAccountantOnly && role !== "ACCOUNTANT") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isCompanyOnly && role !== "COMPANY") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
