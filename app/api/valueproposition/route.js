import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const data = await prisma.valueProposition.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching value proposition:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch value proposition' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sectionLabel, heading, painPoints } = body;

    if (!painPoints) {
      return NextResponse.json(
        { success: false, error: 'painPoints is required' },
        { status: 400 }
      );
    }

    const created = await prisma.valueProposition.create({
      data: {
        sectionLabel,
        heading,
        painPoints,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating value proposition:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create value proposition' },
      { status: 500 }
    );
  }
}
