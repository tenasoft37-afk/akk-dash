import { NextResponse } from "next/server";
import prisma from "../../../../libs/prismadb";
import { getAkkawiModel, pickData } from "../../../../libs/akkawiModels";
import { revalidateWebsite } from "../../../../libs/revalidateWebsite";

export async function GET(_request, { params }) {
  const { model, id } = await params;
  const config = getAkkawiModel(model);
  if (!config) {
    return NextResponse.json({ success: false, error: "Unknown model" }, { status: 404 });
  }

  try {
    const record = await prisma[config.delegate].findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("AKKAWI get error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch record" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { model, id } = await params;
  const config = getAkkawiModel(model);
  if (!config) {
    return NextResponse.json({ success: false, error: "Unknown model" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const data = pickData(body, config.fields);
    if (config.delegate === "career" && data.active !== undefined) {
      data.active = data.active === true || data.active === "true";
    }
    const updated = await prisma[config.delegate].update({
      where: { id },
      data,
    });
    revalidateWebsite();
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("AKKAWI update error:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: "Failed to update record" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const { model, id } = await params;
  const config = getAkkawiModel(model);
  if (!config) {
    return NextResponse.json({ success: false, error: "Unknown model" }, { status: 404 });
  }

  try {
    await prisma[config.delegate].delete({ where: { id } });
    revalidateWebsite();
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("AKKAWI delete error:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete record" },
      { status: 500 }
    );
  }
}
