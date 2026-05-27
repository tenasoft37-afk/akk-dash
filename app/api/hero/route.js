import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const data = await prisma.hero.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching hero:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { heading, subtitle, highlights, stats, image, ctaText1, ctaLink1, ctaText2, ctaLink2 } = body;

    if (!heading || !subtitle || !image) {
      return NextResponse.json(
        { success: false, error: 'heading, subtitle, and image are required' },
        { status: 400 }
      );
    }

    const created = await prisma.hero.create({
      data: {
        heading,
        subtitle,
        highlights,
        stats,
        image,
        ctaText1,
        ctaLink1,
        ctaText2,
        ctaLink2,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating hero:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create hero' },
      { status: 500 }
    );
  }
}
