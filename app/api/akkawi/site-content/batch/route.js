import { NextResponse } from "next/server";
import prisma from "../../../../libs/prismadb";
import { revalidateWebsite } from "../../../../libs/revalidateWebsite";

/** Batch upsert SiteContent by key */
export async function POST(request) {
  try {
    const { items } = await request.json();
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: "items array required" },
        { status: 400 }
      );
    }

    const results = [];
    for (const { key, value } of items) {
      if (!key || value === undefined) continue;
      const row = await prisma.siteContent.upsert({
        where: { key },
        create: { key, value: String(value) },
        update: { value: String(value) },
      });
      results.push(row);
    }

    revalidateWebsite();
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Batch site content error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save content" },
      { status: 500 }
    );
  }
}

/** GET all site content as key→value map */
export async function GET() {
  try {
    const rows = await prisma.siteContent.findMany({ orderBy: { key: "asc" } });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return NextResponse.json({ success: true, data: map });
  } catch (error) {
    console.error("Site content list error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load content" },
      { status: 500 }
    );
  }
}
