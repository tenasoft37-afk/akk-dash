import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const data = await prisma.about.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching about:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sectionLabel, heading, paragraph1, paragraph2, paragraph3, ctaText, ctaLink, stats, image, videoUrl } = body;

    if (!paragraph1 || !paragraph2 || !paragraph3 || !image) {
      return NextResponse.json(
        { success: false, error: 'paragraph1, paragraph2, paragraph3, and image are required' },
        { status: 400 }
      );
    }

    const created = await prisma.about.create({
      data: {
        sectionLabel,
        heading,
        paragraph1,
        paragraph2,
        paragraph3,
        ctaText,
        ctaLink,
        stats,
        image,
        videoUrl: videoUrl || '',
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating about:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create about' },
      { status: 500 }
    );
  }
}
