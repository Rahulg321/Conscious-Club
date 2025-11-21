export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/cookie-policy",
  "/error",
  "/register",
  "/reset-password",
  "/new-password",
  "/new-verification",
  "/onboarding",
  "/privacy-policy",
  "/terms-of-service",
  "/license",
  "/terms-of-use",
  "/creator-terms",

];

/**
 *
 *These are the routes that are protected and user cant access without being logged in
 *@type{string}
 */
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/history",
  "/notifications",
  "/profile",
  "/settings",

  "/creative",
];

export const PROTECTED_BASE_ROUTES = ["/dashboard", "/admin"];

/**
 *
 *This is default login redirect that the user will go to after successful login and registration
 *@type{string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
export const FIRST_LOGIN_REDIRECT = "/onboarding";
