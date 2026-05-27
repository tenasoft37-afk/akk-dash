import { NextResponse } from "next/server";
import prisma from "../../../libs/prismadb";
import { getAkkawiModel, pickData } from "../../../libs/akkawiModels";
import { revalidateWebsite } from "../../../libs/revalidateWebsite";

export async function GET(request, { params }) {
  const config = getAkkawiModel((await params).model);
  if (!config) {
    return NextResponse.json({ success: false, error: "Unknown model" }, { status: 404 });
  }

  try {
    const list = new URL(request.url).searchParams.get("list");
    const where = {};
    if (config.delegate === "galleryCategory") {
      if (list === "home") where.order = { lt: 10 };
      if (list === "designs") where.order = { gte: 10 };
    }

    const data = await prisma[config.delegate].findMany({
      where,
      orderBy: config.orderBy,
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AKKAWI list error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const config = getAkkawiModel((await params).model);
  if (!config) {
    return NextResponse.json({ success: false, error: "Unknown model" }, { status: 404 });
  }

  try {
    const body = await request.json();
    for (const field of config.required) {
      if (body[field] === undefined || body[field] === "") {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const data = pickData(body, config.fields);

    if (config.delegate === "career" && data.active !== undefined) {
      data.active = data.active === true || data.active === "true";
    }

    if (config.upsertKey && data[config.upsertKey]) {
      const created = await prisma[config.delegate].upsert({
        where: { [config.upsertKey]: data[config.upsertKey] },
        create: data,
        update: data,
      });
      revalidateWebsite();
      return NextResponse.json({ success: true, data: created }, { status: 201 });
    }

    const created = await prisma[config.delegate].create({ data });
    revalidateWebsite();
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("AKKAWI create error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create record" },
      { status: 500 }
    );
  }
}
