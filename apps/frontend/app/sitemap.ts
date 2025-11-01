export const baseUrl = "https://www.consciousclubb.com";

const staticRoutes = [
  "/",
  "/pricing",
  "/about-us",
  "/exam",
  "/vendors",
  "/login",
  "/signup",
  "/product",
  "/settings",
  "/create",
  "/contact-us",
  "/terms-of-service",
  "/privacy-policy",
  "/cookie-policy",
];

export default async function sitemap() {
  // Users (for profile routes)
  //   const users = await getAllUserRoutes();
  //   const userRoutes = users
  //     ? users.flatMap((user) => [
  //         {
  //           url: `${baseUrl}/profile/${user.id}`,
  //           lastModified: user.updatedAt,
  //         },
  //         {
  //           url: `${baseUrl}/profile/${user.id}/info`,
  //           lastModified: user.updatedAt,
  //         },
  //         {
  //           url: `${baseUrl}/profile/${user.id}/exam-history`,
  //           lastModified: user.updatedAt,
  //         },
  //         {
  //           url: `${baseUrl}/profile/${user.id}/learnings`,
  //           lastModified: user.updatedAt,
  //         },
  //         {
  //           url: `${baseUrl}/profile/${user.id}/subscription`,
  //           lastModified: user.updatedAt,
  //         },
  //       ])
  //     : [];

  // Static routes
  const staticRouteObjs = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...staticRouteObjs];
}
