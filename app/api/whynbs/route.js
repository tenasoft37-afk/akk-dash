import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const data = await prisma.whyNBS.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching why NBS:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch why NBS' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sectionLabel, heading, differentiators, counters, bgImage } = body;

    if (!differentiators || !counters) {
      return NextResponse.json(
        { success: false, error: 'differentiators and counters are required' },
        { status: 400 }
      );
    }

    const created = await prisma.whyNBS.create({
      data: {
        sectionLabel,
        heading,
        differentiators,
        counters,
        bgImage,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating why NBS:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create why NBS' },
      { status: 500 }
    );
  }
}
