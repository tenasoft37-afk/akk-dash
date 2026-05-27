import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const data = await prisma.industries.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching industries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch industries' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sectionLabel, heading, subtitle, spotlightTitle, spotlightDesc, spotlightImage, fmcgServices, items } = body;

    if (!subtitle || !spotlightDesc || !spotlightImage || !fmcgServices || !items) {
      return NextResponse.json(
        { success: false, error: 'subtitle, spotlightDesc, spotlightImage, fmcgServices, and items are required' },
        { status: 400 }
      );
    }

    const created = await prisma.industries.create({
      data: {
        sectionLabel,
        heading,
        subtitle,
        spotlightTitle,
        spotlightDesc,
        spotlightImage,
        fmcgServices,
        items,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating industries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create industries' },
      { status: 500 }
    );
  }
}
