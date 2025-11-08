import { DOMAIN } from "@carbon/auth";
import type { Mode } from "@carbon/utils";
import * as cookie from "cookie";

const cookieName = "mode";

export function getMode(request: Request): Mode | null {
  const cookieHeader = request.headers.get("cookie");
  const parsed = cookieHeader
    ? cookie.parse(cookieHeader)[cookieName]
    : "light";
  if (parsed === "light" || parsed === "dark") return parsed;
  return null;
}

export function setMode(mode: Mode | "system") {
  const isProd = process.env.NODE_ENV === "production";
  const domain = isProd ? DOMAIN : undefined; // don't set domain on localhost

  if (mode === "system") {
    // clear cookie (attributes must match how it was set)
    return cookie.serialize("mode", "", {
      path: "/",
      maxAge: -1,
      domain,
    });
  }

  return cookie.serialize("mode", mode, {
    path: "/",
    maxAge: 31536000,
    domain,
  });
}
