import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';
import { DEFAULT_SECTION_VISIBILITY, mergeVisibility } from '../../constants/sectionVisibility';

export async function GET() {
  try {
    const data = await prisma.siteSettings.findMany({
      orderBy: { id: 'desc' },
    });

    const first = data[0];
    const visibility = mergeVisibility(first?.visibility);

    return NextResponse.json({
      success: true,
      data: first
        ? { ...first, visibility }
        : { id: null, visibility: mergeVisibility(null) },
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const visibility = mergeVisibility(body.visibility ?? DEFAULT_SECTION_VISIBILITY);

    const created = await prisma.siteSettings.create({
      data: { visibility },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create site settings' },
      { status: 500 }
    );
  }
}
