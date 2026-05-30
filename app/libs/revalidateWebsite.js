/**
 * Calls the website's /api/revalidate endpoint to clear the Next.js cache
 * after any content change. Must be awaited in API routes (serverless exits early otherwise).
 *
 * @returns {{ ok: boolean, error?: string }}
 */
export async function revalidateWebsite() {
  const secret = process.env.REVALIDATE_SECRET;
  const url = (process.env.WEBSITE_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );

  if (!secret) {
    console.warn(
      "[revalidate] REVALIDATE_SECRET is not set — website cache will not refresh."
    );
    return { ok: false, error: "REVALIDATE_SECRET not configured" };
  }

  try {
    const res = await fetch(`${url}/api/revalidate`, {
      method: "POST",
      headers: { "x-revalidate-secret": secret },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const msg = `HTTP ${res.status}${body ? `: ${body.slice(0, 120)}` : ""}`;
      console.error(`[revalidate] Failed (${url}):`, msg);
      return { ok: false, error: msg };
    }

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[revalidate] Failed (${url}):`, msg);
    return { ok: false, error: msg };
  }
}
