/**
 * Calls the website's /api/revalidate endpoint to clear the Next.js cache
 * after any content change. Runs fire-and-forget (never throws).
 */
export async function revalidateWebsite() {
  const secret = process.env.REVALIDATE_SECRET;
  const url = process.env.WEBSITE_URL || "http://localhost:3000";

  if (!secret) return;

  try {
    await fetch(`${url}/api/revalidate`, {
      method: "POST",
      headers: { "x-revalidate-secret": secret },
      // Short timeout so a slow/down website never blocks the dashboard
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Silently ignore — the website's 60-second TTL will handle it eventually
  }
}
