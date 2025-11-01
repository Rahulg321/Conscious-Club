import { getAllUserIds } from "@/lib/queries";

export const baseUrl = "https://www.consciousclubb.com";

const staticRoutes = [
  "/",
  "/contact-us",
  "/discover",
  "/stories",
  "/community",
  "/support",
  "/terms-of-use",
  "/privacy-policy",
  "/cookie-policy",
];

export default async function sitemap() {
  const users = await getAllUserIds();
  const userRoutes =
    users.length > 0
      ? users.flatMap((user) => [
          {
            url: `${baseUrl}/profile/${user.id}`,
            lastModified: new Date().toISOString().split("T")[0],
          },
        ])
      : [];
  const staticRouteObjs = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...staticRouteObjs, ...userRoutes];
}
