// generate-seo.ts
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

interface SitemapConfig {
  baseUrl: string; // e.g. "https://urulico.com"
  appDirectory: string; // where your Next.js app router lives (usually "app")
  publicDirectory: string; // where sitemap.xml and robots.txt are saved (usually "public")
  sitemapPath: string; // e.g. "sitemap.xml"
  robotsTxtPath: string; // e.g. "robots.txt"
  priorityMap?: Record<string, number>; // Optional: assign route-specific priorities (0.0 - 1.0)
  changefreq?: Record<string, string>; // Optional: assign route-specific change frequencies
  additionalPaths?: string[]; // If you want to add extra routes (e.g. external or legacy pages)
}

// Default configuration
const defaultConfig: SitemapConfig = {
  baseUrl: "https://urulico.com",
  appDirectory: "app",
  publicDirectory: "public",
  sitemapPath: "sitemap.xml",
  robotsTxtPath: "robots.txt",
  priorityMap: {
    "/": 1.0,
    "/publicar": 0.8,
    "/search": 0.7,
  },
  changefreq: {
    "/": "daily",
    "/publicar": "weekly",
  },
  additionalPaths: [],
};

/**
 * Recursively walk through the given directory and return an array of file paths
 * that match Next’s page files (e.g. page.tsx, page.jsx, etc).
 */
async function getPageFiles(dir: string): Promise<string[]> {
  let files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await getPageFiles(fullPath));
    } else if (entry.isFile() && /^page\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Given a file path (e.g. "app/about/page.tsx"), return the route URL ("/about").
 * It strips off the file name and also removes “route groups” (directories in parentheses)
 * and handles index pages.
 */
function getRouteFromFile(filePath: string, appDirectory: string): string {
  // Get the relative path from the app directory
  const relativePath = path.relative(appDirectory, filePath);
  // Split into segments and remove the page file name
  const segments = relativePath.split(path.sep);
  segments.pop();

  // Remove route groups: Next.js “grouping” folders (e.g. "(marketing)")
  const filteredSegments = segments.filter(
    (segment) => !/^\(.*\)$/.test(segment)
  );

  // If the last segment is "index", remove it (since it’s not part of the URL)
  if (filteredSegments[filteredSegments.length - 1] === "index") {
    filteredSegments.pop();
  }

  // Build the URL from the remaining segments
  const route = "/" + filteredSegments.join("/");
  return route === "/" ? "/" : route;
}

/**
 * Mapping from a dynamic route “pattern” (as discovered in the file system) to a resolver
 * that queries your database and returns an array of actual route strings.
 *
 * In this example:
 * - For "/categoria/[slug]", we query the Category model for its slug.
 * - For "/servicio/[id]", we query the Service model for its id.
 *
 * (Adjust these keys and resolvers according to your file structure and desired URLs.)
 */
const dynamicResolvers: Record<string, () => Promise<string[]>> = {
  "/categoria/[slug]": async () => {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });
    return categories.map((cat) => `/categoria/${cat.slug}`);
  },
  "/servicio/[id]": async () => {
    const services = await prisma.service.findMany({ select: { id: true } });
    return services.map((svc) => `/servicio/${svc.id}`);
  },
};

/**
 * Returns true if the route string contains a dynamic segment (i.e. wrapped in square brackets).
 */
function isDynamicRoute(route: string): boolean {
  return /\[.+?\]/.test(route);
}

/**
 * For every discovered route, if it is static (no dynamic segments) then leave it as is.
 * If it is dynamic and a resolver exists in our mapping, then replace it with all the
 * concrete routes returned from that resolver.
 */
async function expandDynamicRoutes(routes: string[]): Promise<string[]> {
  const expandedRoutes: string[] = [];
  for (const route of routes) {
    if (isDynamicRoute(route)) {
      if (dynamicResolvers[route]) {
        const resolvedRoutes = await dynamicResolvers[route]();
        expandedRoutes.push(...resolvedRoutes);
      } else {
        console.warn(
          `No dynamic resolver found for route: ${route}. Skipping it.`
        );
      }
    } else {
      expandedRoutes.push(route);
    }
  }
  return expandedRoutes;
}

/**
 * Main function to generate both sitemap.xml and robots.txt.
 *
 * This function:
 * 1. Reads the app directory recursively to discover page files.
 * 2. Computes the route URL for each page.
 * 3. Expands any dynamic routes (via our Prisma resolvers).
 * 4. Optionally adds any additional paths.
 * 5. Generates the XML sitemap and robots.txt and writes them to the public directory.
 */
export async function generateSitemapAndRobots(
  config: Partial<SitemapConfig> = {}
): Promise<void> {
  const resolvedConfig = { ...defaultConfig, ...config };
  const {
    baseUrl,
    appDirectory,
    publicDirectory,
    sitemapPath,
    robotsTxtPath,
    priorityMap,
    changefreq,
    additionalPaths,
  } = resolvedConfig;

  console.log("Generating Sitemap with config:", resolvedConfig);

  try {
    // 1. Discover all Next.js page files
    const appDirPath = path.resolve(process.cwd(), appDirectory);
    const pageFiles = await getPageFiles(appDirPath);

    // 2. Convert file paths into route strings
    const routes = pageFiles.map((filePath) =>
      getRouteFromFile(filePath, appDirPath)
    );

    // 3. Expand dynamic routes using the resolvers (if applicable)
    const expandedRoutes = await expandDynamicRoutes(routes);

    // 4. Combine with any additional routes provided via config
    const allRoutes = Array.from(
      new Set([...expandedRoutes, ...(additionalPaths || [])])
    );
    console.log("Discovered routes:", allRoutes);

    // 5. Generate sitemap.xml content
    const sitemapEntries = allRoutes
      .map((url) => {
        // Build the full URL (for home page, don't duplicate a trailing slash)
        const fullUrl = `${baseUrl}${url === "/" ? "" : url}`;
        // Use route-specific priority or default
        const priority = priorityMap?.[url] ?? 0.5;
        // Use route-specific change frequency or default
        const freq = changefreq?.[url] ?? "monthly";
        // Use today’s date (or adjust as needed)
        const lastmod = new Date().toISOString().split("T")[0];
        return `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      })
      .join("");

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;

    // 6. Generate robots.txt content
    const robotsTxtContent = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/${sitemapPath}`;

    // 7. Write both files to the public directory
    const sitemapFilePath = path.join(publicDirectory, sitemapPath);
    const robotsTxtFilePath = path.join(publicDirectory, robotsTxtPath);

    await fs.writeFile(sitemapFilePath, sitemapContent, "utf-8");
    console.log(`Sitemap generated at ${sitemapFilePath}`);

    await fs.writeFile(robotsTxtFilePath, robotsTxtContent, "utf-8");
    console.log(`robots.txt generated at ${robotsTxtFilePath}`);
  } catch (error) {
    console.error("Error generating sitemap or robots.txt:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Example usage (you might call this as a build or post-build step)
async function main() {
  try {
    await generateSitemapAndRobots();
    console.log("Sitemap and robots.txt generation complete.");
  } catch (error) {
    console.error("Sitemap and robots.txt generation failed.", error);
  }
}

// Only run if not in a test environment
if (process.env.NODE_ENV !== "test") {
  main();
}
